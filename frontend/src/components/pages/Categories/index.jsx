import SectionWrapper from "../../common/SectionWrapper"
import { Link } from "react-router-dom"

import Search from "../Home/Search"
import CountryFlag from "./CountryFlag"
import { useEffect, useState } from "react"
import '../../css/common.css';
import IsUserExist from "../../utils/isUserExist"
// import CuisineDetail from "./CuisineDetail"
const Categories = () => {

  const [cusines, setCuisines] = useState([]);

  const fetchCusines = async () => {

    // const response = await fetch('http://localhost:3000/categories');
    const response = await fetch(`${import.meta.env.VITE_API_ENDPOINT}api/cuisines`);
    const data = await response.json();
    setCuisines(data.data);
    console.log("object", data);
  }

  console.log(cusines)
  useEffect(() => {
    fetchCusines();
  }, [])

  return (
    <SectionWrapper>
      <div className="flex-space-between mb-4">
        <h1  style={{
          fontWeight: 'bold',
        }}>
          All Cuisine
        </h1>
        {
          IsUserExist() && <Link to="/cuisine/cuisineForm" className="btn btn-primary">Add Cuisine</Link>
        }
      </div>
      <Search />
      <div className="grid grid-sm-2 grid-md-3 grid-lg-4">
        {
          cusines.map((cuisine, index) => (
            <div key={index} className="card">
              <CountryFlag countryCode={cuisine.value} title={cuisine.country} />
              <div className="card-content flex">
                <h2>{cuisine.name}</h2>
                <Link to={`/cuisine/cuisineDetail/${cuisine.cuisineid}`} className="btn btn-primary">Detail</Link>
              </div>
            </div>
          ))
        }
      </div>
    </SectionWrapper>
  )
}

export default Categories