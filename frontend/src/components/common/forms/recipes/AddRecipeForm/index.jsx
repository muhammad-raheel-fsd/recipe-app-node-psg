import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import SectionWrapper from '../../../SectionWrapper';
import { uploadImageHandler } from '../../../../utils/FirebaseImageUpload/uploadImage';
import TagsInput from 'react-tagsinput';
import 'react-tagsinput/react-tagsinput.css';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2'
import { useCookies } from 'react-cookie';
import '../../../../css/common.css';

const recipeSchema = z.object({
    name: z.string().min(1, "Name is required").max(255),
    ingredients: z.array(z.string().min(1, "Ingredients are required")),
    steps: z.array(z.string().min(1, "Steps are required")),
    notes: z.string(),
    tags: z.array(z.string().min(1, "Tags are required")),
    image: z.string().min(1, "Image is required"),
    restaurantId: z.number(),
    userId: z.number()
});

const AddRecipeForm = () => {
    const navigate = useNavigate();
    const { slug } = useParams();
    const [cookies] = useCookies();


    const { register, handleSubmit, setError, setValue, getValues, formState: { errors } } = useForm({
        resolver: zodResolver(recipeSchema)
    });


    useEffect(() => {
        setValue("restaurantId", parseInt(slug, 10));
        setValue('userId', cookies.auth.userid);

    }, [slug]);

    const [tags, setTags] = useState([]);
    const [steps, setSteps] = useState([]);
    const [ingredients, setIngredients] = useState([]);

    const addRecipe = async (recipe) => { 
        try {
            const response = await fetch(`${import.meta.env.VITE_API_ENDPOINT}api/recipes/addRecipe`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(recipe)
            });
            const result = await response.json();
            console.log(result);
            if(result.status === 200)
            {
                Swal.fire({
                    title: 'Success',
                    text: 'Recipe added successfully!',
                    icon:'success',
                    confirmButtonText: 'Okay'
                }).then(() => {
                    navigate(-1);
                })
            }
            else{
                Swal.fire({
                    title: 'Error',
                    text: 'Failed to add recipe.',
                    icon:'error',
                    confirmButtonText: 'Okay'
                }).then(() =>{
                    navigate(-1)
                })
            }
        }
        catch (error) {
            Swal.fire({
                title: 'Server Error',
                text: 'Failed to add recipe.',
                icon:'error',
                confirmButtonText: 'Okay'
            }).then(() =>{
                navigate(-1)
            });
        }
    }

    const handleStepsChange = (steps) => {
        setSteps(steps);
        setValue("steps", steps);
        console.log("steps", getValues("steps"));
    }

    const handleTagsChange = (tags) => {
        setTags(tags);
        setValue("tags", tags);
        console.log("tags", getValues("tags"));
    };

    const handleIngredientsChange = (ingredients) => {
        setIngredients(ingredients);
        setValue("ingredients", ingredients);
        console.log("ingredients", getValues("ingredients"));
    };

    const onSubmit = data => {
        console.log(data);
        addRecipe(data);
    };

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

        console.log("object", imageUrl);
        setValue('image', imageUrl);
    }

    return (
        <SectionWrapper>
            <form onSubmit={handleSubmit(onSubmit)} className="p-4 shadow">
                <h1 className='heading text-center'>Add New Recipe</h1>
                <div className="mb-4">
                    <label className="mb-2">Name</label>
                    <input {...register("name")} type='text' />
                    {errors.name && <p className="text-warning">{errors.name.message}</p>}
                </div>
                <div className="mb-4">
                    <label className="mb-2">Ingredients</label>
                    <TagsInput value={ingredients} onChange={handleIngredientsChange} placeholder="Add new Ingredients" />
                    <label style={{
                        color: 'gray'
                    }}>Press enter to add new ingredients</label>
                    {errors.ingredients && <p className="text-warning">{errors.ingredients.message}</p>}
                </div>

                <div className="mb-4">
                    <label className="mb-2">Steps</label>
                    <TagsInput value={steps} onChange={handleStepsChange} placeholder="Add new Steps" />
                    <label style={{
                        color: 'gray'
                    }}>Press enter to add new steps</label>
                    {errors.steps && <p className="text-warning">{errors.steps.message}</p>}
                </div>

                <div className="mb-4">
                    <label className="mb-2">Notes</label>
                    <textarea
                        rows={4}
                        {...register("notes")} className="mt-1 p-2 border focus:ring-[#a5d24a] focus:ring-2 focus:border-none outline-none border-gray-300 rounded w-full resize-none" />
                </div>

                <div className="mb-4">
                    <label className="mb-2">Tags</label>
                    <TagsInput value={tags} onChange={handleTagsChange} placeholder="Add new Tags" />
                    <label style={{
                        color: 'gray'
                    }}>Press enter to add new tags</label>
                    {errors.tags && <p className="text-warning">{errors.tags.message}</p>}
                </div>

                <div className="mb-4">
                    <label className="mb-2">Image</label>
                    <input type="file" onChange={imageHandler} className="mt-1 p-2 border focus:ring-[#a5d24a] focus:ring-2 focus:border-none outline-none border-gray-300 rounded w-full" />
                    {errors.image && <p className="text-warning">{errors.image.message}</p>}
                </div>

                <button className="btn btn-primary">Submit</button>
            </form>
        </SectionWrapper>
    );
};

export default AddRecipeForm;