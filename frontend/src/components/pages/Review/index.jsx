import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import StarRatings from "react-star-ratings";
import Swal from "sweetalert2";
import "../../css/review.css";
import { useCookies } from "react-cookie";

const Review = ({ id: recipeId }) => {
  const [reviews, setReviews] = useState([]);
  const [cookies] = useCookies();
  const [isSameUser, setIsSameUser] = useState(false);

  // const isSameUser = () => {
  //   if (cookies.auth !== undefined) {
  //     return cookies.auth.userId === reviews.userId;
  //   }
  // };

  const checkSameUser = (user_id) => {
    if (cookies.auth !== undefined) {
      return cookies.auth.userId === user_id;
    }
    return false;
  };

  // useEffect(() => {
  //   if (reviews) {
  //     setIsSameUser(checkSameUser(reviews.userId));
  //   }
  // }, [cookies, reviews]);

  const getReviews = async (recipeId) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_ENDPOINT}/api/recipes/reviews/${recipeId}`
      );
      const data = await response.json();
      if (data.status === 200) {
        setReviews(data.data);
      }
    } catch (error) {
      console.log("error in fetching reviews=====>", error);
    }
  };

  const deleteReview = async (reviewId) => {
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_API_ENDPOINT
        }/api/reviews/deleteReview/${reviewId}`,
        {
          method: "DELETE",
        }
      );
      const result = await response.json();

      if (result.status === 200) {
        setReviews((prevReviews) =>
          prevReviews.filter((review) => review.reviewId !== reviewId)
        );
        Swal.fire({
          title: "Deleted!",
          text: "Review has been deleted.",
          icon: "success",
          confirmButtonText: "Continue",
        });
      } else {
        Swal.fire({
          title: "Error!",
          text: "Failed to delete review.",
          icon: "error",
          confirmButtonText: "Continue",
        });
      }
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: "Failed to delete review.",
        icon: "error",
        confirmButtonText: "Continue",
      });
    }
  };

  useEffect(() => {
    getReviews(recipeId);
  }, [recipeId]);

  return (
    <div className="review-container">
      {reviews.length === 0 ? (
        <h1 className="no-reviews">No reviews found</h1>
      ) : (
        <>
          <h1 className="all-reviews">All Reviews are here</h1>
          {reviews.map((review, index) => (
            <div key={index} className="review-card">
              <div className="rating">
                <StarRatings
                  rating={review.rating}
                  starDimension="20px"
                  starSpacing="2px"
                />
              </div>
              <div>
                <h1 className="message-title">Message</h1>
                <p className="message-content">{review.content}</p>
              </div>
              <div className="review-footer">
                <span>{new Date(review.date).toLocaleString()}</span>
                {checkSameUser(review.userId) && (
                  <div className="review-actions">
                    <Link
                      to={`/review/updateReview/${recipeId}/${review.reviewId}`}
                      className="edit-button"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => deleteReview(review.reviewId)}
                      className="delete-button"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default Review;
