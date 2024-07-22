import Navbar from "./components/common/Navbar";
import Home from "./components/pages/Home";
import Restaurant from "./components/pages/Restaurant";
import Recipes from "./components/pages/Recipes";
import Favorites from "./components/pages/Favorites";
import Categories from "./components/pages/Categories";
import { Routes, Route } from "react-router-dom";
import Login from "./components/authentication/Login";
import Signup from "./components/authentication/Signup";
import AddRestaurantForm from "./components/common/forms/restaurant/AddRestaurantForm";
import CuisineDetail from "./components/pages/Categories/CuisineDetail";
import RestaurantDetail from "./components/pages/Restaurant/RestaurantDetail";
import CuisineForm from "./components/common/forms/cuisine/CuisineForm";
import CuisineFormUpdate from "./components/common/forms/cuisine/CuisineFormUpdate";
import UpdateRestaurantForm from "./components/common/forms/restaurant/UpdateRestaurant";
import AddRecipeForm from "./components/common/forms/recipes/AddRecipeForm";
import EditRecipeForm from "./components/common/forms/recipes/EditRecipeForm";
import RecipeDetail from "./components/pages/Recipes/RecipeDetail";
import AddReviewForm from "./components/common/forms/review/AddReviewForm";
import EditReview from "./components/common/forms/review/EditReview";
import UpdateUser from "./components/authentication/Update/Index";
const App = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/restaurant" element={<Restaurant />} />
        <Route path="/recipes" element={<Recipes />} />
        <Route path="/recipes/recipesDetail/:slug" element={<RecipeDetail />} />
        <Route path="/recipes/recipesForm/:slug" element={<AddRecipeForm />} />
        <Route
          path="/recipes/editRecipesForm/:slug"
          element={<EditRecipeForm />}
        />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/auth/signup" element={<Signup />} />
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/updateUser" element={<UpdateUser />} />
        <Route
          path="/restaurant/addRestaurant"
          element={<AddRestaurantForm />}
        />
        <Route
          path="/restaurant/updateRestaurant/:slug"
          element={<UpdateRestaurantForm />}
        />
        <Route
          path="/restaurant/restaurantDetail/:slug"
          element={<RestaurantDetail />}
        />
        <Route path="/cuisine/cuisineForm" element={<CuisineForm />} />
        <Route
          path="/cuisine/updateForm/:slug"
          element={<CuisineFormUpdate />}
        />
        <Route
          path="/cuisine/cuisineDetail/:slug"
          element={<CuisineDetail />}
        />
        <Route path="/review/addReview/:slug" element={<AddReviewForm />} />
        <Route
          path="/review/updateReview/:recipe/:slug"
          element={<EditReview />}
        />

        {/* <Route path="*" element={<NotFound />} /> */}
      </Routes>
    </>
  );
};

export default App;
