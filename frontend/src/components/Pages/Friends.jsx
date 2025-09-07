import { useState, useEffect } from 'react';
import { useData } from '../../contexts/DataContext.jsx';
import RandomUtils from '../../utils/RandomUtils.jsx';
import { API_URL } from '../../utils/Constants.jsx';
import AllEvents from '../Events/AllEvents.jsx';
import { useTranslation } from 'react-i18next'
import './Friends.scss'



const Friends = () => {

    const { t } = useTranslation();

    const { userProfile, userTheme, userList, friendsList, setFriendsList, pendingList, setPendingList, receivedList, setReceivedList, setDataFriend, showCalendar, setShowCalendar } = useData();

    const [availableUsers, setAvailableUsers] = useState([]);
    const [filteredSuggestions, setFilteredSuggestions] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [showSuggestions, setShowSuggestions] = useState(false);

    useEffect(() => {
        const newAvailableUsers = userList.filter(user =>
            !friendsList.includes(user.username) &&
            !pendingList.includes(user.username) &&
            !receivedList.includes(user.username) &&
            user.username !== userProfile.username
        );
        setAvailableUsers(newAvailableUsers);
    }, [userList, friendsList, pendingList, receivedList]);
    
    useEffect(() => {
        if (searchTerm.trim() === "") {
            setFilteredSuggestions([]);
            return;
        }
        setFilteredSuggestions(
            availableUsers.filter(user =>
                user.username.toLowerCase().includes(searchTerm.toLowerCase())
            ).slice(0, 6)
        );
    }, [availableUsers, searchTerm]);
    
    function getDisplayName(users, username){
        for (let element of users){
            if (element.username == username) return element.displayName
        }
        return t("NameError")
    }

    const handleCancel = async (username) => {
        try {
          const result = await RandomUtils.fetchDataWithMethod(
            `${API_URL}/api/friends/`,
            'DELETE',
            { other_user: username }
          );
          if (result.error) {
            console.error(t("CancelError"), result.error);
            return;
          }
          setPendingList(pendingList.filter(e => e !== username));
        } catch (error) {
          console.error(t("CancelError"), error);
        }
      };
      

    const handleSendInvitation = async (username) => {
        try {
          const result = await RandomUtils.fetchDataWithMethod(
            `${API_URL}/api/friends/`,
            'POST',
            { other_user: username }
          );
          if (result.error) {
            console.error(t("SendError"), result.error);
            return;
          }
          setPendingList(prev => {
            if (!prev.includes(username)) {
              return [...prev, username];
            }
            return prev;
          });
          setSearchTerm("");
          setShowSuggestions(false);
        } catch (error) {
          console.error(t("SendError"), error);
        }
      };
      

      const handleAccept = async (username) => {
        try {
          const result = await RandomUtils.fetchDataWithMethod(
            `${API_URL}/api/friends/`,
            'POST',
            { other_user: username }
          );
          if (result.error) {
            console.error(t("AcceptError"), result.error);
            return;
          }
          setReceivedList(receivedList.filter(e => e !== username));
          setFriendsList(prev => {
            if (!prev.includes(username)) {
              return [...prev, username];
            }
            return prev;
          });
        } catch (error) {
          console.error(t("AcceptError"), error);
        }
      };
      

      const handleDeleteFriend = async (username) => {
        try {
          const result = await RandomUtils.fetchDataWithMethod(
            `${API_URL}/api/friends/`,
            'DELETE',
            { other_user: username }
          );
          if (result.error) {
            console.error(t("DeleteError"), result.error);
            return;
          }
          setFriendsList(friendsList.filter(e => e !== username));
        } catch (error) {
          console.error(t("DeleteError"), error);
        }
      };
      

    const handleSeeCalendar = async (username) => {
        const friendCalendar = await RandomUtils.fetchData(API_URL + "/api/get_friend_calendar/"+username)
        if (friendCalendar.data){
            setDataFriend(friendCalendar.data)
            setShowCalendar(true);
        }
    }

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setShowSuggestions(e.target.value.length > 0);
    }

    const handleSearchBlur = () => {
        // Délai pour permettre le clic sur une suggestion
        setTimeout(() => setShowSuggestions(false), 200);
    }

    let friendsItems = []
    for (let i = 0; i < friendsList.length; i++){
        friendsItems.push(
            <li className="list-group-item d-flex justify-content-between align-items-center themed-list-item" key={i}>
                <span>{getDisplayName(userList, friendsList[i])}</span>
                <div>
                    <button type="button" className="btn btn-outline-success me-2" onClick={() => handleSeeCalendar(friendsList[i])}>
                        {t("Calendar")}
                    </button>
                    <button type="button" className="btn btn-outline-danger" onClick={() => handleDeleteFriend(friendsList[i])}>
                        {t("Remove")}
                    </button>
                </div>
            </li>
        )
    }
    
    let pendingItems = []
    for (let i = 0; i < pendingList.length; i++){
        pendingItems.push(
            <li className="list-group-item d-flex justify-content-between align-items-center themed-list-item" key={i}>
                <span>{getDisplayName(userList, pendingList[i])}</span>
                <button type="button" className="btn btn-outline-danger" onClick={() => handleCancel(pendingList[i])}>
                        {t("Cancel")}
                </button>
            </li>
        )
    }

    let receivedItems = []
    for (let i = 0; i < receivedList.length; i++){
        receivedItems.push(
            <li className="list-group-item d-flex justify-content-between align-items-center themed-list-item" key={i}>
                <span>{getDisplayName(userList, receivedList[i])}</span>
                <button type="button" className="btn btn-outline-success" onClick={() => handleAccept(receivedList[i])}>
                    {t("Accept")}
                </button>
            </li>
        )
    }

    if (showCalendar){
        return (
            <AllEvents dataOrigin="friend" />
        )
    }
    return (
        <div className="row friends-container" style={{margin:"2%"}} data-theme={userTheme}>
            <div className="search-container">
                <input 
                    className="form-control me-2 themed-input" 
                    type="search" 
                    placeholder="Rechercher un utilisateur..." 
                    aria-label="Search"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    onFocus={() => setShowSuggestions(searchTerm.length > 0)}
                    onBlur={handleSearchBlur}
                />
                
                {showSuggestions && filteredSuggestions.length > 0 && (
                    <div className="suggestions-dropdown">
                        {filteredSuggestions.map((user, index) => (
                            <div 
                                key={index}
                                className="suggestion-item"
                                onClick={() => handleSendInvitation(user.username)}
                            >
                                <span className="suggestion-username">{user.username}</span>
                                <button 
                                    type="button" 
                                    className="btn btn-outline-primary btn-sm"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleSendInvitation(user.username);
                                    }}
                                >
                                    {t("Invite")}
                                </button>
                            </div>
                        ))}
                    </div>
                )}
                
                {showSuggestions && searchTerm.length > 0 && filteredSuggestions.length === 0 && (
                    <div className="suggestions-dropdown">
                        <div className="suggestion-item no-results">
                            {t("NoUserFound")}
                        </div>
                    </div>
                )}
            </div>

            <div className="col-md-6">
                <h2 className="themed-title">{t("Friends")} ({friendsList.length})</h2>
                <ul className="list-group themed-list">
                    {friendsItems}
                </ul>
                <hr className="themed-hr"/> 
            </div>
            
            <div className="col-md-6">
                <h2 className="themed-title">{t("InviteSent")} ({pendingList.length})</h2>
                <ul className="list-group themed-list">
                    {pendingItems}
                </ul>
                <hr className="themed-hr"/>
                <h2 className="themed-title">{t("InviteReceived")} ({receivedList.length})</h2>
                <ul className="list-group themed-list">
                    {receivedItems}
                </ul>
            </div>
        </div>
    )
}

export default Friends