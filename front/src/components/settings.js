import { LoadData, TDSelection } from '../js/randomUtils.js'
import { useEffect, useState } from 'react';
import { API_URL } from '../js/constants.js'
import { Error, Loading } from './templates.js'
import { EventCreator } from './EventCreator.js';

const Settings = () => {

    let {data, error, loading} = LoadData(API_URL+"/api/get_tds");
    const [user_tds, setUserTD] = useState(null);
    const [all_tds, setAllTD] = useState(null);
    const [view, setView] = useState("TDs");

    function displayView(view){
        switch (view){
            case "TDs" : return (<TDSelection allTDs={all_tds} userTDs={user_tds} />);
            case "create" : return (<EventCreator/>);
            case "infos" : return (<></>);
        }
    }

    useEffect(() => {
        if (data){
            setUserTD(data.user_tds)
            setAllTD(data.all_tds)
        }
    }, [data])

    if (loading) {
        return (
            <Loading />
        );
    }

    if (error){
        return <Error message={"Erreur lors du fetch des settings"}/>
    }

    if (user_tds && all_tds){
        return (
            <div>
                <h1>Settings</h1>
                <button onClick={() => {setView("TDs")}}>TD List</button>
                <button onClick={() => {setView("create")}}>Create Event</button>
                <button onClick={() => {setView("infos")}}>Informations</button>
                <>{displayView(view)}</>
            </div>
        );  
    }
}

export default Settings;