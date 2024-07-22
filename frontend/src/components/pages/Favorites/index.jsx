import { useEffect, useState } from "react";
import SectionWrapper from "../../common/SectionWrapper";
import { Link } from "react-router-dom";
import { useCookies } from "react-cookie";
import "../../css/favorites.css";

const Favorites = () => {
  const [cookies] = useCookies();
  const [userExist, setUserExist] = useState();
  const [userId, setUserId] = useState();

  useEffect(() => {
    if (cookies.auth !== undefined) {
      setUserExist(true);
      setUserId(cookies.auth.userId);
      console.log("user id is", cookies.auth.userId);
    } else setUserExist(false);
  }, [cookies]);

  const [favorites, setFavorites] = useState([]);
  const getFavorites = async () => {
    const result = await fetch(
      `${import.meta.env.VITE_API_ENDPOINT}/api/favorites/${cookies.auth.userId}`
    );
    const data = await result.json();
    console.log(data);
    if (result.status === 200) setFavorites(data.data);
  };

  useEffect(() => {
    getFavorites();
  }, [cookies]);

  console.log("FAV === ", favorites);

  return (
    <SectionWrapper>
      <h1 className="heading text-center mb-5">All Your Favorites are here</h1>
      {!userExist && (
        <div className="favorites">
          <p>You are not logged in. Please login to access your favorites.</p>
          <div>
            <Link to="/auth/login" className="btn btn-primary">
              Login
            </Link>
          </div>
        </div>
      )}
      {userExist && (
        <div className="grid grid-sm-2 grid-md-3 grid-lg-4">
          {favorites.map(({ Recipe: recipe }, index) => {
            console.log("REC", recipe);
            return (
              <div key={index} className="card">
                <img src={recipe.image} alt={recipe.name} />
                <div className="card-content flex">
                  <h2>{recipe.name}</h2>
                  <p> {recipe.notes} </p>
                  <Link
                    to={`/recipes/recipesDetail/${recipe.recipeId}`}
                    className="btn btn-primary"
                  >
                    More Detail
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </SectionWrapper>
  );
};

export default Favorites;
