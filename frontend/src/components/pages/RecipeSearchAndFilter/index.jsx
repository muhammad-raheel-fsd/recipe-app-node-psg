import { useState } from 'react';

const RecipeSearchAndFilter = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [category, setCategory] = useState('');
    const [tag, setTag] = useState('');

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleCategoryChange = (e) => {
        setCategory(e.target.value);
    };

    const handleTagChange = (e) => {
        setTag(e.target.value);
    };

    return (
        <div className="p-6 bg-gray-100 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Search and Filter Recipes</h2>
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Search by name, restaurant, or ingredients"
                    value={searchTerm}
                    onChange={handleSearch}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
            </div>
            <div className="mb-4">
                <select
                    value={category}
                    onChange={handleCategoryChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                >
                    <option value="">Select Category</option>
                    <option value="breakfast">Breakfast</option>
                    <option value="lunch">Lunch</option>
                    <option value="dinner">Dinner</option>
                    {/* Add more categories as needed */}
                </select>
            </div>
            <div className="mb-4">
                <select
                    value={tag}
                    onChange={handleTagChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                >
                    <option value="">Select Tag</option>
                    <option value="vegan">Vegan</option>
                    <option value="gluten-free">Gluten-Free</option>
                    <option value="quick">Quick</option>
                    {/* Add more tags as needed */}
                </select>
            </div>
            <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                Apply Filters
            </button>
        </div>
    );
};

export default RecipeSearchAndFilter;