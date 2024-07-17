import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import StarRatings from "react-star-ratings";
import Swal from "sweetalert2";
import '../../css/review.css'; 
import { useCookies } from "react-cookie";

const Review = ({ id  }) => {
    const [reviews, setReviews] = useState([]);
    const [cookies] = useCookies();

    const isSameUser = ()=>{
        if(cookies.auth !== undefined)
        {
            return cookies.auth.userid === reviews.userid;
        }
    }

    const getReviews = async (id) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_ENDPOINT}api/recipe/reviews/${id}`);
            const data = await response.json();
            if (data.status === 200) {
                setReviews(data.data);
            }
        } catch (error) {
            console.log('error in fetching reviews=====>', error);
        }
    };

    const deleteReview = async (reviewId) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_ENDPOINT}api/reviews/deleteReview/${reviewId}`, {
                method: 'DELETE',
            });
            const result = await response.json();

            if (result.status === 200) {
                setReviews(prevReviews => prevReviews.filter(review => review.reviewid !== reviewId));
                Swal.fire({
                    title: 'Deleted!',
                    text: 'Review has been deleted.',
                    icon: 'success',
                    confirmButtonText: 'Continue'
                });
            } else {
                Swal.fire({
                    title: 'Error!',
                    text: 'Failed to delete review.',
                    icon: 'error',
                    confirmButtonText: 'Continue'
                });
            }
        } catch (error) {
            Swal.fire({
                title: 'Error!',
                text: 'Failed to delete review.',
                icon: 'error',
                confirmButtonText: 'Continue'
            });
        }
    }

    useEffect(() => {
        getReviews(id);
    }, [id]);

    return (
        <div className='review-container'>
            {reviews.length === 0 ? (
                <h1 className='no-reviews'>No reviews found</h1>
            ) : (
                <>
                    <h1 className='all-reviews'>All Reviews are here</h1>
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
                                {
                                    isSameUser && <div className='review-actions'>
                                    <Link to={`/review/updateReview/${review.reviewid}`} className='edit-button'>Edit</Link>
                                    <button onClick={() => deleteReview(review.reviewid)} className='delete-button'>Delete</button>
                                </div>}
                            </div>
                        </div>
                    ))}
                </>
            )}
        </div>
    )
}

export default Review;