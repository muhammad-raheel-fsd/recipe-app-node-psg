import SectionWrapper from "../../../SectionWrapper";
import Select from "react-select";
import countryList from "react-select-country-list";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import Swal from "sweetalert2";
import "../../../../css/cuisineForm.css";
import { useCookies } from "react-cookie";
import { hasWhitespaceAtEdges } from "../../../../../../utils/strings";

const schema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .refine((string) => !hasWhitespaceAtEdges(string), {
      message: "Name cannot start with whitespace",
    }),
  description: z
    .string()
    .min(1, "Description is required")
    .refine((string) => !hasWhitespaceAtEdges(string), {
      message: "Description cannot start with whitespace",
    }),
  country: z.string().min(1, "Country is required"),
  value: z.string().min(1, "Value is required"),
  userId: z.number().optional(),
});

const CuisineFormUpdate = () => {
  let { slug } = useParams();

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const [cookies] = useCookies();
  setValue("userId", cookies.auth.userId);

  const getCuisine = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_ENDPOINT}/api/cuisines/${slug}`
      );
      let data = await response.json();
      data = data.data;
      setValue("name", data.name);
      setValue("description", data.description);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    getCuisine();
  }, [slug]);

  const updatedData = async (data) => {
    const response = await fetch(
      `${import.meta.env.VITE_API_ENDPOINT}/api/cuisines/updateCuisine/${slug}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    const result = await response.json();
    console.log(result);

    if (result.status === 200) {
      Swal.fire({
        title: "Success",
        text: "Cuisine updated successfully!",
        icon: "success",
        confirmButtonText: "Okay",
      });
      navigate("/categories");
    } else {
      Swal.fire({
        title: "Error",
        text: "Failed to update cuisine. Please try again.",
        icon: "error",
        confirmButtonText: "Okay",
      });
      navigate("/categories");
    }
  };

  const onSubmit = (data) => {
    console.log(data);
    updatedData(data);
  };

  const options = useMemo(() => countryList().getData(), []);

  const changeHandler = (value) => {
    setValue("country", value.label);
    setValue("value", value.value);
  };

  return (
    <SectionWrapper>
      <form onSubmit={handleSubmit(onSubmit)} className="p-4 flex">
        <div className="m-3">
          <label>Name</label>
          <input type="text" {...register("name")} />
          {errors.name && (
            <p className="mt-2 text-warning">{errors.name.message}</p>
          )}
        </div>

        <div className="m-3">
          <label>Description</label>
          <textarea {...register("description")} rows={6}></textarea>
          {errors.description && (
            <p className="mt-2 text-warning">{errors.description.message}</p>
          )}
        </div>

        <div className="m-3">
          <label>Select Option</label>
          <Select options={options} onChange={changeHandler} />
          {errors.country && (
            <p className="mt-2 text-warning">{errors.country.message}</p>
          )}
        </div>

        <div>
          <button className="btn btn-primary">Submit</button>
        </div>
      </form>
    </SectionWrapper>
  );
};

export default CuisineFormUpdate;
