import { useEffect, useState } from 'react';
import Select from 'react-select';
import SectionWrapper from "../../../SectionWrapper"
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { uploadImageHandler } from '../../../../utils/FirebaseImageUpload/uploadImage';
import '../../../../css/common.css';
import { useCookies } from 'react-cookie';

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  location: z.string().min(1, 'Location is required'),
  rating: z.number().min(1, 'Rating must be between 1 and 5').max(5, 'Rating must be between 1 and 5').multipleOf(0.1),
  notes: z.string().min(1, 'Notes are required'),
  image: z.string().min(1, 'Image are required'),
  cuisineId: z.number(),
  userId:z.number(),

});

const defaultValues = {
  name: "",
  location: "",
  cuisineId: null, 
  rating: 5,
  notes: "",
  image: "",
};

const AddRestaurantForm = () => {
  const navigate = useNavigate();
  const [cookies] = useCookies();

  const [cuisines, setCuisines] = useState([]);
  
  const { register, handleSubmit, setValue, formState: { errors,setError } } = useForm({
    resolver: zodResolver(schema),
    defaultValues,
  });

  setValue('userId', cookies.auth.userid);


  useEffect(() => {
    
    fetch(`${import.meta.env.VITE_API_ENDPOINT}/api/cuisines`)
      .then(response => response.json())
      .then(data => {
        const formattedCuisines = data.data.map(cuisine => ({
          value: cuisine.cuisineid,
          label: cuisine.name
        }));

        setCuisines(formattedCuisines);
      })
      .catch(error => console.error('Error fetching cuisines:', error));
  
    }, []);
    
  const addNewRestaurant = async (data) =>{
    try {
      const response = await fetch(`${import.meta.env.VITE_API_ENDPOINT}/api/restaurants/addRestaurant`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      
      if(result.status === 200){
        Swal.fire({
          title: 'Success',
          text: 'Restaurant added successfully!',
          icon:'success',
          confirmButtonText: 'Okay'
        });
        
        navigate('/restaurant');
      }
      else{
          Swal.fire({
          title: 'Error',
          text: 'Failed to add new restaurant. Please try again.',
          icon:'error',
          confirmButtonText: 'Okay'
        });
        navigate('/restaurant');
      }
      
    } catch (error) {
      
      Swal.fire({
        title: 'Error',
        text: 'Failed to add new restaurant due to server error. Please try again.',
        icon:'error',
        confirmButtonText: 'Okay'
      });

    }
  }

  const imageHandler = async (event) => {
    const img = event.target.files[0]
    const imageUrl = await uploadImageHandler(img)
    
    if (imageUrl === '404 error') {
      setError('image', {  
        type: 'manual',
        message: 'Image upload failed',
      });
      return;
    }

    console.log("object",imageUrl)
    setValue('image', imageUrl);
  }


  const onSubmit = (data) => {

    console.log("sybmitted",data);
    addNewRestaurant(data);
  };

  const handleCuisineChange = (selectedOption) => {

    setValue('cuisineId', selectedOption.value);
  };

  return (
    <SectionWrapper>
      <form className="shadow p-4" onSubmit={handleSubmit(onSubmit)}>
        <h1 className="heading text-center">
          Add New Restaurant
        </h1>
        <div className="mb-4">
          <label >Name</label>
          <input
            type="text"
            {...register('name')}
          />
          {errors.name && <p className="text-warning">{errors.name.message}</p>}
        </div>

        <div className="mb-4">
          <label >Location</label>
          <input
            type="text"
            {...register('location')}
          />
          {errors.location && <p className="text-warning">{errors.location.message}</p>}
        </div>

        <div className="mb-4">
          <label >Cuisine Type</label>
          <Select
            options={cuisines}
            onChange={handleCuisineChange}
            className="mt-1 block w-full"
          />
          {errors.cuisineId && <p className="text-warning">{errors.cuisineId.message}</p>}
        </div>

        <div className="mb-4">
          <label >Rating</label>
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
          <label >Notes</label>
          <textarea
            {...register('notes')}
            rows={4}
            className="mt-1 block resize-none w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
          {errors.notes && <p className="text-warning">{errors.notes.message}</p>}
        </div>

        <div className="mb-4">
          <label >Restaurant Image</label>
          <input 
            type="file"
            onChange={imageHandler}
            accept="image/*"
          />
          {errors.image && <p className="text-warning">{errors.image.message}</p>}
        </div>

        <div >
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

export default AddRestaurantForm;