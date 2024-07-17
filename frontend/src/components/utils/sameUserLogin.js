import { useCookies } from 'react-cookie'

const CheckUserLogin =(userId) =>{
    const [cookies] = useCookies();

    if(cookies.auth !== undefined)
    {
        if(cookies.auth.userId === userId)
            return true;
        else
            return false;
    }
    return false;
}

export default CheckUserLogin;