import { API_URL } from '../js/constants.jsx'
import { Error, Loading } from './templates.jsx'
import RandomUtils from '../js/RandomUtils.jsx'
import { useState, useEffect } from 'react'

const EventCreator = () => {

    const [isAsso, setAsso] = useState(false);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
          const result = await RandomUtils.fetchData(API_URL+"/api/is_assos");
          if (result.data){
            setAsso(result.data);
          }
          setError(result.error);
          setLoading(false);
        };
    
        loadData();
    }, []);

    const url_login = API_URL+"/login"
    const url_create = API_URL+"/create"

    if (loading){
        return <Loading/>
    }

    if (error){
        return <Error message={"Verification de l'identité impossible"}/>
    }

    if (!isAsso){
        return (
            <div>
                <p>Vous n'êtes pas une association</p>
                <button href={url_login}>Se connecter en tant qu'association</button>
            </div>
        );
    } else {
        return <div>toto</div>
        window.location.replace(url_create);
    }  
}

export default EventCreator;