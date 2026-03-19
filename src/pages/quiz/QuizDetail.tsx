import { useState } from "react";
import { Link, useParams, useLocation } from "wouter";
import { ArrowLeft, Play, Plus, Trash2, Edit3, CheckCircle2, GripVertical } from "lucide-react";
import { useGetQuiz, useDeleteQuiz, useCreateQuizQuestion, useDeleteQuizQuestion, useListQuizAttempts } from "@/hooks/use-quizforge";
import { Modal } from "@/components/Modal";

export default function QuizDetail() {
  const { id } = useParams();
  const quizId = parseInt(id || "0");
  const [, setLocation] = useLocation();
  
  const { data: quiz, isLoading } = useGetQuiz(quizId);
  const { data: attempts } = useListQuizAttempts(quizId);
  
  const deleteQuiz = useDeleteQuiz();
  const createQuestion = useCreateQuizQuestion(quizId);
  const deleteQuestion = useDeleteQuizQuestion(quizId);

  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);
  const [newQuestion, setNewQuestion] = useState({
    question: "",
    optionsText: "",
    correctAnswer: ""
  });

  const handleAddQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    const options = newQuestion.optionsText.split("\n").filter(Boolean);
    if (!options.includes(newQuestion.correctAnswer)) {
      alert("Correct answer must exactly match one of the options.");
      return;
    }
    createQuestion.mutate({
      data: {
        quizId,
        question: newQuestion.question,
        options,
        correctAnswer: newQuestion.correctAnswer
      }
    }, {
      onSuccess: () => {
        setIsQuestionModalOpen(false);
        setNewQuestion({ question: "", optionsText: "", correctAnswer: "" });
      }
    });
  };

  const handleDeleteQuiz = () => {
    if (confirm("Are you sure you want to delete this quiz?")) {
      deleteQuiz.mutate({ id: quizId }, {
        onSuccess: () => setLocation("/quizzes")
      });
    }
  };

  if (isLoading || !quiz) return <div className="p-10 text-center text-muted-foreground animate-pulse">Loading quiz details...</div>;

  return (
    <div className="space-y-8">
      <Link href="/quizzes" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors font-medium">
        <ArrowLeft className="w-4 h-4" /> Back to Quizzes
      </Link>

      <div className="bg-card rounded-3xl p-8 border border-border shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-bold">{quiz.category || 'General'}</span>
              <span className="bg-accent/20 text-accent-foreground px-3 py-1 rounded-full text-sm font-bold">{quiz.difficulty}</span>
            </div>
            <h1 className="text-4xl font-display text-foreground mb-3">{quiz.title}</h1>
            <p className="text-muted-foreground text-lg max-w-2xl">{quiz.description}</p>
          </div>
          <div className="flex gap-3 shrink-0">
            <button onClick={handleDeleteQuiz} className="p-4 bg-destructive/10 text-destructive hover:bg-destructive hover:text-white rounded-2xl transition-colors">
              <Trash2 className="w-6 h-6" />
            </button>
            <Link href={`/quizzes/${quizId}/take`}>
              <div className="px-8 py-4 bg-primary text-white rounded-2xl font-bold text-lg shadow-lg shadow-primary/25 hover:shadow-xl hover:-translate-y-1 transition-all flex items-center gap-3 cursor-pointer">
                <Play className="w-5 h-5 fill-current" />
                Start Quiz
              </div>
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-display">Questions ({quiz.questions?.length || 0})</h2>
            <button onClick={() => setIsQuestionModalOpen(true)} className="flex items-center gap-2 text-sm font-bold bg-muted px-4 py-2 rounded-lg hover:bg-primary hover:text-white transition-colors">
              <Plus className="w-4 h-4" /> Add Question
            </button>
          </div>
          
          <div className="space-y-4">
            {quiz.questions?.map((q, idx) => (
              <div key={q.id} className="bg-card border border-border rounded-2xl p-6 shadow-sm flex gap-4">
                <div className="shrink-0 mt-1 cursor-grab text-muted-foreground">
                  <GripVertical className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-bold text-foreground mb-4"><span className="text-primary mr-2">{idx + 1}.</span> {q.question}</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {Array.isArray(q.options) && q.options.map((opt: string, oIdx: number) => (
                      <div key={oIdx} className={`px-4 py-3 rounded-xl border ${opt === q.correctAnswer ? 'bg-green-50 border-green-200 text-green-800' : 'bg-muted/50 border-transparent text-muted-foreground'}`}>
                        <div className="flex items-center justify-between">
                          <span>{opt}</span>
                          {opt === q.correctAnswer && <CheckCircle2 className="w-5 h-5 text-green-600" />}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <button 
                  onClick={() => {
                    if (confirm("Delete this question?")) {
                      deleteQuestion.mutate({ id: q.id });
                    }
                  }} 
                  className="shrink-0 text-muted-foreground hover:text-destructive self-start p-2"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
            {(!quiz.questions || quiz.questions.length === 0) && (
              <div className="p-12 text-center border-2 border-dashed border-border rounded-2xl">
                <p className="text-muted-foreground">No questions added yet. Add some questions to make this quiz playable!</p>
              </div>
            )}
          </div>
        </div>

        <div>
          <div className="bg-card border border-border rounded-3xl p-6 shadow-md sticky top-6">
            <h3 className="text-xl font-display mb-6 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-accent" /> Recent Attempts
            </h3>
            <div className="space-y-4">
              {attempts?.length ? attempts.map(attempt => (
                <div key={attempt.id} className="flex justify-between items-center p-4 bg-muted/30 rounded-xl border border-border/50">
                  <div>
                    <p className="font-bold text-foreground">Score: {attempt.score}</p>
                    <p className="text-xs text-muted-foreground">{new Date(attempt.createdAt!).toLocaleDateString()}</p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                    {Math.round((attempt.score / (quiz.questions?.length || 1)) * 100)}%
                  </div>
                </div>
              )) : (
                <p className="text-muted-foreground text-sm text-center py-4">No attempts recorded yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <Modal isOpen={isQuestionModalOpen} onClose={() => setIsQuestionModalOpen(false)} title="Add Question">
        <form onSubmit={handleAddQuestion} className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-foreground mb-2">Question Text</label>
            <input
              required
              value={newQuestion.question}
              onChange={e => setNewQuestion(q => ({ ...q, question: e.target.value }))}
              className="w-full px-4 py-3 bg-muted/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50"
              placeholder="e.g., What is closure in JavaScript?"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-foreground mb-2">Options (One per line)</label>
            <textarea
              required
              value={newQuestion.optionsText}
              onChange={e => setNewQuestion(q => ({ ...q, optionsText: e.target.value }))}
              className="w-full px-4 py-3 bg-muted/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 min-h-[120px]"
              placeholder="Option A&#10;Option B&#10;Option C&#10;Option D"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-foreground mb-2">Exact Correct Answer</label>
            <input
              required
              value={newQuestion.correctAnswer}
              onChange={e => setNewQuestion(q => ({ ...q, correctAnswer: e.target.value }))}
              className="w-full px-4 py-3 bg-muted/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50"
              placeholder="Must exactly match one of the lines above"
            />
          </div>
          <div className="pt-4 flex justify-end gap-3 border-t border-border">
            <button type="button" onClick={() => setIsQuestionModalOpen(false)} className="px-5 py-2.5 text-muted-foreground font-bold hover:bg-muted rounded-xl transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={createQuestion.isPending} className="px-5 py-2.5 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/25 hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-50">
              {createQuestion.isPending ? "Adding..." : "Add Question"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
