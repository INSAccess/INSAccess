import { API_URL } from '../utils/Constants.jsx'
import { ErrorTemplate, Loading } from './Templates.jsx'
import RandomUtils from '../utils/RandomUtils.jsx'
import { useState, useEffect } from 'react'
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import './EventCreator.scss'
import Day from '../utils/Day.jsx'
import { useData } from '../contexts/DataContext.jsx'; 

const EvenementForm = ({}) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorFlag, setErrorFlag] = useState(false);
    const [statusMessage, setStatusMessage] = useState("");
    const { forceUpdate } = useData();

    // Function to save evenement to the backend
    const saveEvenement = async ({form}) => {
        try {
            const response = await fetch(API_URL+'/api/post_insa_evenement', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'X-CSRFToken': RandomUtils.getCSRFToken()},
                mode:"cors",
                credentials:'include',
                body: JSON.stringify(form),
            });
            const data = await response.json();
            setStatusMessage("Événement créé avec succès !");
            setErrorFlag(true);
            setIsSubmitting(true);
            forceUpdate();
            setTimeout(() => {
                setIsSubmitting(false);
            }, 2000);
        } catch (error) {
            console.error(error);
            setStatusMessage("Erreur lors de la création de l'événement.");
            setErrorFlag(true);
            setIsSubmitting(false);
        }
    };

    let date = new Date();
    let day = new Day(date);

    function handleSubmit(e) {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);
        let startHour = formData.get("start_hour");
        if (startHour != undefined && startHour != ""){
            if (startHour[startHour.length-1] != "5" && startHour[startHour.length-1] != "0"){
                formData.set("start_hour", startHour.replace(/.$/, "0"));
            }
        } else {
            formData.set("start_hour", "08:00");
        }
        let endHour = formData.get("end_hour");
        if (endHour != undefined && endHour != ""){
            if (endHour[endHour.length-1] != "5" && endHour[endHour.length-1] != "0"){
                formData.set("end_hour", endHour.replace(/.$/, "5"));
            }
        } else {
            formData.set("end_hour", "18:15");
        }
        const formJson = Object.fromEntries(formData.entries());
        saveEvenement({ form: formJson });
    }

    return (
        <div style={{ position: 'relative', minHeight: '100vh' }}>
            <form method="post" onSubmit={handleSubmit}>
                <label>
                Titre de l'événement: <input name="title" placeholder="Une valeur initiale" />
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
                Description : <input name="info" placeholder="Une valeur initiale" />
                </label>
                <hr />
                <label>
                Lien : <input name="associated_link" placeholder="Une valeur initiale" />
                </label>
                <hr />
                <label>
                Salle : <input name="location" placeholder="Une valeur initiale" />
                </label>
                <hr />
                <button
                    className="btn btn-primary"
                    type="submit"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Création en cours...' : 'Créer l\'événement'}
                </button>
                <button className="btn btn-primary" type="reset">Effacer</button>
            </form>
            {errorFlag &&
                <Alert
                    variant="success"
                    onClose={() => setErrorFlag(false)}
                    dismissible
                    style={{
                        position: 'fixed',
                        bottom: 20,
                        left: 20,
                        right: 20,
                        zIndex: 1050
                    }}
                >
                    {statusMessage}
                </Alert>
            }
        </div>
    );
};

const EventCreator = () => {
    const [isAsso, setAsso] = useState(false);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
          const result = await RandomUtils.fetchData(API_URL+"/api/is_association");
          if (result.data){
            setAsso(result.data);
          }
          setError(result.error);
          setLoading(false);
        };
        loadData();
    }, []);

    const urlLogin = API_URL+"authentification/login";
    const urlCreate = API_URL+"/create";

    if (loading){
        return <Loading/>
    }
    if (error){
        return <ErrorTemplate message={"Verification de l'identité impossible"}/>
    }
    if (!isAsso){
        return (
            <div>
                <p>Vous n'êtes pas une association</p>
                <Button href={urlLogin}>Se connecter en tant qu'association</Button>
            </div>
        );
    } else {
        return <EvenementForm url={urlCreate}/>
    }
}

export default EventCreator;
