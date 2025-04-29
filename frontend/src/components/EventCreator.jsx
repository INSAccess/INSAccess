import { API_URL } from '../utils/Constants.jsx'
import { Error, Loading } from './Templates.jsx'
import RandomUtils from '../utils/RandomUtils.jsx'
import { useState, useEffect } from 'react'
import Button from 'react-bootstrap/Button';
import './EventCreator.scss'
import Day from '../utils/Day.jsx'

const Form = ({url_create}) => {

    let date = new Date()
    let day = new Day(date)

    function handleSubmit(e) {
        // prevent the browser from reloading the page
        e.preventDefault();
    
        // read form data
        const form = e.target;
        const formData = new FormData(form);
        // add timestamp field
        formData.append("timestamp", date.getTime())

        //modify the start_hour field to only end with 5 or 0
        let start_hour = formData.get("start_hour")
        if (start_hour != undefined && start_hour != ""){
            if (start_hour[start_hour.length-1] != "5" && start_hour[start_hour.length-1] != "0"){
                formData.set("start_hour", start_hour.replace(/.$/, "0"))
            }
        } else {
            formData.set("start_hour", "08:00")
        }

        //modify the end_hour field to only end with 5 or 0
        let end_hour = formData.get("end_hour")
        if (end_hour != undefined && end_hour != ""){
            if (end_hour[end_hour.length-1] != "5" && end_hour[end_hour.length-1] != "0"){
                formData.set("end_hour", end_hour.replace(/.$/, "5"))
            }
        } else {
            formData.set("end_hour", "18:15")
        }

        //fetch(url_create, { method: form.method, body: formData });
    
        const formJson = Object.fromEntries(formData.entries());
        console.log(formJson);
    }

    return (
        <form method="post" onSubmit={handleSubmit}>
            <label>
            Titre de l'événement: <input name="title" defaultValue="Une valeur initiale" />
            </label>
            <hr />
            <label>
            Date : <input name="date" type="date" defaultValue={day.getDate()}/>
            </label>
            <hr />
            <label>
            Heure de début : <input name="start_hour" type="time" defaultValue="08:00"/>
            </label>
            <hr />
            <label>
            Heure de fin : <input name="end_hour" type="time" defaultValue="18:15"/>
            </label>
            <hr />
            <label>
            Description : <input name="desc" defaultValue="Une valeur initiale" />
            </label>
            <hr />
            <label>
            Lien : <input name="associated_link" defaultValue="Une valeur initiale" />
            </label>
            <hr />
            <label>
            Salle : <input name="room" defaultValue="Une valeur initiale" />
            </label>
            <hr />
            <button type="submit">Créer l'événement</button>
            <button type="reset">Effacer</button>
        </form>
    )
}

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
        return <Form url={url_create}/>
    }  
}

export default EventCreator;