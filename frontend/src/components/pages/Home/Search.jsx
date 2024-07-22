import { useState, useEffect, useRef } from "react";
import Select from "react-select";
import SectionWrapper from "../../common/SectionWrapper";
import "../../css/common.css";
import "../../css/search.css";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import RecipeCard from "./RecipeCard";
import Swal from "sweetalert2";

const searchSchema = z.object({
  searchquery: z.string().optional(),
  cuisine: z.number().optional(),
  tags: z.string().optional(),
});

const Search = () => {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(searchSchema),
  });
  const [cuisineOptions, setCuisineOptions] = useState([]);
  const [isSearch, setIsSearch] = useState(false);
  const [recipes, setRecipes] = useState(null);
  const formRef = useRef(null);

  const getCuisine = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_ENDPOINT}/api/cuisines`
      );
      const data = await response.json();
      if (response.ok) {
        setCuisineOptions(
          data.data.map((c) => ({ value: c.cuisineId, label: c.name }))
        );
      } else {
        console.error("Error fetching cuisines:", data.message);
      }
    } catch (error) {
      console.error("Error fetching cuisines:", error);
    }
  };

  const handleCuisineChange = (selectedOption) => {
    setValue("cuisine", selectedOption ? selectedOption.value : null);
  };

  const searchItems = async (data) => {
    try {
      console.log("Search", data);
      const response = await fetch(
        `${import.meta.env.VITE_API_ENDPOINT}/api/search`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );
      const result = await response.json();
      if (result.status === 200) {
        console.log("search result", result.data);
        setRecipes(result.data);
      } else {
        setRecipes(null);
        Swal.fire({
          title: "Error",
          text: "Recipes not found",
          icon: "error",
          confirmButtonText: "Okay",
        });
        console.error("Error searching:", result.message);
      }
      reset();
    } catch (error) {
      console.error("Error searching:", error);
      reset();
    }
  };

  useEffect(() => {
    getCuisine();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (formRef.current && !formRef.current.contains(event.target)) {
        setIsSearch(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <SectionWrapper>
      <form ref={formRef} className="mt-2" onSubmit={handleSubmit(searchItems)}>
        <div className="search-bar">
          <input
            type="text"
            id="default-search"
            className="search-input"
            placeholder="Search recipes by name"
            {...register("searchquery")}
            onFocus={() => setIsSearch(true)}
          />
          <button className="btn btn-primary" type="submit">
            Search
          </button>
        </div>
        {errors.searchquery && (
          <p className="text-warning">{errors.searchquery.message}</p>
        )}

        {/* {isSearch && (
          <div
            style={{
              margin: "20px 0px",
              display: "flex",
              gap: "20px",
            }}
          >
            <div
              style={{
                flexGrow: 1,
                width: 0,
              }}
            >
              <label>Select Category</label>
              <Select
                options={cuisineOptions}
                onChange={handleCuisineChange}
                isClearable
              />
            </div>
            <div
              style={{
                flexGrow: 1,
                width: 0,
              }}
            >
              <div>
                <label>Tags</label>
                <input
                  type="search"
                  {...register("tags")}
                  placeholder="Enter a tag to search"
                />
                {errors.tags && (
                  <p className="text-warning">{errors.tags.message}</p>
                )}
              </div>
            </div>
          </div>
        )} */}
      </form>
      {recipes && <RecipeCard recipes={recipes} />}
    </SectionWrapper>
  );
};

export default Search;
