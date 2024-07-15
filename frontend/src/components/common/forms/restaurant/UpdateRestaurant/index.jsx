import { useEffect, useState } from 'react';
import Select from 'react-select';
import SectionWrapper from "../../../SectionWrapper";
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Swal from 'sweetalert2';
import { useNavigate, useParams } from 'react-router-dom';
import { uploadImageHandler } from '../../../../utils/FirebaseImageUpload/uploadImage';

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  location: z.string().min(1, 'Location is required'),
  cuisineType: z.number().min(1, 'Cuisine Id is required'),
  rating: z.number().min(1, 'Rating must be between 1 and 5').max(5, 'Rating must be between 1 and 5'),
  notes: z.string().min(1, 'Notes are required'),
  image: z.string().min(1, 'Image is required'),
});

const defaultValues = {
  name: "",
  location: "",
  cuisineType: null, 
  rating: 5,
  notes: "",
  image: "",
};

const UpdateRestaurantForm = () => {
  const navigate = useNavigate();
  const {slug} = useParams(); 
  const [cuisines, setCuisines] = useState([]);

  const { register, handleSubmit, setValue, formState: { errors, setError }, reset } = useForm({
    resolver: zodResolver(schema),
    defaultValues,
  });

  useEffect(() => {
    fetch('http://localhost:8000/api/cuisines')
      .then(response => response.json())
      .then(data => {
        const formattedCuisines = data.data.map(cuisine => ({
          value: cuisine.cuisineid,
          label: cuisine.name
        }));

        setCuisines(formattedCuisines);
      })
      .catch(error => console.error('Error fetching cuisines:', error));

    fetch(`http://localhost:8000/api/restaurants/${slug}`)
      .then(response => response.json())
      .then(data => {
        reset(data.data);
      })
      .catch(error => console.error('Error fetching restaurant data:', error));
  }, [slug, reset]);

  const updateRestaurant = async (data) => {
    try {
      const response = await fetch(`http://localhost:8000/api/restaurants/updateRestaurant/${slug}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.status === 200) {
        Swal.fire({
          title: 'Success',
          text: 'Restaurant updated successfully!',
          icon: 'success',
          confirmButtonText: 'Okay'
        });
        navigate('/restaurant');
      } else {
        Swal.fire({
          title: 'Error',
          text: 'Failed to update restaurant. Please try again.',
          icon: 'error',
          confirmButtonText: 'Okay'
        });
      }

    } catch (error) {
      Swal.fire({
        title: 'Error',
        text: 'Failed to update restaurant due to server error. Please try again.',
        icon: 'error',
        confirmButtonText: 'Okay'
      });
    }
  }

  const imageHandler = async (event) => {
    const img = event.target.files[0];
    const imageUrl = await uploadImageHandler(img);

    if (imageUrl === '404 error') {
      setError('image', {  
        type: 'manual',
        message: 'Image upload failed',
      });
      return;
    }

    setValue('image', imageUrl);
  }

  const onSubmit = (data) => {
    updateRestaurant(data);
  };

  const handleCuisineChange = (selectedOption) => {
    setValue('cuisineType', selectedOption.value);
  };

  return (
    <SectionWrapper>
      <form className="shadow p-4" onSubmit={handleSubmit(onSubmit)}>
        <h1 className="heading text-center">
          Update Restaurant
        </h1>
        <div className="mb-4">
          <label>Name</label>
          <input
            type="text"
            {...register('name')}
          />
          {errors.name && <p className="text-warning">{errors.name.message}</p>}
        </div>

        <div className="mb-4">
          <label>Location</label>
          <input
            type="text"
            {...register('location')}
          />
          {errors.location && <p className="text-warning">{errors.location.message}</p>}
        </div>

        <div className="mb-4">
          <label>Cuisine Type</label>
          <Select
            options={cuisines}
            onChange={handleCuisineChange}
            className="mt-1 block w-full"
          />
          {errors.cuisineType && <p className="text-warning">{errors.cuisineType.message}</p>}
        </div>

        <div className="mb-4">
          <label>Rating</label>
          <input
            type="number"
            max={5}
            min={1}
            step={0.1}
            {...register('rating', { valueAsNumber: true })}
          />
          {errors.rating && <p className="text-warning">{errors.rating.message}</p>}
        </div>

        <div className="mb-4">
          <label>Notes</label>
          <textarea
            {...register('notes')}
            rows={4}
            className="mt-1 block resize-none w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
          {errors.notes && <p className="text-warning">{errors.notes.message}</p>}
        </div>

        <div className="mb-4">
          <label>Restaurant Image</label>
          <input 
            type="file"
            onChange={imageHandler}
            accept="image/*"
          />
          {errors.image && <p className="text-warning">{errors.image.message}</p>}
        </div>

        <div>
          <button
            type="submit"
            className="btn btn-primary"
          >
            Submit
          </button>
        </div>
      </form>
    </SectionWrapper>
  );
};

export default UpdateRestaurantForm;
