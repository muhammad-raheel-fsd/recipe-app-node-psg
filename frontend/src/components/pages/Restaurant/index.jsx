import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import SectionWrapper from "../../common/SectionWrapper";
import '../../css/restaurants.css';
import IsUserExist from '../../utils/isUserExist';

const Restaurant = () => {
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_ENDPOINT}/api/restaurants`)
      .then(response => response.json())
      .then(data => {
        setRestaurants(data.data);
        console.log("data is ", data.data)
      })
      .catch(error => console.error('Error fetching restaurants:', error));
  }, []);

  return (
    <SectionWrapper>
      <h1 className='restaurant-heading text-center'>Welcome to Restaurant Management System</h1>
      <div className="restaurant-grid">
        <div className="restaurants-list">
          <div className='flex-space-between mb-3'>
            <h1 className='restaurant-heading'>All RESTAURANTS</h1>
            {
              IsUserExist() &&<Link to="/restaurant/addRestaurant" className="btn btn-primary">Add New Restaurant</Link>
            }
          </div>
          <ol className="restaurant-ol">
            {restaurants.map((restaurant) => (
              <li key={restaurant.id}>
                <Link to={`/restaurant/restaurantDetail/${restaurant.id}`} className='text-blue-600'>
                  {restaurant.name}
                </Link>
              </li>
            ))}
          </ol>
        </div>
        <div className="restaurant-grid restaurant-card-grid">
          {restaurants.map((restaurant) => (
            <div key={restaurant.id} className="flex-row restauratCard shadow">
              <img src={restaurant.image} alt="Restaurant Image" className='w-14 h-14 object-cover' />
              <Link to={`/restaurant/restaurantDetail/${restaurant.restaurantid}`} className='text-blue-600'>
                {restaurant.name}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
};

export default Restaurant;