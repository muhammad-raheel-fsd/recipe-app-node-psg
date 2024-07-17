import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom"
import { useNavigate } from "react-router-dom";
import SectionWrapper from "../../common/SectionWrapper";
import Swal from "sweetalert2";
import StarRatings from "react-star-ratings";
import '../../css/restaurantDetail.css';
import CheckUserLogin from "../../utils/sameUserLogin";

const RestaurantDetail = () => {
  const navigate = useNavigate();
  let { slug } = useParams();

  const [restaurant, setRestaurant] = useState({});
  const [cuisineName, setCuisineName] = useState();
  const [recipes, setRecipes] = useState([])

  const getRecipes = async () => {
    const response = await fetch(`${import.meta.env.VITE_API_ENDPOINT}/api/resturants/recipes/${slug}`);
    const data = await response.json();
    setRecipes(data.data);
  }

  const getCuisine = async () => {
    const response = await fetch(`${import.meta.env.VITE_API_ENDPOINT}/api/cuisines/${restaurant.cuisineid}`);
    const data = await response.json();
    setCuisineName(data.data.name)
  }

  useEffect(() => {

    fetch(`${import.meta.env.VITE_API_ENDPOINT}/api/restaurants/${slug}`)
      .then(response => response.json())
      .then(data => {
        setRestaurant(data.data);
      })
      .catch(error => {
        console.error("Error:", error);
      });
    getCuisine();
    getRecipes();
  }, [slug])

  const deleteRestaurant = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_ENDPOINT}/api/restaurants/deleteRestaurant/${slug}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const result = await response.json();
      if (result.status === 200) {
        Swal.fire({
          title: 'Deleted!',
          text: 'Restaurant has been deleted.',
          icon: 'success',
          confirmButtonText: 'Ok'
        })
        navigate('/restaurant');


      } else {
        Swal.fire({
          title: 'Error!',
          text: 'Failed to delete restaurant.',
          icon: 'error',
          confirmButtonText: 'Ok'
        });
        navigate('/restaurant');
      }
    } catch (error) {
      Swal.fire({
        title: 'Error!',
        text: 'Failed to delete restaurant',
        icon: 'error',
        confirmButtonText: 'Ok'
      });
      navigate('/restaurant');
    }
  }

  return (
    <SectionWrapper>
      <div className="shadow p-4">
        <div className="restaurant-grid">
          <div className="sm:flex-shrink-0">
            <img className="restaurant-detail-img" src={restaurant.image} alt={restaurant.name} />
          </div>
          <div className="">
            <label>Restaurant</label>
            <h1 className="indent">{restaurant.name}</h1>
            <label>Location</label>
            <p className="indent">{restaurant.location}</p>
            <label>Description</label>
            <p className="indent">{restaurant.notes}</p>
            <label>Cuisine Type</label>
            <div className="indent">{cuisineName}</div>
            <label>Rating </label>
            <div className="ml-4">
              <StarRatings
                rating={restaurant.rating}
                starRatedColor="gold"
                numberOfStars={5}
                starDimension="20px"
                starSpacing="1px"
              />

            </div>
          </div>
        </div>
        <div className="restaurant-grid mt-3">
          <div className="flex-row">
            <p className="restaurant-tags">{restaurant.name}</p>
            <p className="restaurant-tags">{restaurant.location}</p>
            {/* <p className="restaurant-tags">{cuisineName}</p> */}
          </div>
          {
            CheckUserLogin(restaurant.userid) &&
            <div className="flex-end">
              <Link to={`/restaurant/updateRestaurant/${slug}`} className="btn btn-primary">
                Edit Restaurant
              </Link>
              <button onClick={deleteRestaurant} className="btn btn-danger">
                Delete Restaurant
              </button>
              <Link to={`/recipes/recipesForm/${slug}`} className="btn btn-primary">
                Add a recipe
              </Link>
            </div>
          }
        </div>

        <h1 className="heading mt-5">
          Recipes at {restaurant.name}
        </h1>
        {
          !recipes &&
          <h1 className="no-recipe indent mt-3">No Recipe are here</h1>
        }

        <div className="grid grid-sm-2 grid-md-3 grid-lg-4 mt-5">
          {recipes && recipes.map((recipe, index) => (
            <div key={index} className="card">
              <img src={recipe.image} alt={recipe.name} />
              <div className="card-content flex">
                <h2>{recipe.name}</h2>
                <p> {recipe.notes}</p>
                <Link to={`/recipes/recipesDetail/${recipe.recipeid}`} className="btn btn-primary">
                  More Detail
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  )
}

export default RestaurantDetail