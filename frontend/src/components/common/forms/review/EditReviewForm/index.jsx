import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useParams } from 'react-router-dom';
import SectionWrapper from '../../../SectionWrapper';
import Swal from 'sweetalert2';
import { useCookies } from 'react-cookie';

const reviewSchema = z.object({
    content: z.string().min(1, 'Content is required'),
    rating: z.number().min(1, 'Rating must be at least 1').max(5, 'Rating must be at most 5'),
    userid: z.number(),
    recipeid: z.number(),
    date: z.string()
});

const EditReviewForm = () => {
    const navigate = useNavigate();
    const { slug } = useParams();
    const [cookies] = useCookies();

    const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm({
        resolver: zodResolver(reviewSchema)
    });

    const fetchReview = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_ENDPOINT}/api/reviews/${slug}`);
            const result = await response.json();
            
            if (result.status===200) {
                reset(result.data[0]);
                // setValue('content',result.data[0] );
                // setValue('rating', result.data.rating);
            } else {
                console.error('Failed to fetch review');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    useEffect(() => {
        setValue('userid', cookies.auth.userid);
        setValue('recipeid', parseInt(slug, 10));
        setValue('date', new Date().toISOString());
        fetchReview();
    }, [slug,setValue]);

    const onSubmit = async (data) => {
        console.log(data)
        try {
            const response = await fetch(`${import.meta.env.VITE_API_ENDPOINT}/api/reviews/updateReview/${slug}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();
            console.log("object updated successfully", result)
            if (result.status === 200) {
                Swal.fire({
                    title: 'Success',
                    text: 'Review updated successfully!',
                    icon:'success',
                    confirmButtonText: 'Okay'
                }).then(() => {
                    navigate(-1);
                })
               
            } else {
                Swal.fire({
                    title: 'Error',
                    text: 'Failed to update review',
                    icon: 'error',
                    confirmButtonText: 'Okay'
                }).then(()=>{
                    navigate(-1);
                })
            }
        } catch (error) {
            Swal.fire({
                title: 'Error',
                text: 'Failed to update review',
                icon: 'error',
                confirmButtonText: 'Okay'
            }).then(()=>{
                navigate(-1);
            })
        }
    };
    return (
        <SectionWrapper>
            <div className="mt-10 p-5 border border-gray-200 rounded-lg shadow-md">
                <h2 className="heading">Edit Review</h2>
                <form onSubmit={handleSubmit(onSubmit)} className='mt-4'>
                    <div className="mb-4">
                        <label htmlFor="rating" className="block text-sm font-medium text-gray-700">Rating</label>
                        <input
                            type="number"
                            step={1}
                            id="rating"
                            {...register('rating', { valueAsNumber: true })}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                        {errors.rating && <span className="text-warning">{errors.rating.message}</span>}
                    </div>
                    <div className="mb-4">
                        <label htmlFor="content" className="block text-sm font-medium text-gray-700">Content</label>
                        <textarea
                            id="content"
                            rows={4}
                            {...register('content')}
                            className="mt-1 resize-none block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                        {errors.content && <span className="text-warning">{errors.content.message}</span>}
                    </div>

                    <button type="submit" className="btn btn-primary">Update Review</button>
                </form>
            </div>
        </SectionWrapper>
    );
};

export default EditReviewForm;