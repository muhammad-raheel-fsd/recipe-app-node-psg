import { useEffect, useState } from "react";
import SectionWrapper from "../../common/SectionWrapper"
import { Link } from "react-router-dom";
import '../../css/common.css';

const Recipes = () => {
  const [recipes, setRecipes] = useState([]);

  const getRecipes = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_ENDPOINT}api/recipes`);
      const data = await response.json();
      console.log(data.data);
      if (data.status === 200) {
        console.log(data.data);
        setRecipes(data.data);
      }
    }
    catch (error) {
      console.error('Error fetching recipes:', error);
    }
  }

  useEffect(() => {
    getRecipes();
  }, []);


  return (
    <SectionWrapper>
      {
        !recipes && <h1 className="heading text-center mb-4">There is no recipe</h1>
      }

      {
        recipes && <>
          <h1 className="heading text-center mb-4">All Recipes are here</h1>
          <div className="grid grid-sm-2 grid-md-3 grid-lg-4">
            {recipes.map((recipe, index) => (
              <div key={index} className="card">
                <img src={recipe.image} alt={recipe.name} />
                <div className="card-content flex">
                  <h2>{recipe.name}</h2>
                  <p> {recipe.notes}   </p>
                  <Link to={`/recipes/recipesDetail/${recipe.recipeid}`} className="btn btn-primary">
                    More Detail
                  </Link>
                </div>
              </div>
            ))}
          </div>

        </>
      }
    </SectionWrapper>
  )
}

export default Recipes



// SELECT r.*
// FROM recipes r
// JOIN restaurants rt ON r.restaurantid = rt.restaurantid
// WHERE (r.name ILIKE '%Risce%'
//    OR rt.name ILIKE '%Asli Hasmza%'
//    OR r.ingredients @> ARRAY['Rice'])
// AND 'Rice' = ANY (r.tags);

// SELECT r.*
// FROM recipes r
// JOIN restaurants rt ON r.restaurantid = rt.restaurantid
// WHERE (r.name ILIKE '%Risce%'
//    OR rt.name ILIKE '%Asli Hasmza%'
//    OR r.ingredients @> ARRAY['Rice'])
// AND 'yes' = ANY (r.tags);
