import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2/dist/sweetalert2.js";
import "sweetalert2/src/sweetalert2.scss";
import { useCookies } from "react-cookie";
import SectionWrapper from "../../../SectionWrapper";
import Select from "react-select";
import countryList from "react-select-country-list";
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

const CuisineForm = () => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });
  const [cookies] = useCookies();
  const navigate = useNavigate();

  useEffect(() => {
    if (cookies.auth) {
      console.log("Setting user ID from cookies:", cookies.auth.userId);
      setValue("userId", cookies.auth.userId);
    }
  }, [cookies, setValue]);

  const dataSubmitted = async (data) => {
    console.log("Submitting data:", data);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_ENDPOINT}/api/cuisines/addCuisine`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      const result = await response.json();
      console.log("API response:", result);

      if (response.ok) {
        Swal.fire({
          title: "Success",
          text: "Cuisine added successfully!",
          icon: "success",
          confirmButtonText: "Okay",
        }).then((result) => {
          if (result.isConfirmed) {
            navigate("/categories");
          }
        });
      } else {
        Swal.fire({
          title: "Error",
          text: "Failed to add new cuisine. Please try again.",
          icon: "error",
          confirmButtonText: "Okay",
        });
      }
    } catch (error) {
      console.error("Error submitting data:", error);
      Swal.fire({
        title: "Error",
        text: "An unexpected error occurred. Please try again.",
        icon: "error",
        confirmButtonText: "Okay",
      });
    }
  };

  const onSubmit = (data) => {
    console.log("Form data:", data);
    dataSubmitted(data);
  };

  const options = useMemo(() => countryList().getData(), []);

  const changeHandler = (value) => {
    console.log("Selected country:", value);
    setValue("country", value.label);
    setValue("value", value.value);
  };

  return (
    <SectionWrapper>
      <form onSubmit={handleSubmit(onSubmit)} className="p-4 flex flex-col">
        <div className="m-3">
          <label>Name</label>
          <input type="text" {...register("name")} className="form-control" />
          {errors.name && (
            <p className="mt-2 text-warning">{errors.name.message}</p>
          )}
        </div>

        <div className="m-3">
          <label>Description</label>
          <textarea
            {...register("description")}
            rows={6}
            className="form-control"
            style={{
              padding : '10px',
            }}
          ></textarea>
          {errors.description && (
            <p className="mt-2 text-warning">{errors.description.message}</p>
          )}
        </div>

        <div className="m-3">
          <label>Select Country</label>
          <Select options={options} onChange={changeHandler} />
          {errors.country && (
            <p className="mt-2 text-warning">{errors.country.message}</p>
          )}
        </div>

        <div className="m-3">
          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </div>
      </form>
    </SectionWrapper>
  );
};

export default CuisineForm;
