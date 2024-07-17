import { useState, useEffect } from "react";
import Select from "react-select";
import SectionWrapper from "../../common/SectionWrapper";
import '../../css/common.css';
import '../../css/search.css';
import { set, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import RecipeCard from './RecipeCard'
import Swal from "sweetalert2";

const searchSchema = z.object({
    searchquery: z.string().min(3, "Minimum three characters required"),
    cuisine: z.number().optional(true),
    tags: z.string().optional(true)
});

const Search = () => {
    const { register, handleSubmit, setValue,getValues, formState: { errors } } = useForm({
        resolver: zodResolver(searchSchema)
    });
    const [cuisineOptions, setCuisineOptions] = useState([]);
    const [isSearch, setIsSearch] = useState(false);
    const [recipes, setRecipes] = useState(null);

    const getCuisine = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_ENDPOINT}/api/cuisines`);
            const data = await response.json();
            if (response.ok) {
                setCuisineOptions(data.data.map(c => ({ value: c.cuisineid, label: c.name })));
            } else {
                console.error('Error fetching cuisines:', data.message);
            }
        } catch (error) {
            console.error('Error fetching cuisines:', error);
        }
    };

    const handleCuisineChange = (selectedOption) => {
        setValue("cuisine", selectedOption.value);
    };

    const searchItems = async (data) => {
        try {
            console.log("Search", data)
            const response = await fetch(`${import.meta.env.VITE_API_ENDPOINT}/api/searchAndFilter`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            const result = await response.json();
            if (result.status === 200) {
                console.log("search result", result.data);
                setRecipes(result.data);
            } else {
                setRecipes(null)
                Swal.fire({
                    title: 'Error',
                    text: "Recipes not found",
                    icon: 'error',
                    confirmButtonText: 'Okay'
                })
                console.error('Error searching:', result.message);
            }
        } catch (error) {
            console.error('Error searching:', error);
        }
    };

    useEffect(() => {
        getCuisine();
    }, []);

    return (
        <SectionWrapper>
            <form className="mt-2" onSubmit={handleSubmit(searchItems)}>
                <div className="search-bar">
                    <input
                        type="text"
                        id="default-search"
                        className="search-input"
                        placeholder="Search recipes by name, restaurant, or ingredients"
                        {...register('searchquery')}
                        onFocus={() => setIsSearch(true)}
                    />
                    <button className="btn btn-primary" type="submit">
                        Search
                    </button>
                </div>
                    {errors.searchquery && <p className="text-warning">{errors.searchquery.message}</p>}

                {isSearch && (
                    <div className="grid grid-sm-2">
                        <div className="mb-4">
                            <label>Select Category</label>
                            <Select
                                options={cuisineOptions}
                                onChange={handleCuisineChange}
                            />
                        </div>
                        <div className="mb-4" >
                            <div>
                                <label>Tags</label>
                                <input type="text" {...register('tags')} className="p-7" placeholder="Enter a tag" />
                                {errors.tags && <p className="text-warning">{errors.tags.message}</p>}
                            </div>
                        </div>
                    </div>
                )}
            </form>
            {
                !recipes && <label>Recipes Not Found</label>
            }
            {
                recipes && <RecipeCard recipes={recipes} />
            }
        </SectionWrapper>
    );
};

export default Search;
