import React, { useEffect, useState } from 'react'

const Recipes = () => {
    const [recipes, setRecipes] = useState([]);

    useEffect(() => {
        const fetchdata = async () => {
            try{
                const response = await fetch('http://localhost:8000/api/recipes')
                const data = await response.json();
                setRecipes(data);
            }catch(error){
                console.error('Error Fetching Recipes Data', error)
            }
        }

        fetchdata();
    }, [])
  return (
    <div className='flex justify-center bg-slate-200 flex-col min-h-screen items-center'>
        <h1 className='my-5'>Recipes</h1>
        <ul>
            {recipes.map((recipe) => (
                <div key={recipe.id} className="bg-white grid grid-cols-2 px-10 py-5 rounded-md shadow-md border border-slate-600">
                     <li>
                        {recipe.id}
                     </li>
                     <li>
                        {recipe.name}
                    </li>
                </div>
               
            ))}
        </ul>

    </div>
  )
}

export default Recipes