import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, useParams } from 'react-router-dom';
import SectionWrapper from '../../../SectionWrapper';
import '../../../../css/common.css';
import Swal from 'sweetalert2';
import { useCookies } from 'react-cookie';

const reviewSchema = z.object({
    content: z.string().min(1, 'Content is required'),
    rating: z.number().min(1, 'Rating must be at least 1').max(5, 'Rating must be at most 5'),
    userid: z.number(),
    recipeid: z.number(),
    date: z.string()
});

const ReviewForm = () => {
    const navigate = useNavigate();
    const { slug } = useParams();
    const [cookies] = useCookies();


    const { register, handleSubmit, setValue, formState: { errors } } = useForm({
        resolver: zodResolver(reviewSchema)
    });

    useEffect(() => {

        setValue('userid', cookies.auth.userid);
        setValue('recipeid', parseInt(slug, 10));
        setValue('date', new Date().toISOString());
    }, [slug, setValue]);

    const onSubmit = async (data) => {
        console.log("data is", data);
        try {
            const response = await fetch(`${import.meta.env.VITE_API_ENDPOINT}/api/reviews/addReview`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            const result = await response.json();
            if (result.status===200) {
                Swal.fire({
                    title: 'Success',
                    text: 'Review submitted successfully!',
                    icon: 'success',
                    confirmButtonText: 'Okay'
                }).then(() => {
                    navigate(-1);
                });
            } else {
                Swal.fire({
                    title: 'Error',
                    text: result.message,
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

    return (
        <SectionWrapper>
            <div className="mt-10 p-5 border border-gray-200 rounded-lg shadow-md">
                <h2 className="heading">Submit a Review</h2>
                <form onSubmit={handleSubmit(onSubmit)} className='mt-4'>
                    <div className="mb-4">
                        <label htmlFor="rating">Rating</label>
                        <input 
                            type="number" 
                            step={0.1} 
                            id="rating" 
                            {...register('rating', { valueAsNumber: true })} 
                        />
                        {errors.rating && <span className="text-warning">{errors.rating.message}</span>}
                    </div>
                    <div className="mb-4">
                        <label htmlFor="content">Content</label>
                        <textarea 
                            id="content" 
                            rows={4} 
                            {...register('content')} 
                        />
                        {errors.content && <span className="text-warning">{errors.content.message}</span>}
                    </div>
                    <div>

                    <button className="btn btn-primary">Submit Review</button>
                    </div>
                </form>
            </div>
        </SectionWrapper>
    );
};

export default ReviewForm;
