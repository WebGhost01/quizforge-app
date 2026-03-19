import { useState } from "react";
import { useParams, useLocation } from "wouter";
import { ArrowLeft, CheckCircle2, XCircle, RotateCcw } from "lucide-react";
import { useGetQuiz, useSubmitQuizAttempt } from "@/hooks/use-quizforge";
import { motion, AnimatePresence } from "framer-motion";

export default function TakeQuiz() {
  const { id } = useParams();
  const quizId = parseInt(id || "0");
  const [, setLocation] = useLocation();
  
  const { data: quiz, isLoading } = useGetQuiz(quizId);
  const submitAttempt = useSubmitQuizAttempt(quizId);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState<number | null>(null);

  if (isLoading || !quiz) return <div className="p-10 text-center animate-pulse">Loading...</div>;

  const questions = quiz.questions || [];
  
  if (questions.length === 0) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-display mb-4">No Questions Available</h2>
        <button onClick={() => setLocation(`/quizzes/${quizId}`)} className="text-primary hover:underline">Go back to edit quiz</button>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  const isLastQuestion = currentIndex === questions.length - 1;
  const progress = ((currentIndex) / questions.length) * 100;

  const handleSelectAnswer = (ans: string) => {
    setAnswers(prev => ({ ...prev, [currentQuestion.id.toString()]: ans }));
  };

  const handleNext = () => {
    if (isLastQuestion) {
      submitAttempt.mutate({
        data: { quizId, answers }
      }, {
        onSuccess: (res) => {
          setScore(res.score);
          setIsSubmitted(true);
        }
      });
    } else {
      setCurrentIndex(c => c + 1);
    }
  };

  if (isSubmitted) {
    const percentage = Math.round(((score || 0) / questions.length) * 100);
    return (
      <div className="max-w-2xl mx-auto py-12 px-4">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-card p-10 rounded-3xl shadow-xl border border-border text-center relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 pointer-events-none" />
          
          <div className="relative z-10">
            <h2 className="text-3xl font-display mb-6">Quiz Completed!</h2>
            <div className="w-40 h-40 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-8 border-4 border-primary/20">
              <span className="text-5xl font-bold text-primary">{percentage}%</span>
            </div>
            <p className="text-xl text-foreground mb-8">You scored <span className="font-bold">{score}</span> out of {questions.length}.</p>
            
            <div className="flex justify-center gap-4">
              <button 
                onClick={() => setLocation(`/quizzes/${quizId}`)}
                className="px-6 py-3 bg-muted text-foreground font-bold rounded-xl hover:bg-muted/80 transition-colors"
              >
                Back to Details
              </button>
              <button 
                onClick={() => {
                  setAnswers({});
                  setCurrentIndex(0);
                  setIsSubmitted(false);
                  setScore(null);
                }}
                className="px-6 py-3 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/25 hover:-translate-y-1 transition-all flex items-center gap-2"
              >
                <RotateCcw className="w-5 h-5" /> Retake Quiz
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8 py-8">
      <div className="flex items-center justify-between">
        <button onClick={() => setLocation(`/quizzes/${quizId}`)} className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 font-medium">
          <ArrowLeft className="w-5 h-5" /> Quit Attempt
        </button>
        <div className="text-sm font-bold text-muted-foreground">
          Question {currentIndex + 1} of {questions.length}
        </div>
      </div>

      <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
        <motion.div 
          className="h-full bg-gradient-to-r from-primary to-secondary"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
          className="bg-card rounded-3xl p-8 shadow-lg border border-border"
        >
          <h2 className="text-2xl font-display text-foreground mb-8 leading-relaxed">
            {currentQuestion.question}
          </h2>

          <div className="space-y-4">
            {Array.isArray(currentQuestion.options) && currentQuestion.options.map((opt: string, idx: number) => {
              const isSelected = answers[currentQuestion.id.toString()] === opt;
              return (
                <button
                  key={idx}
                  onClick={() => handleSelectAnswer(opt)}
                  className={`w-full text-left px-6 py-4 rounded-2xl border-2 transition-all duration-200 flex items-center justify-between ${
                    isSelected 
                      ? 'border-primary bg-primary/5 text-primary' 
                      : 'border-border bg-muted/20 text-foreground hover:border-primary/30 hover:bg-muted/50'
                  }`}
                >
                  <span className="text-lg font-medium">{opt}</span>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    isSelected ? 'border-primary bg-primary' : 'border-muted-foreground/30'
                  }`}>
                    {isSelected && <div className="w-2.5 h-2.5 bg-white rounded-full" />}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-10 flex justify-end">
            <button
              onClick={handleNext}
              disabled={!answers[currentQuestion.id.toString()] || submitAttempt.isPending}
              className="px-8 py-3 bg-foreground text-background font-bold rounded-xl shadow-md hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-50 disabled:transform-none transition-all"
            >
              {isLastQuestion ? (submitAttempt.isPending ? "Submitting..." : "Submit Quiz") : "Next Question"}
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
