import { useState } from "react";
import { Link } from "wouter";
import { Plus, Search, Brain, Trophy, ChevronRight, LayoutDashboard } from "lucide-react";
import { useListQuizzes, useCreateQuiz } from "@/hooks/use-quizforge";
import { Modal } from "@/components/Modal";
import type { CreateQuizBody } from "@workspace/api-client-react";

export default function QuizLibrary() {
  const { data: quizzes, isLoading } = useListQuizzes();
  const createMutation = useCreateQuiz();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState("");

  const [formData, setFormData] = useState<CreateQuizBody>({
    title: "",
    description: "",
    category: "",
    difficulty: "Medium",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(
      { data: formData },
      { onSuccess: () => setIsModalOpen(false) }
    );
  };

  const filteredQuizzes = quizzes?.filter(q => 
    q.title.toLowerCase().includes(search.toLowerCase()) || 
    q.category?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="relative rounded-3xl overflow-hidden shadow-xl mb-12">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-secondary/80 mix-blend-multiply z-10" />
        <img 
          src={`${import.meta.env.BASE_URL}images/hero-quiz.png`} 
          alt="Education" 
          className="w-full h-64 object-cover object-center"
        />
        <div className="absolute inset-0 z-20 p-8 flex flex-col justify-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-white w-fit mb-4 text-sm font-medium">
            <Brain className="w-4 h-4" /> Quiz Platform
          </div>
          <h1 className="text-4xl md:text-5xl font-display text-white mb-2">Master Your Knowledge</h1>
          <p className="text-white/90 text-lg max-w-xl">Create custom quizzes, test yourself, and track your learning journey over time.</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
          <input
            type="text"
            placeholder="Search quizzes..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-card border-2 border-border rounded-xl focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
          />
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="w-full sm:w-auto px-6 py-3 bg-primary text-primary-foreground font-bold rounded-xl shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/40 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Create Quiz
        </button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="h-48 bg-muted rounded-2xl" />
          ))}
        </div>
      ) : filteredQuizzes?.length === 0 ? (
        <div className="py-20 flex flex-col items-center justify-center text-center">
          <img src={`${import.meta.env.BASE_URL}images/empty-state.png`} alt="Empty" className="w-48 h-48 mb-6 drop-shadow-xl" />
          <h3 className="text-2xl font-display text-foreground mb-2">No Quizzes Found</h3>
          <p className="text-muted-foreground max-w-sm mb-6">You haven't created any quizzes yet, or none match your search.</p>
          <button onClick={() => setIsModalOpen(true)} className="px-6 py-2 bg-primary text-white rounded-lg font-bold">Create First Quiz</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredQuizzes?.map((quiz) => (
            <Link key={quiz.id} href={`/quizzes/${quiz.id}`} className="block">
              <div className="interactive-card h-full flex flex-col group">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-primary/10 text-primary rounded-xl">
                    <Trophy className="w-6 h-6" />
                  </div>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                    quiz.difficulty === 'Easy' ? 'bg-green-100 text-green-700' :
                    quiz.difficulty === 'Hard' ? 'bg-red-100 text-red-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {quiz.difficulty || 'Medium'}
                  </span>
                </div>
                <h3 className="text-xl font-display text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-1">{quiz.title}</h3>
                <p className="text-muted-foreground text-sm flex-1 line-clamp-2 mb-6">{quiz.description}</p>
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-border/50">
                  <span className="text-sm font-medium text-muted-foreground bg-muted px-3 py-1 rounded-md">{quiz.category || 'General'}</span>
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Quiz">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-foreground mb-2">Quiz Title</label>
            <input
              required
              value={formData.title}
              onChange={e => setFormData(f => ({ ...f, title: e.target.value }))}
              className="w-full px-4 py-3 bg-muted/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50"
              placeholder="e.g., JavaScript Fundamentals"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-foreground mb-2">Description</label>
            <textarea
              value={formData.description || ''}
              onChange={e => setFormData(f => ({ ...f, description: e.target.value }))}
              className="w-full px-4 py-3 bg-muted/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 min-h-[100px]"
              placeholder="What is this quiz about?"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-foreground mb-2">Category</label>
              <input
                value={formData.category || ''}
                onChange={e => setFormData(f => ({ ...f, category: e.target.value }))}
                className="w-full px-4 py-3 bg-muted/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="Programming"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-foreground mb-2">Difficulty</label>
              <select
                value={formData.difficulty || 'Medium'}
                onChange={e => setFormData(f => ({ ...f, difficulty: e.target.value }))}
                className="w-full px-4 py-3 bg-muted/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option>Easy</option>
                <option>Medium</option>
                <option>Hard</option>
              </select>
            </div>
          </div>
          <div className="pt-4 flex justify-end gap-3 border-t border-border">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 text-muted-foreground font-bold hover:bg-muted rounded-xl transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={createMutation.isPending} className="px-5 py-2.5 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/25 hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-50">
              {createMutation.isPending ? "Creating..." : "Create Quiz"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
