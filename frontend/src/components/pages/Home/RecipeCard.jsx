import React from 'react';
import { Link } from 'react-router-dom'; 

const RecipeCard = ({ recipes }) => {
  return (
    <>
      {recipes && (
        <>
          <h1 className="heading mb-4">Searching Items are here</h1>
          <div className="grid grid-sm-2 grid-md-3 grid-lg-4">
            {recipes.map((recipe, index) => (
              <div key={index} className="card">
                <img src={recipe.image} alt={recipe.name} />
                <div className="card-content flex">
                  <h2>{recipe.name}</h2>
                  <p>{recipe.notes}</p>
                  <Link to={`/recipes/recipesDetail/${recipe.recipeId}`} className="btn btn-primary">
                    More Detail
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </>
  );
};

export default RecipeCard;
