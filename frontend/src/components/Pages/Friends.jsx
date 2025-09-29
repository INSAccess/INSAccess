import { useState, useEffect } from 'react';
import { useData } from '../../contexts/DataContext.jsx';
import { API_URL } from '../../utils/Constants.jsx';
import { useTranslation } from 'react-i18next';
import RandomUtils from '../../utils/RandomUtils.jsx';
import AllEvents from '../Events/AllEvents.jsx';
import './Friends.scss';

const Friends = () => {
  const { t } = useTranslation();

  const {
    userProfile,
    userList,
    friendsList,
    setFriendsList,
    pendingList,
    setPendingList,
    receivedList,
    setReceivedList,
    setDataFriend,
    setColorsFriend,
    showCalendar,
    setShowCalendar,
    setCurrentFriend,
  } = useData();

  const [availableUsers, setAvailableUsers] = useState([]);
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    const newAvailableUsers = userList.filter(
      (user) =>
        !friendsList.includes(user.username) &&
        !pendingList.includes(user.username) &&
        !receivedList.includes(user.username) &&
        user.username !== userProfile.username
    );
    setAvailableUsers(newAvailableUsers);
  }, [userList, friendsList, pendingList, receivedList]);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredSuggestions([]);
      return;
    }
    setFilteredSuggestions(
      availableUsers
        .filter((user) =>
          user.username.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .slice(0, 6)
    );
  }, [availableUsers, searchTerm]);

  function getDisplayName(users, username) {
    try {
      let user = users.filter(e => e.username == username)[0].displayName
      return user
    } catch (e){
      return t('messages.nameError');
    }
  }

  const handleCancel = async (username) => {
    try {
      const result = await RandomUtils.fetchDataWithMethod(
        `${API_URL}/api/user/friends`,
        'DELETE',
        { other_user: username }
      );
      if (result.error) {
        console.error(t('messages.cancelError'), result.error);
        return;
      }
      setPendingList(pendingList.filter((e) => e !== username));
    } catch (error) {
      console.error(t('messages.cancelError'), error);
    }
  };

  const handleSendInvitation = async (username) => {
    try {
      const result = await RandomUtils.fetchDataWithMethod(
        `${API_URL}/api/user/friends`,
        'POST',
        { other_user: username }
      );
      if (result.error) {
        console.error(t('messages.sendError'), result.error);
        return;
      }
      setPendingList((prev) => {
        if (!prev.includes(username)) {
          return [...prev, username];
        }
        return prev;
      });
      setSearchTerm('');
      setShowSuggestions(false);
    } catch (error) {
      console.error(t('messages.sendError'), error);
    }
  };

  const handleAccept = async (username) => {
    try {
      const result = await RandomUtils.fetchDataWithMethod(
        `${API_URL}/api/user/friends`,
        'POST',
        { other_user: username }
      );
      if (result.error) {
        console.error(t('messages.acceptError'), result.error);
        return;
      }
      setReceivedList(receivedList.filter((e) => e !== username));
      setFriendsList((prev) => {
        if (!prev.includes(username)) {
          return [...prev, username];
        }
        return prev;
      });
    } catch (error) {
      console.error(t('messages.acceptError'), error);
    }
  };

  const handleDeleteFriend = async (username) => {
    try {
      const result = await RandomUtils.fetchDataWithMethod(
        `${API_URL}/api/user/friends`,
        'DELETE',
        { other_user: username }
      );
      if (result.error) {
        console.error(t('messages.deleteError'), result.error);
        return;
      }
      setFriendsList(friendsList.filter((e) => e !== username));
    } catch (error) {
      console.error(t('messages.deleteError'), error);
    }
  };

  const handleRefuse = async (username) => {
    try {
      const result = await RandomUtils.fetchDataWithMethod(
        `${API_URL}/api/user/friends`,
        'DELETE',
        { other_user: username }
      );
      if (result.error) {
        console.error(t('messages.deleteError'), result.error);
        return;
      }
      setReceivedList(receivedList.filter((e) => e !== username));
    } catch (error) {
      console.error(t('messages.deleteError'), error);
    }
  };

  const handleSeeCalendar = async (username) => {
    const friendCalendar = await RandomUtils.fetchData(
      API_URL + '/api/calendar/friend/' + username
    );
    if (friendCalendar.data) {
      setDataFriend(friendCalendar.data.events);
      setColorsFriend(friendCalendar.data.colors);
      setCurrentFriend(getDisplayName(userList, username));
      setShowCalendar(true);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setShowSuggestions(e.target.value.length > 0);
  };

  const handleSearchBlur = () => {
    // Délai pour permettre le clic sur une suggestion
    setTimeout(() => setShowSuggestions(false), 200);
  };

  let friendsItems = [];
  for (let i = 0; i < friendsList.length; i++) {
    friendsItems.push(
      <li
        className="list-group-item d-flex justify-content-between align-items-center themed-list-item"
        key={i}
      >
        <span>{getDisplayName(userList, friendsList[i])}</span>
        <div>
          <button
            type="button"
            className="btn btn-outline-success me-2"
            onClick={() => handleSeeCalendar(friendsList[i])}
          >
            <span className="d-none d-md-inline me-2">{t('nav.calendar')}</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-calendar-fill" viewBox="0 0 16 16">
              <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V5h16V4H0V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5"/>
            </svg>
          </button>
          <button
            type="button"
            className="btn btn-outline-danger"
            onClick={() => handleDeleteFriend(friendsList[i])}
          >
            <span className="d-none d-md-inline me-2">{t('friends.remove')}</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-person-x-fill" viewBox="0 0 16 16">
              <path fillRule="evenodd" d="M1 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6m6.146-2.854a.5.5 0 0 1 .708 0L14 6.293l1.146-1.147a.5.5 0 0 1 .708.708L14.707 7l1.147 1.146a.5.5 0 0 1-.708.708L14 7.707l-1.146 1.147a.5.5 0 0 1-.708-.708L13.293 7l-1.147-1.146a.5.5 0 0 1 0-.708"/>
            </svg>
          </button>
        </div>
      </li>
    );
  }

  let pendingItems = [];
  for (let i = 0; i < pendingList.length; i++) {
    pendingItems.push(
      <li
        className="list-group-item d-flex justify-content-between align-items-center themed-list-item"
        key={i}
      >
        <span>{getDisplayName(userList, pendingList[i])}</span>
        <button
          type="button"
          className="btn btn-outline-danger"
          onClick={() => handleCancel(pendingList[i])}
        >
          <span className="d-none d-md-inline me-2">{t('friends.cancel')}</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-x-lg" viewBox="0 0 16 16">
            <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"/>
          </svg>
        </button>
      </li>
    );
  }

  let receivedItems = [];
  for (let i = 0; i < receivedList.length; i++) {
    receivedItems.push(
      <li
        className="list-group-item d-flex justify-content-between align-items-center themed-list-item"
        key={i}
      >
        <span>{getDisplayName(userList, receivedList[i])}</span>
        <div>
          <button
            type="button"
            className="btn btn-outline-success me-2"
            onClick={() => handleAccept(receivedList[i])}
          >
            <span className="d-none d-md-inline me-2">{t('friends.accept')}</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-person-add" viewBox="0 0 16 16">
              <path d="M12.5 16a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7m.5-5v1h1a.5.5 0 0 1 0 1h-1v1a.5.5 0 0 1-1 0v-1h-1a.5.5 0 0 1 0-1h1v-1a.5.5 0 0 1 1 0m-2-6a3 3 0 1 1-6 0 3 3 0 0 1 6 0M8 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4"/>
              <path d="M8.256 14a4.5 4.5 0 0 1-.229-1.004H3c.001-.246.154-.986.832-1.664C4.484 10.68 5.711 10 8 10q.39 0 .74.025c.226-.341.496-.65.804-.918Q8.844 9.002 8 9c-5 0-6 3-6 4s1 1 1 1z"/>
            </svg>
          </button>
          <button
            type="button"
            className="btn btn-outline-danger"
            onClick={() => handleRefuse(receivedList[i])}
          >
            <span className="d-none d-md-inline me-2">{t('friends.refuse')}</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-x-lg" viewBox="0 0 16 16">
              <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"/>
            </svg>
          </button>
        </div>
      </li>
    );
  }

  if (showCalendar) {
    return <AllEvents dataOrigin="friend" />;
  }
  return (
    <div
      className="row friends-container mx-0"
    >
      <div className="search-container">
        <input
          className="form-control me-2 themed-input"
          type="search"
          placeholder={t("Search")}
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
                  {t('friends.invite')}
                </button>
              </div>
            ))}
          </div>
        )}

        {showSuggestions &&
          searchTerm.length > 0 &&
          filteredSuggestions.length === 0 && (
            <div className="suggestions-dropdown">
              <div className="suggestion-item no-results">
                {t('friends.noUserFound')}
              </div>
            </div>
          )}
      </div>

      <div className="col-md-6">
        <h2 className="themed-title">
          {t('nav.friends')} <span className="badge rounded-pill text-bg-secondary">{friendsList.length}</span>
        </h2>
        <ul className="list-group themed-list">{friendsItems}</ul>
        <hr className="themed-hr" />
      </div>

      <div className="col-md-6">
        <h2 className="themed-title">
          {t('friends.inviteSent')} <span className="badge rounded-pill text-bg-secondary">{pendingList.length}</span>
        </h2>
        <ul className="list-group themed-list">{pendingItems}</ul>
        <hr className="themed-hr" />
        <h2 className="themed-title">
          {t('friends.inviteReceived')} <span className="badge rounded-pill text-bg-secondary">{receivedList.length}</span>
        </h2>
        <ul className="list-group themed-list">{receivedItems}</ul>
      </div>
    </div>
  );
};

export default Friends;