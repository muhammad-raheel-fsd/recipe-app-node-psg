import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import SectionWrapper from "../../../SectionWrapper";
import { uploadImageHandler } from "../../../../utils/FirebaseImageUpload/uploadImage";
import TagsInput from "react-tagsinput";
import "react-tagsinput/react-tagsinput.css";
import Swal from "sweetalert2";
import { useCookies } from "react-cookie";
import { hasWhitespaceAtEdges } from "../../../../../../utils/strings";

const recipeSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(255)
    .refine((string) => !hasWhitespaceAtEdges(string), {
      message: "Name cannot start with whitespace",
    }),
  ingredients: z.array(z.string().min(1, "Ingredients are required")),
  steps: z.array(z.string().min(1, "Steps are required")),
  notes: z
    .string()
    .min(1, "Note is required")
    .refine((string) => !hasWhitespaceAtEdges(string), {
      message: "Notes cannot start with whitespace",
    }),
  tags: z.array(z.string().min(1, "Tags are required")),
  image: z.string().min(1, "Image is required"),
  restaurantId: z.number(),
  userId: z.number(),
});

const EditRecipeForm = () => {
  const navigate = useNavigate();
  const { slug } = useParams();
  const {
    register,
    handleSubmit,
    setError,
    setValue,
    getValues,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(recipeSchema),
  });
  const [cookies] = useCookies();

  const [tags, setTags] = useState([]);
  const [steps, setSteps] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [recipe, setRecipe] = useState(null);
  const [tagError, setTagError] = useState("");
  const [ingredientsError, setIngredientsError] = useState("");
  const [stepsError, setStepsError] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchRecipe = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_ENDPOINT}/api/recipes/${slug}`
      );
      const result = await response.json();
      let data = result.data;
      if (result.status === 200) {
        console.log("recipe details=====>", data);
        setRecipe(data);
        setValue("name", data.name);
        setValue("ingredients", data.ingredients);
        setIngredients(data.ingredients);
        setValue("steps", data.steps);
        setSteps(data.steps);
        setValue("notes", data.notes);
        setValue("tags", data.tags);
        setTags(data.tags);
        setValue("image", data.image);
      }
    } catch (error) {
      console.log("error in fetching recipe details=====>", error);
    }
  };

  useEffect(() => {
    setValue("restaurantId", parseInt(slug, 10));
    setValue("userId", cookies.auth.userId);

    fetchRecipe();
  }, [slug]);

  const updateRecipe = async (recipe) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_ENDPOINT}/api/recipes/updateRecipe/${slug}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(recipe),
        }
      );
      const result = await response.json();
      if (result.status === 200) {
        Swal.fire({
          title: "Success",
          text: "Recipe updated successfully!",
          icon: "success",
          confirmButtonText: "Okay",
        }).then(() => {
          navigate(-1);
        });
      } else {
        Swal.fire({
          title: "Error",
          text: "Failed to update recipe.",
          icon: "error",
          confirmButtonText: "Okay",
        }).then(() => {
          navigate(-1);
        });
      }
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "Failed to update recipe.",
        icon: "error",
        confirmButtonText: "Okay",
      }).then(() => {
        navigate(-1);
      });
    }
  };

  const handleStepsChange = (steps) => {
    let error = false;
    setStepsError("");
    const filteredSteps = steps.filter((step) => {
      const isEmpty = step.trim().length === 0;
      if (isEmpty) {
        error = true;
        setStepsError("Whitespaces not allowed");
      }
      return !isEmpty;
    });
    if (error) {
    }
    setSteps(filteredSteps);
    setValue("steps", filteredSteps);
  };

  const handleTagsChange = (tags) => {
    let error = false;
    setTagError("");
    const filteredTags = tags.filter((tag) => {
      const isEmpty = tag.trim().length === 0;
      if (isEmpty) {
        error = true;
        setTagError("Whitespaces not allowed");
      }
      return !isEmpty;
    });
    if (error) {
    }
    setTags(filteredTags);
    setValue("tags", filteredTags);
  };

  const handleIngredientsChange = (ingredients) => {
    let error = false;
    setIngredientsError("");
    const filteredIngredients = ingredients.filter((ingredient) => {
      const isEmpty = ingredient.trim().length === 0;
      if (isEmpty) {
        error = true;
        setIngredientsError("Whitespaces not allowed");
      }
      return !isEmpty;
    });
    if (error) {
    }
    setIngredients(filteredIngredients);
    setValue("ingredients", filteredIngredients);
  };

  const onSubmit = (data) => {
    console.log(data);
    updateRecipe(data);
  };

  const imageHandler = async (event) => {
    setLoading(true);
    const img = event.target.files[0];
    const imageUrl = await uploadImageHandler(img);

    if (imageUrl === "404 error") {
      setLoading(false);
      setError("image", {
        type: "manual",
        message: "Image upload failed",
      });
      return;
    }

    setLoading(false);
    console.log("object", imageUrl);
    setValue("image", imageUrl);
  };

  if (!recipe) {
    return <div>Loading...</div>; // Add loading state
  }

  return (
    <SectionWrapper>
      <form onSubmit={handleSubmit(onSubmit)} className="p-4 shadow">
        <h1 className="heading text-center">Add New Recipe</h1>
        <div className="mb-4">
          <label className="mb-2">Name</label>
          <input {...register("name")} type="text" />
          {errors.name && <p className="text-warning">{errors.name.message}</p>}
        </div>
        <div className="mb-4">
          <label className="mb-2">Ingredients</label>
          <TagsInput
            value={ingredients}
            onChange={handleIngredientsChange}
            placeholder="Add new Ingredients"
          />
          <label
            style={{
              color: "gray",
            }}
          >
            Press enter to add new ingredients
          </label>
          {errors.ingredients && (
            <p className="text-warning">{errors.ingredients.message}</p>
          )}
          {ingredientsError && (
            <p className="text-warning">{ingredientsError}</p>
          )}
        </div>

        <div className="mb-4">
          <label className="mb-2">Steps</label>
          <TagsInput
            value={steps}
            onChange={handleStepsChange}
            placeholder="Add new Steps"
          />
          <label
            style={{
              color: "gray",
            }}
          >
            Press enter to add new steps
          </label>
          {errors.steps && (
            <p className="text-warning">{errors.steps.message}</p>
          )}
          {stepsError && <p className="text-warning">{stepsError}</p>}
        </div>

        <div className="mb-4">
          <label className="mb-2">Notes</label>
          <textarea
            rows={4}
            {...register("notes")}
            className="mt-1 p-2 border focus:ring-[#a5d24a] focus:ring-2 focus:border-none outline-none border-gray-300 rounded w-full resize-none"
          />
        </div>

        <div className="mb-4">
          <label className="mb-2">Tags</label>
          <TagsInput
            value={tags}
            onChange={handleTagsChange}
            placeholder="Add new Tags"
          />
          <label
            style={{
              color: "gray",
            }}
          >
            Press enter to add new tags
          </label>
          {errors.tags && <p className="text-warning">{errors.tags.message}</p>}
          {tagError && <p className="text-warning">{tagError}</p>}
        </div>

        <div className="mb-4">
          <label className="mb-2">Image</label>
          <input
            type="file"
            onChange={imageHandler}
            className="mt-1 p-2 border focus:ring-[#a5d24a] focus:ring-2 focus:border-none outline-none border-gray-300 rounded w-full"
          />
          {errors.image && (
            <p className="text-warning">{errors.image.message}</p>
          )}
        </div>

        {/* <button className="btn btn-primary">Submit</button> */}
        <button
          type="submit"
          className="btn btn-primary"
          style={{
            background: loading ? "grey" : "",
          }}
        >
          {loading ? "Uploading image..." : "Submit"}
        </button>
      </form>
    </SectionWrapper>
  );
};

export default EditRecipeForm;
