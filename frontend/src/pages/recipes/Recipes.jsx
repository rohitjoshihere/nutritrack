import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { recipeAPI } from '../../api';

export default function Recipes() {
  const [recipes, setRecipes] = useState([]);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ dietType: '', tag: '' });

  const load = () => {
    recipeAPI.list({ search, dietType: filters.dietType, tag: filters.tag })
      .then(({ data }) => setRecipes(data)).catch(() => {});
  };

  useEffect(() => { load(); }, [search, filters]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Recipes</h1>
      <div className="flex flex-wrap gap-3 mb-6">
        <input className="input-field max-w-xs" placeholder="Search recipes..." value={search} onChange={(e) => setSearch(e.target.value)} />
        <select className="input-field max-w-[140px]" value={filters.dietType} onChange={(e) => setFilters({ ...filters, dietType: e.target.value })}>
          <option value="">All Types</option><option value="veg">Veg</option><option value="non_veg">Non-Veg</option>
        </select>
        <select className="input-field max-w-[160px]" value={filters.tag} onChange={(e) => setFilters({ ...filters, tag: e.target.value })}>
          <option value="">All Tags</option><option value="high_protein">High Protein</option>
          <option value="low_carb">Low Carb</option><option value="low_fat">Low Fat</option>
        </select>
        <Link to="/recipes/favorites" className="btn-secondary">❤️ Favorites</Link>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {recipes.map((r) => (
          <Link key={r._id} to={`/recipes/${r._id}`} className="card hover:shadow-md transition">
            <div className="flex justify-between items-start">
              <h3 className="font-semibold">{r.name}</h3>
              <span className="text-xs bg-slate-100 px-2 py-0.5 rounded capitalize">{r.dietType.replace('_', ' ')}</span>
            </div>
            <p className="text-sm text-slate-500 mt-1 line-clamp-2">{r.description}</p>
            <div className="flex gap-3 mt-3 text-xs text-slate-600">
              <span>🔥 {r.calories} kcal</span><span>⏱ {r.prepTime} min</span>
            </div>
            <div className="flex gap-1 mt-2 flex-wrap">
              {r.tags?.map((t) => <span key={t} className="text-xs bg-primary-50 text-primary-700 px-2 py-0.5 rounded">{t.replace('_', ' ')}</span>)}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
