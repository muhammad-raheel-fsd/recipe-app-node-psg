import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import CountryFlag from './CountryFlag';
import SectionWrapper from '../../common/SectionWrapper';
import Swal from 'sweetalert2'
import { useNavigate } from 'react-router-dom';
import '../../css/common.css';
import '../../css/cuisineDetail.css';
import CheckUserLogin from '../../utils/sameUserLogin';
import { useCookies } from 'react-cookie';

const CuisineDetail = () => {
    const navigate = useNavigate();
    const [cookies] = useCookies();

    let { slug } = useParams();
    console.log("id=>", slug);

    const [cuisineDetail, setCuisinesDetail] = useState({});
    
    const [isSameUser, setIsSameUser] = useState(false);

    const checkSameUser = (user_id) => {
        if (cookies.auth !== undefined) {
            return cookies.auth.userid === user_id;
        }
        return false;
    }

    const deleteCuisine = async () => {
        try {
            const response = await fetch(`http://localhost:8000/api/cuisines/deleteCuisine/${slug}`, {
                method: 'DELETE',
            });
            const result = await response.json();
            console.log("Deleted cuisine===>", result)

            if (result.status === 200) {
                Swal.fire({
                    title: 'Cuisine deleted successfully!',
                    text: 'The cuisine has been deleted.',
                    icon: 'success',
                    confirmButtonText: 'Okay'
                })
                navigate('/categories');
            }
            else {
                Swal.fire({
                    title: 'Failed to delete cuisine!',
                    text: 'The cuisine could not be deleted because this is used in restaurants.',
                    icon: 'error',
                    confirmButtonText: 'Okay'
                })
                navigate('/categories');
                console.error('Error deleting cuisine:', result);
            }
        } catch (error) {
            console.error('Error deleting cuisine:', error);
        }
    }

    const getCuisineDetail = async () => {
        try {
            const response = await fetch(`http://localhost:8000/api/cuisines/${slug}`);
            const data = await response.json();
            console.log("detail===>", data)
            setCuisinesDetail(data.data);
            console.log("detailed ===>", cuisineDetail)
        }
        catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        getCuisineDetail();
    }, [])

    useEffect(() => {
        if (cuisineDetail) {
            setIsSameUser(checkSameUser(cuisineDetail.userid));
        }
    }, [cookies, cuisineDetail]);



    return (
        <SectionWrapper>
            <div className="flex p-4 shadow">
                <div className='cuisine-flag-h'>
                    {cuisineDetail?.country && (
                        <CountryFlag
                            countryCode={cuisineDetail.value}
                            title={cuisineDetail.country}
                            slug={`/cuisine/cuisineDetail/${slug}`}
                        />
                    )}
                </div>
                <div className="flex">
                    <h1 id='h1'>{cuisineDetail?.name}</h1>
                    <p className="indent">{cuisineDetail?.description}</p>
                </div>
                {
                    isSameUser &&
                    <div className='flex-end'>
                        <Link to={`/cuisine/updateForm/${slug}`} className='btn btn-primary'>Edit Cuisine</Link>
                        <button onClick={deleteCuisine} className="btn btn-danger">Delete Cuisine</button>

                    </div>
                }
            </div>
        </SectionWrapper>
    )
}

export default CuisineDetail
