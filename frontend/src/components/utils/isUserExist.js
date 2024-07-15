import { useCookies } from "react-cookie";

const IsUserExist = ()=>{
    const [cookies] = useCookies();
    if(cookies.auth!== undefined)
        return true;
    else
    return false;
}

export default IsUserExist;
