import { useAuth } from "../contexts/AuthContext.jsx";
import { API_URL } from '../js/constants.jsx'
import { Error, Loading } from './templates.jsx'

const ProtectedRoute = ({ children }) => {
    const { token, loading, error } = useAuth();

    const url_login = API_URL+"/login"


    if (loading) {
        return <Loading />
    } else if (!token){
        window.location.replace(url_login)
    }

    if (token){
        return children;
    }

    if (error){
        window.location.replace(url_login)

        return <Error message={error}/>
    }
};

export default ProtectedRoute;
