import React from 'react';
import { useData } from '../../contexts/DataContext.jsx';
import './Friends.scss'

const Friends = () => {
    const { userTheme } = useData();
    
    let userList = ["tes", "alice", "bob", "dav", "carole"]
    let friendsList = ["alice", "bob"]
    let pendingList = ["dav"]
    let receivedList = ["tes"]

    let friendsItems = []
    for (let i = 0; i < friendsList.length; i++){
        friendsItems.push(
            <li className="list-group-item d-flex justify-content-between align-items-center themed-list-item" key={i}>
                <span>{friendsList[i]}</span>
                <div>
                    <button type="button" className="btn btn-outline-success me-2">
                        Voir l'agenda
                    </button>
                    <button type="button" className="btn btn-outline-danger">
                        Retirer l'ami
                    </button>
                </div>
            </li>
        )
    }
    
    let pendingItems = []
    for (let i = 0; i < pendingList.length; i++){
        pendingItems.push(
            <li className="list-group-item themed-list-item" key={i}>
                {pendingList[i]}
            </li>
        )
    }

    let receivedItems = []
    for (let i = 0; i < receivedList.length; i++){
        receivedItems.push(
            <li className="list-group-item d-flex justify-content-between align-items-center themed-list-item" key={i}>
                <span>{receivedList[i]}</span>
                <button type="button" className="btn btn-outline-success me-2">
                    Accepter
                </button>
            </li>
        )
    }

    return (
        <div className="row friends-container" style={{margin:"2%"}} data-theme={userTheme}>
            <input className="form-control me-2 themed-input" type="search" placeholder="Search" aria-label="Search"/>
            <div className="col-md-6">
                <h2 className="themed-title">Amis</h2>
                <ul className="list-group themed-list">
                    {friendsItems}
                </ul>            
            </div>
            <div className="col-md-6">
                <h2 className="themed-title">Invations envoyées</h2>
                <ul className="list-group themed-list">
                    {pendingItems}
                </ul>
                <hr className="themed-hr"/>
                <h2 className="themed-title">Invations reçues</h2>
                <ul className="list-group themed-list">
                    {receivedItems}
                </ul>
            </div>
        </div>
    )
}

export default Friends