import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { recipeAPI } from '../../api';
import toast from 'react-hot-toast';

export default function RecipeDetail() {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);

  useEffect(() => {
    recipeAPI.get(id).then(({ data }) => setRecipe(data)).catch(() => {});
  }, [id]);

  const toggleFavorite = async () => {
    await recipeAPI.toggleFavorite(id);
    toast.success('Favorites updated!');
  };

  if (!recipe) return <p>Loading...</p>;

  return (
    <div className="max-w-2xl">
      <Link to="/recipes" className="text-sm text-primary-600 hover:underline">← Back to Recipes</Link>
      <div className="card mt-4">
        <div className="flex justify-between items-start">
          <h1 className="text-2xl font-bold">{recipe.name}</h1>
          <button onClick={toggleFavorite} className="btn-secondary text-sm">❤️ Save</button>
        </div>
        <p className="text-slate-500 mt-2">{recipe.description}</p>
        <div className="flex flex-wrap gap-4 mt-4 text-sm">
          <span>🔥 {recipe.calories} kcal</span><span>🥩 {recipe.protein}g protein</span>
          <span>🍞 {recipe.carbs}g carbs</span><span>🧈 {recipe.fat}g fat</span>
          <span>⏱ {recipe.prepTime} min</span>
        </div>
        <div className="mt-6">
          <h2 className="font-semibold mb-2">Ingredients</h2>
          <ul className="list-disc list-inside text-slate-600 space-y-1">
            {recipe.ingredients?.map((i, idx) => <li key={idx}>{i}</li>)}
          </ul>
        </div>
        <div className="mt-6">
          <h2 className="font-semibold mb-2">Instructions</h2>
          <p className="text-slate-600 whitespace-pre-line">{recipe.instructions}</p>
        </div>
      </div>
    </div>
  );
}
