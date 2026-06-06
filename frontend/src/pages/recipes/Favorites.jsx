import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { recipeAPI } from '../../api';

export default function Favorites() {
  const [recipes, setRecipes] = useState([]);
  useEffect(() => { recipeAPI.favorites().then(({ data }) => setRecipes(data)).catch(() => {}); }, []);

  return (
    <div>
      <Link to="/recipes" className="text-sm text-primary-600 hover:underline">← All Recipes</Link>
      <h1 className="text-2xl font-bold mt-2 mb-6">Favorite Recipes</h1>
      <div className="grid sm:grid-cols-2 gap-4">
        {recipes.map((r) => (
          <Link key={r._id} to={`/recipes/${r._id}`} className="card hover:shadow-md">{r.name}</Link>
        ))}
        {recipes.length === 0 && <p className="text-slate-500">No favorites yet.</p>}
      </div>
    </div>
  );
}
