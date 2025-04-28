import { API_URL } from '../utils/Constants.jsx'
import { Error, Loading } from './Templates.jsx'
import RandomUtils from '../utils/RandomUtils.jsx'
import { useState, useEffect } from 'react'
import Button from 'react-bootstrap/Button';

const EventCreator = () => {

    const [isAsso, setAsso] = useState(false);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
          const result = await RandomUtils.fetchData(API_URL+"/api/is_connected");
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
                <Button href={url_login}>Se connecter en tant qu'association</Button>
            </div>
        );
    } else {
        return <div>toto</div>
    }  
}

export default EventCreator;