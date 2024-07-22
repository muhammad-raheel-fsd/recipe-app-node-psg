import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate, useParams } from "react-router-dom";
import SectionWrapper from "../../../SectionWrapper";
import "../../../../css/common.css";
import Swal from "sweetalert2";
import { useCookies } from "react-cookie";
import { hasWhitespaceAtEdges } from "../../../../../../utils/strings";

const reviewSchema = z.object({
  content: z
    .string()
    .min(1, "Content is required")
    .refine((string) => !hasWhitespaceAtEdges(string), {
      message: "Content cannot start with whitespace",
    }),
  rating: z.coerce
    .number({
      required_error: "Rating is required",
      invalid_type_error: "Rating must be a number",
    })
    .min(1, "Rating must be at least 1")
    .max(5, "Rating must be at most 5"),
  userId: z.number(),
  recipeId: z.number(),
  date: z.string(),
});

const ReviewForm = () => {
  const navigate = useNavigate();
  const { slug, recipe } = useParams();
  console.log({ slug, recipe });
  const [cookies] = useCookies();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(reviewSchema),
  });

  const fetchReview = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_ENDPOINT}/api/reviews/${slug}`
      );
      const result = await response.json();

      if (result.status === 200) {
        // reset(result.data[0]);
        setValue("content", result.data.content);
        setValue("rating", result.data.rating);
      } else {
        console.error("Failed to fetch review");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    setValue("userId", cookies.auth.userId);
    setValue("recipeId", parseInt(recipe, 10));
    setValue("date", new Date().toISOString());
    fetchReview();
  }, [slug, setValue]);

  const onSubmit = async (data) => {
    console.log(data);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_ENDPOINT}/api/reviews/updateReview/${slug}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      const result = await response.json();
      console.log("object updated successfully", result);
      if (result.status === 200) {
        Swal.fire({
          title: "Success",
          text: "Review updated successfully!",
          icon: "success",
          confirmButtonText: "Okay",
        }).then(() => {
          navigate(-1);
        });
      } else {
        Swal.fire({
          title: "Error",
          text: "Failed to update review",
          icon: "error",
          confirmButtonText: "Okay",
        }).then(() => {
          navigate(-1);
        });
      }
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "Failed to update review",
        icon: "error",
        confirmButtonText: "Okay",
      }).then(() => {
        navigate(-1);
      });
    }
  };

  return (
    <SectionWrapper>
      <div className="mt-10 p-5 border border-gray-200 rounded-lg shadow-md">
        <h2 className="heading">Submit a Review</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-4">
          <div className="mb-4">
            <label htmlFor="rating">Rating</label>
            <input
              type="number"
              // step={0.1}
              id="rating"
              {...register("rating", { valueAsNumber: true })}
            />
            {errors.rating && (
              <span className="text-warning">{errors.rating.message}</span>
            )}
          </div>
          <div className="mb-4">
            <label htmlFor="content">Content</label>
            <textarea id="content" rows={4} {...register("content")} />
            {errors.content && (
              <span className="text-warning">{errors.content.message}</span>
            )}
          </div>
          <div>
            <button className="btn btn-primary">Update Review</button>
          </div>
        </form>
      </div>
    </SectionWrapper>
  );
};

export default ReviewForm;
