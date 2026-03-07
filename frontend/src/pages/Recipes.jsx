import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authenticatedFetch } from "../lib/api";
import { useAuth } from "../context/AuthContext";

const Recipes = () => {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();
  const [recipes, setRecipes] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    if (!isAuthenticated) {
      navigate("/login", {
        replace: true,
        state: { message: "Please login to view recipes." },
      });
      return;
    }

    try {
      setIsLoading(true);
      setError("");
      const response = await authenticatedFetch("/api/recipes");
      const data = await response.json().catch(() => []);

      if (!response.ok) {
        if (response.status === 401) {
          logout();
          navigate("/login", {
            replace: true,
            state: { message: "Session expired. Please login again." },
          });
          return;
        }

        throw new Error(data.message || "Unable to fetch recipes.");
      }

      setRecipes(data);
    } catch (fetchError) {
      setError(fetchError.message || "Unable to fetch recipes.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    fetchData();
  }, [isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated) {
      return undefined;
    }

    const interval = setInterval(() => {
      fetchData();
    }, 3000);

    return () => clearInterval(interval);
  }, [isAuthenticated]);

  return (
    <div className="flex justify-center bg-slate-200 flex-col min-h-screen items-center px-4">
      <div className="w-full max-w-xl">
        <div className="flex items-center justify-between my-5">
          <h1 className="text-2xl font-semibold">Recipes</h1>
          <Link to="/dashboard" className="btn btn-outline btn-sm">
            Back to Dashboard
          </Link>
        </div>

        {isLoading && <p className="mb-4">Loading recipes...</p>}
        {error && <div className="alert alert-error mb-4">{error}</div>}

        <ul>
          {recipes.map((recipe) => (
            <div
              key={recipe.id}
              className="bg-white grid grid-cols-2 px-10 py-5 rounded-md shadow-md border border-slate-600 mb-3"
            >
              <li>{recipe.id}</li>
              <li>{recipe.name}</li>
            </div>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Recipes;
