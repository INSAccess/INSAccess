import TDSelection from '../TDSelection.jsx';
import RandomUtils from '../../js/RandomUtils.jsx';
import { useEffect, useState } from 'react';
import { API_URL } from '../../js/constants.jsx'
import { Loading } from '../templates.jsx'
import EventCreator from '../EventCreator.jsx';

const Settings = () => {

    let {data, error, loading} = RandomUtils.LoadData(API_URL+"/api/get_tds/ITI3?format=json");
    const [user_tds, setUserTD] = useState(null);
    const [all_tds, setAllTD] = useState(null);
    const [view, setView] = useState("TDs");

    function displayView(view){
        switch (view){
            case "TDs" : return (<TDSelection allTDs={all_tds} userTDs={user_tds} />);
            case "create" : return (<EventCreator/>);
        }
    }

    useEffect(() => {
        if (data){
            setUserTD(data.user_tds)
            setAllTD(data.department_tds)
        }
    }, [data])

    if (loading) {
        return (
            <Loading />
        );
    }

    if (error){
        console.error("Erreur lors du fetch des settings")
        useEffect(() => {
            setUserTD([])
            setAllTD([])
        }, [])
    }

    if (user_tds && all_tds){
        return (
            <div>
                <h1>Settings</h1>
                <button onClick={() => {setView("TDs")}}>TD List</button>
                <button onClick={() => {setView("create")}}>Create Event</button>
                <>{displayView(view)}</>
            </div>
        ); 
    } else {
        return (
            <div>
                <h1>Settings</h1>
            </div>
        )
    }

}

export default Settings;