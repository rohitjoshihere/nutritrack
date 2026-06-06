import { useEffect, useState } from 'react';
import { adminAPI, recipeAPI } from '../../api';
import toast from 'react-hot-toast';

export default function AdminPanel() {
  const [tab, setTab] = useState('users');
  const [stats, setStats] = useState({});
  const [users, setUsers] = useState([]);
  const [foods, setFoods] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [recipeForm, setRecipeForm] = useState({ name: '', description: '', ingredients: '', instructions: '', calories: 0, protein: 0, carbs: 0, fat: 0, prepTime: 30, dietType: 'veg', tags: '' });
  const [foodForm, setFoodForm] = useState({ name: '', servingSize: '100g', calories: 0, protein: 0, carbs: 0, fat: 0, dietType: 'both' });

  const load = () => {
    adminAPI.stats().then(({ data }) => setStats(data));
    adminAPI.users().then(({ data }) => setUsers(data));
    adminAPI.foods().then(({ data }) => setFoods(data));
    recipeAPI.list().then(({ data }) => setRecipes(data));
  };

  useEffect(() => { load(); }, []);

  const blockUser = async (id) => { await adminAPI.blockUser(id); load(); toast.success('User updated'); };
  const deleteUser = async (id) => { if (confirm('Delete user?')) { await adminAPI.deleteUser(id); load(); } };

  const createRecipe = async (e) => {
    e.preventDefault();
    await recipeAPI.create({ ...recipeForm, ingredients: recipeForm.ingredients.split(',').map(s => s.trim()), tags: recipeForm.tags.split(',').map(s => s.trim()).filter(Boolean), calories: +recipeForm.calories, protein: +recipeForm.protein, carbs: +recipeForm.carbs, fat: +recipeForm.fat, prepTime: +recipeForm.prepTime });
    toast.success('Recipe added');
    load();
  };

  const deleteRecipe = async (id) => { await recipeAPI.remove(id); load(); toast.success('Deleted'); };

  const createFood = async (e) => {
    e.preventDefault();
    await adminAPI.createFood({ ...foodForm, calories: +foodForm.calories, protein: +foodForm.protein, carbs: +foodForm.carbs, fat: +foodForm.fat });
    toast.success('Food added');
    load();
  };

  const deleteFood = async (id) => { await adminAPI.deleteFood(id); load(); };

  const tabs = ['users', 'recipes', 'foods'];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">Admin Panel</h1>
      <div className="flex gap-4 mb-6 text-sm">
        <span className="card py-2 px-3">👥 {stats.users} Users</span>
        <span className="card py-2 px-3">🍳 {stats.recipes} Recipes</span>
        <span className="card py-2 px-3">🥗 {stats.foods} Foods</span>
      </div>

      <div className="flex gap-2 mb-6">
        {tabs.map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 rounded-lg text-sm font-medium capitalize ${tab === t ? 'bg-primary-600 text-white' : 'bg-white border'}`}>{t}</button>
        ))}
      </div>

      {tab === 'users' && (
        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="text-left border-b"><th className="py-2">Name</th><th>Email</th><th>Role</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id} className="border-b border-slate-50">
                  <td className="py-2">{u.name}</td><td>{u.email}</td><td>{u.role}</td>
                  <td>{u.isBlocked ? '🔴 Blocked' : '🟢 Active'}</td>
                  <td className="space-x-2">
                    {u.role !== 'admin' && <>
                      <button onClick={() => blockUser(u._id)} className="text-amber-600 hover:underline">{u.isBlocked ? 'Unblock' : 'Block'}</button>
                      <button onClick={() => deleteUser(u._id)} className="text-red-600 hover:underline">Delete</button>
                    </>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'recipes' && (
        <div className="space-y-6">
          <form onSubmit={createRecipe} className="card grid sm:grid-cols-2 gap-3">
            <input className="input-field" placeholder="Recipe name" value={recipeForm.name} onChange={(e) => setRecipeForm({ ...recipeForm, name: e.target.value })} required />
            <select className="input-field" value={recipeForm.dietType} onChange={(e) => setRecipeForm({ ...recipeForm, dietType: e.target.value })}>
              <option value="veg">Veg</option><option value="non_veg">Non-Veg</option>
            </select>
            <input className="input-field sm:col-span-2" placeholder="Description" value={recipeForm.description} onChange={(e) => setRecipeForm({ ...recipeForm, description: e.target.value })} />
            <input className="input-field sm:col-span-2" placeholder="Ingredients (comma separated)" value={recipeForm.ingredients} onChange={(e) => setRecipeForm({ ...recipeForm, ingredients: e.target.value })} />
            <textarea className="input-field sm:col-span-2" placeholder="Instructions" rows={3} value={recipeForm.instructions} onChange={(e) => setRecipeForm({ ...recipeForm, instructions: e.target.value })} />
            <input className="input-field" type="number" placeholder="Calories" value={recipeForm.calories} onChange={(e) => setRecipeForm({ ...recipeForm, calories: e.target.value })} />
            <input className="input-field" placeholder="Tags (high_protein, low_carb)" value={recipeForm.tags} onChange={(e) => setRecipeForm({ ...recipeForm, tags: e.target.value })} />
            <button type="submit" className="btn-primary sm:col-span-2">Add Recipe</button>
          </form>
          {recipes.map((r) => (
            <div key={r._id} className="card flex justify-between items-center">
              <span>{r.name}</span>
              <button onClick={() => deleteRecipe(r._id)} className="text-red-500 text-sm">Delete</button>
            </div>
          ))}
        </div>
      )}

      {tab === 'foods' && (
        <div className="space-y-6">
          <form onSubmit={createFood} className="card grid sm:grid-cols-3 gap-3">
            <input className="input-field" placeholder="Food name" value={foodForm.name} onChange={(e) => setFoodForm({ ...foodForm, name: e.target.value })} required />
            <input className="input-field" placeholder="Serving size" value={foodForm.servingSize} onChange={(e) => setFoodForm({ ...foodForm, servingSize: e.target.value })} />
            <input className="input-field" type="number" placeholder="Calories" value={foodForm.calories} onChange={(e) => setFoodForm({ ...foodForm, calories: e.target.value })} />
            <button type="submit" className="btn-primary sm:col-span-3">Add Food Item</button>
          </form>
          {foods.map((f) => (
            <div key={f._id} className="card flex justify-between items-center text-sm">
              <span>{f.name} — {f.calories} kcal ({f.servingSize})</span>
              <button onClick={() => deleteFood(f._id)} className="text-red-500">Delete</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
