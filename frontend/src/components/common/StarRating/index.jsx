import React from 'react';

const StarRating = ({ rating }) => {
  const totalStars = 5;
  const filledStars = Math.floor(rating);
  const halfStars = rating % 1 !== 0 ? 1 : 0;
  const emptyStars = totalStars - filledStars - halfStars;

  return (
    <div className="flex items-center">
      {[...Array(filledStars)].map((_, index) => (
        <svg
          key={`filled-${index}`}
          className="h-5 w-5 text-yellow-500"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M12 .587l3.668 7.429 8.2 1.174-5.917 5.773 1.396 8.137L12 18.896 4.653 23l1.396-8.137L.132 9.19l8.2-1.174L12 .587z" />
        </svg>
      ))}
      {halfStars === 1 && (
        <svg
          className="h-5 w-5 text-yellow-500"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M12 17.27l-5.18 2.73 1-5.97-4.35-4.25 6-.87L12 2l2.53 5.91 6 .87-4.35 4.25 1 5.97z" />
        </svg>
      )}
      {[...Array(emptyStars)].map((_, index) => (
        <svg
          key={`empty-${index}`}
          className="h-5 w-5 text-gray-300"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M12 .587l3.668 7.429 8.2 1.174-5.917 5.773 1.396 8.137L12 18.896 4.653 23l1.396-8.137L.132 9.19l8.2-1.174L12 .587z" />
        </svg>
      ))}
    </div>
  );
};

export default StarRating;
