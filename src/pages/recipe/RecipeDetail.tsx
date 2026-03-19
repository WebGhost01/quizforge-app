import { useState } from "react";
import { Link, useParams, useLocation } from "wouter";
import { ArrowLeft, Clock, Users, Flame, Trash2, Edit3, Heart } from "lucide-react";
import { useGetRecipe, useDeleteRecipe, useUpdateRecipe } from "@/hooks/use-recipebox";
import { Modal } from "@/components/Modal";

export default function RecipeDetail() {
  const { id } = useParams();
  const recipeId = parseInt(id || "0");
  const [, setLocation] = useLocation();
  
  const { data: recipe, isLoading } = useGetRecipe(recipeId);
  const deleteRecipe = useDeleteRecipe();
  const updateRecipe = useUpdateRecipe();

  const [isEditing, setIsEditing] = useState(false);
  const [ingredientsText, setIngredientsText] = useState("");
  const [instructionsText, setInstructionsText] = useState("");

  const handleOpenEdit = () => {
    setIngredientsText(Array.isArray(recipe?.ingredients) ? recipe.ingredients.join("\n") : "");
    setInstructionsText(Array.isArray(recipe?.instructions) ? recipe.instructions.join("\n") : "");
    setIsEditing(true);
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    const ingredients = ingredientsText.split("\n").filter(Boolean);
    const instructions = instructionsText.split("\n").filter(Boolean);
    
    updateRecipe.mutate({
      id: recipeId,
      data: { ingredients, instructions }
    }, {
      onSuccess: () => setIsEditing(false)
    });
  };

  const handleDelete = () => {
    if (confirm("Delete this recipe forever?")) {
      deleteRecipe.mutate({ id: recipeId }, {
        onSuccess: () => setLocation("/recipes")
      });
    }
  };

  if (isLoading || !recipe) return <div className="p-10 text-center animate-pulse">Warming up the oven...</div>;

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <Link href="/recipes" className="inline-flex items-center gap-2 text-muted-foreground hover:text-orange-500 transition-colors font-medium">
          <ArrowLeft className="w-4 h-4" /> Back to Recipes
        </Link>
        <div className="flex gap-2">
          <button onClick={handleDelete} className="p-2.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl transition-colors">
            <Trash2 className="w-5 h-5" />
          </button>
          <button onClick={handleOpenEdit} className="p-2.5 text-muted-foreground hover:text-orange-500 hover:bg-orange-500/10 rounded-xl transition-colors">
            <Edit3 className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="bg-card rounded-3xl p-8 md:p-12 border border-border shadow-sm">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          <div className="flex-1">
            <div className="flex gap-3 mb-4">
              <span className="bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">{recipe.cuisine}</span>
              <span className="bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">{recipe.category}</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-display text-foreground mb-4">{recipe.title}</h1>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">{recipe.description}</p>
            
            <div className="flex flex-wrap gap-6 p-6 bg-muted/30 rounded-2xl border border-border/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900/40 flex items-center justify-center text-orange-500"><Clock className="w-5 h-5" /></div>
                <div>
                  <p className="text-xs text-muted-foreground font-bold">PREP</p>
                  <p className="font-medium text-foreground">{recipe.prepTime} min</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-rose-100 dark:bg-rose-900/40 flex items-center justify-center text-rose-500"><Flame className="w-5 h-5" /></div>
                <div>
                  <p className="text-xs text-muted-foreground font-bold">COOK</p>
                  <p className="font-medium text-foreground">{recipe.cookTime} min</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-blue-500"><Users className="w-5 h-5" /></div>
                <div>
                  <p className="text-xs text-muted-foreground font-bold">YIELDS</p>
                  <p className="font-medium text-foreground">{recipe.servings} servings</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-card border border-border rounded-3xl p-8 shadow-sm">
            <h3 className="text-2xl font-display mb-6">Ingredients</h3>
            {Array.isArray(recipe.ingredients) && recipe.ingredients.length > 0 ? (
              <ul className="space-y-4">
                {recipe.ingredients.map((ing: string, i: number) => (
                  <li key={i} className="flex gap-3 text-foreground items-start">
                    <div className="w-2 h-2 rounded-full bg-orange-500 shrink-0 mt-2" />
                    <span className="leading-relaxed">{ing}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center p-6 border-2 border-dashed border-border rounded-xl">
                <p className="text-muted-foreground mb-4">No ingredients added yet.</p>
                <button onClick={handleOpenEdit} className="text-sm font-bold text-orange-500">Add Ingredients</button>
              </div>
            )}
          </div>
        </div>
        
        <div className="lg:col-span-2">
          <div className="bg-card border border-border rounded-3xl p-8 shadow-sm">
            <h3 className="text-2xl font-display mb-8">Instructions</h3>
            {Array.isArray(recipe.instructions) && recipe.instructions.length > 0 ? (
              <div className="space-y-8">
                {recipe.instructions.map((inst: string, i: number) => (
                  <div key={i} className="flex gap-6 items-start">
                    <div className="shrink-0 w-8 h-8 rounded-full bg-foreground text-background flex items-center justify-center font-bold text-sm">
                      {i + 1}
                    </div>
                    <p className="text-foreground leading-relaxed pt-1">{inst}</p>
                  </div>
                ))}
              </div>
            ) : (
               <div className="text-center p-10 border-2 border-dashed border-border rounded-xl">
                <p className="text-muted-foreground mb-4">No instructions added yet.</p>
                <button onClick={handleOpenEdit} className="text-sm font-bold text-orange-500">Add Instructions</button>
              </div>
            )}
          </div>
        </div>
      </div>

      <Modal isOpen={isEditing} onClose={() => setIsEditing(false)} title="Edit Recipe Content" maxWidth="max-w-3xl">
        <form onSubmit={handleUpdate} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-foreground mb-2">Ingredients (One per line)</label>
              <textarea
                value={ingredientsText}
                onChange={e => setIngredientsText(e.target.value)}
                className="w-full px-4 py-3 bg-muted/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/50 min-h-[300px]"
                placeholder="2 cups flour&#10;1 tsp salt"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-foreground mb-2">Instructions (One step per line)</label>
              <textarea
                value={instructionsText}
                onChange={e => setInstructionsText(e.target.value)}
                className="w-full px-4 py-3 bg-muted/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/50 min-h-[300px]"
                placeholder="Preheat oven to 350F.&#10;Mix dry ingredients."
              />
            </div>
          </div>
          <div className="pt-4 flex justify-end gap-3 border-t border-border">
            <button type="button" onClick={() => setIsEditing(false)} className="px-5 py-2.5 text-muted-foreground font-bold hover:bg-muted rounded-xl transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={updateRecipe.isPending} className="px-5 py-2.5 bg-orange-500 text-white font-bold rounded-xl shadow-lg shadow-orange-500/25 hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-50">
              {updateRecipe.isPending ? "Saving..." : "Save Content"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
