import { useState } from "react";
import { Link } from "wouter";
import { Plus, Search, ChefHat, Clock, Users } from "lucide-react";
import { useListRecipes, useCreateRecipe } from "@/hooks/use-recipebox";
import { Modal } from "@/components/Modal";
import type { CreateRecipeBody } from "@workspace/api-client-react";

export default function RecipeLibrary() {
  const { data: recipes, isLoading } = useListRecipes();
  const createMutation = useCreateRecipe();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState("");

  const [formData, setFormData] = useState<CreateRecipeBody>({
    title: "",
    description: "",
    category: "",
    cuisine: "",
    prepTime: 15,
    cookTime: 30,
    servings: 4,
    ingredients: [],
    instructions: []
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(
      { data: formData },
      { onSuccess: () => setIsModalOpen(false) }
    );
  };

  const filteredRecipes = recipes?.filter(r => 
    r.title.toLowerCase().includes(search.toLowerCase()) || 
    r.cuisine?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="relative rounded-3xl overflow-hidden shadow-xl mb-12">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/90 to-rose-500/80 mix-blend-multiply z-10" />
        <img 
          src={`${import.meta.env.BASE_URL}images/hero-recipe.png`} 
          alt="Culinary" 
          className="w-full h-64 object-cover object-center"
        />
        <div className="absolute inset-0 z-20 p-8 flex flex-col justify-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-white w-fit mb-4 text-sm font-medium">
            <ChefHat className="w-4 h-4" /> Recipe Manager
          </div>
          <h1 className="text-4xl md:text-5xl font-display text-white mb-2">Your Digital Kitchen</h1>
          <p className="text-white/90 text-lg max-w-xl">Store, organize, and discover your favorite recipes in one beautiful place.</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
          <input
            type="text"
            placeholder="Search recipes..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-card border-2 border-border rounded-xl focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all"
          />
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="w-full sm:w-auto px-6 py-3 bg-orange-500 text-white font-bold rounded-xl shadow-lg shadow-orange-500/25 hover:shadow-xl hover:shadow-orange-500/40 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Recipe
        </button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
          {[1,2,3,4].map(i => (
            <div key={i} className="h-64 bg-muted rounded-2xl" />
          ))}
        </div>
      ) : filteredRecipes?.length === 0 ? (
        <div className="py-20 flex flex-col items-center justify-center text-center">
          <div className="w-24 h-24 bg-orange-500/10 text-orange-500 rounded-full flex items-center justify-center mb-6">
            <ChefHat className="w-12 h-12" />
          </div>
          <h3 className="text-2xl font-display text-foreground mb-2">No Recipes Found</h3>
          <p className="text-muted-foreground max-w-sm mb-6">Start building your personal cookbook by adding your first recipe.</p>
          <button onClick={() => setIsModalOpen(true)} className="px-6 py-2 bg-orange-500 text-white rounded-lg font-bold">Add Recipe</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredRecipes?.map((recipe) => (
            <Link key={recipe.id} href={`/recipes/${recipe.id}`} className="block h-full">
              <div className="interactive-card h-full flex flex-col hover:border-orange-500/30 p-0 overflow-hidden">
                <div className="h-32 bg-gradient-to-br from-orange-100 to-rose-100 dark:from-orange-900/40 dark:to-rose-900/40 flex items-center justify-center shrink-0">
                  <ChefHat className="w-12 h-12 text-orange-400/50" />
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <div className="flex gap-2 mb-2">
                    <span className="text-xs font-bold px-2 py-1 bg-orange-100 text-orange-700 rounded-md">{recipe.cuisine || 'Global'}</span>
                  </div>
                  <h3 className="text-xl font-display text-foreground mb-2 line-clamp-1">{recipe.title}</h3>
                  <p className="text-muted-foreground text-sm line-clamp-2 mb-4 flex-1">{recipe.description}</p>
                  
                  <div className="flex items-center gap-4 text-sm font-medium text-muted-foreground border-t border-border pt-3">
                    <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> {recipe.prepTime + recipe.cookTime}m</span>
                    <span className="flex items-center gap-1.5"><Users className="w-4 h-4" /> {recipe.servings}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Recipe" maxWidth="max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-foreground mb-2">Recipe Title</label>
              <input
                required
                value={formData.title}
                onChange={e => setFormData(f => ({ ...f, title: e.target.value }))}
                className="w-full px-4 py-3 bg-muted/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                placeholder="Spaghetti Carbonara"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-foreground mb-2">Description</label>
              <textarea
                value={formData.description || ''}
                onChange={e => setFormData(f => ({ ...f, description: e.target.value }))}
                className="w-full px-4 py-3 bg-muted/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/50 min-h-[80px]"
                placeholder="A classic Italian pasta dish..."
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-foreground mb-2">Category</label>
              <input
                value={formData.category || ''}
                onChange={e => setFormData(f => ({ ...f, category: e.target.value }))}
                className="w-full px-4 py-3 bg-muted/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                placeholder="Dinner"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-foreground mb-2">Cuisine</label>
              <input
                value={formData.cuisine || ''}
                onChange={e => setFormData(f => ({ ...f, cuisine: e.target.value }))}
                className="w-full px-4 py-3 bg-muted/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                placeholder="Italian"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-foreground mb-2">Prep Time (mins)</label>
              <input
                type="number"
                value={formData.prepTime}
                onChange={e => setFormData(f => ({ ...f, prepTime: parseInt(e.target.value) || 0 }))}
                className="w-full px-4 py-3 bg-muted/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/50"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-foreground mb-2">Cook Time (mins)</label>
              <input
                type="number"
                value={formData.cookTime}
                onChange={e => setFormData(f => ({ ...f, cookTime: parseInt(e.target.value) || 0 }))}
                className="w-full px-4 py-3 bg-muted/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/50"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-foreground mb-2">Servings</label>
              <input
                type="number"
                value={formData.servings}
                onChange={e => setFormData(f => ({ ...f, servings: parseInt(e.target.value) || 1 }))}
                className="w-full px-4 py-3 bg-muted/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/50"
              />
            </div>
          </div>
          <div className="pt-4 flex justify-end gap-3 border-t border-border">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 text-muted-foreground font-bold hover:bg-muted rounded-xl transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={createMutation.isPending} className="px-5 py-2.5 bg-orange-500 text-white font-bold rounded-xl shadow-lg shadow-orange-500/25 hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-50">
              {createMutation.isPending ? "Saving..." : "Save Recipe"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
