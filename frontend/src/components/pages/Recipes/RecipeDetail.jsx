import { useEffect, useState } from 'react';
import SectionWrapper from '../../common/SectionWrapper';
import { Link, useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Review from '../Review';
import Swal from 'sweetalert2';
import '../../css/common.css';
import '../../css/recipeDetail.css';
import { useCookies } from 'react-cookie';

const RecipeDetail = () => {
    const navigate = useNavigate();
    let { slug } = useParams();
    const [recipe, setRecipe] = useState(null);
    const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
    const [isSameUser, setIsSameUser] = useState(false);
    const [cookies] = useCookies();

    const checkUserExist = () => {
        return cookies.auth !== undefined;
    }

    const checkSameUser = (user_id) => {
        if (cookies.auth !== undefined) {
            return cookies.auth.userid === user_id;
        }
        return false;
    }

    const getRecipe = async () => {
        try {
            const response = await fetch(`http://localhost:8000/api/recipes/${slug}`);
            const data = await response.json();
            if (data.status === 200) {
                setRecipe(data.data);
            } else {
                Swal.fire({
                    title: 'Error',
                    text: data.message,
                    icon: 'error',
                    confirmButtonText: 'Okay'
                });
            }
        } catch (error) {
            Swal.fire({
                title: 'Error',
                text: error.message,
                icon: 'error',
                confirmButtonText: 'Okay'
            });
        }
    };

    const addToFavorites = async () => {
        const requestData = {
            userId: cookies.auth.userid,
            recipeId: parseInt(slug, 10),
        };

        try {
            const response = await fetch(`http://localhost:8000/api/favorites/addFavorite`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestData),
            });

            const responseData = await response.json();

            if (response.ok) {
                Swal.fire({
                    title: 'Recipe added to favorites!',
                    text: 'The recipe has been added to your favorites.',
                    icon: 'success',
                    confirmButtonText: 'Okay'
                });
            } else {
                Swal.fire({
                    title: 'Error',
                    text: responseData.message || 'Something went wrong!',
                    icon: 'error',
                    confirmButtonText: 'Okay'
                });
            }
        } catch (error) {
            Swal.fire({
                title: 'Error',
                text: error.message,
                icon: 'error',
                confirmButtonText: 'Okay'
            });
        }
    };

    const deleteRecipe = async () => {
        try {
            const response = await fetch(`http://localhost:8000/api/recipes/deleteRecipe/${slug}`, {
                method: 'DELETE',
            });
            const data = await response.json();
            if (data.status === 200) {
                Swal.fire({
                    title: 'Recipe deleted successfully!',
                    text: 'The recipe has been deleted.',
                    icon: 'success',
                    confirmButtonText: 'Okay'
                }).then(() => {
                    navigate(-1);
                });
            } else {
                Swal.fire({
                    title: 'Error',
                    text: data.message,
                    icon: 'error',
                    confirmButtonText: 'Okay'
                });
                navigate('/recipes');
            }
        } catch (error) {
            Swal.fire({
                title: 'Error',
                text: error.message,
                icon: 'error',
                confirmButtonText: 'Okay'
            });
            navigate('/recipes');
        }
    };

    useEffect(() => {
        getRecipe();
    }, [slug]);

    useEffect(() => {
        setIsUserLoggedIn(checkUserExist());
        if (recipe) {
            setIsSameUser(checkSameUser(recipe.userid));
        }
    }, [cookies, recipe]);

    if (!recipe) {
        return <div>Loading...</div>;
    }

    return (
        <SectionWrapper>
            <div className="shadow p-5 recipe-detail-container">
                <h1 className="recipe-title">{recipe.name}</h1>
                <img className="recipe-image" src={recipe.image} alt={recipe.name} />
                {isUserLoggedIn && <button className='btn btn-primary' onClick={addToFavorites}>Add To Favorites</button>}
                <div className="recipe-section">
                    <h2 className="section-title">Ingredients</h2>
                    <ul className="ingredients-list">
                        {recipe.ingredients.map((ingredient, index) => (
                            <li key={index} className="ingredient-item">{ingredient}</li>
                        ))}
                    </ul>
                </div>
                <div className="recipe-section">
                    <h2 className="section-title">Steps</h2>
                    <ol className="steps-list">
                        {recipe.steps.map((step, index) => (
                            <li key={index} className="step-item">{step}</li>
                        ))}
                    </ol>
                </div>
                <div className="recipe-section">
                    <h2 className="section-title">Notes</h2>
                    <p className="recipe-notes">{recipe.notes}</p>
                </div>
                <div className="recipe-section">
                    <h2 className="section-title">Tags</h2>
                    <div className="tags-container">
                        {recipe.tags.map((tag, index) => (
                            <span key={index} className="tag-item">{tag}</span>
                        ))}
                    </div>
                </div>
                <div className="action-buttons">
                    {
                        isUserLoggedIn && 
                    <Link to={`/review/addReview/${recipe.recipeid}`} className="action-button">Add Review</Link>
                    }
                    {isSameUser && (<>
                        <Link to={`/recipes/editRecipesForm/${recipe.recipeid}`} className="action-button">Edit Recipe</Link>
                        <button onClick={deleteRecipe} className="action-button delete-button">Delete Recipe</button>
                    </>
                    )}
                </div>
                <Review id={slug} />
            </div>
        </SectionWrapper>
    );
};

export default RecipeDetail;
