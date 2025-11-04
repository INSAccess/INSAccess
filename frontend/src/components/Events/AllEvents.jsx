import { useState, useEffect, useRef } from 'react';
import { hoursTimeline, minWidth } from '../../utils/Constants';
import { useData } from '../../contexts/DataContext.jsx';
import { useTranslation } from 'react-i18next';
import EventsInDay from './EventsInDay';
import RandomUtils from '../../utils/RandomUtils';
import '../../assets/AllEvents.scss';

/**
 * React component for the timestamps on the left of the calendar
 * @component
 * @returns {JSX.Element}
 */
const TimeBar = () => {
  const hours = [];

  hours.push(<div key={-1} className="spacer"></div>);

  for (let i = 0; i < hoursTimeline.length; i++) {
    hours.push(
      <div key={i} className="time-marker">
        {hoursTimeline[i]}
      </div>
    );
  }

  return <div className="timeline">{hours}</div>;
};

/**
 * React component for all the events currently displayed
 * @param {Object} props
 * @param {boolean} props.asso
 *
 * @component
 * @returns {JSX.Element}
 */
const AllEvents = ({ dataOrigin }) => {
  const { t } = useTranslation();
  const dayList = [
    t('date.days.sunday'),
    t('date.days.monday'),
    t('date.days.tuesday'),
    t('date.days.wednesday'),
    t('date.days.thursday'),
    t('date.days.friday'),
    t('date.days.saturday'),
  ];
  const BUNDLE = useData();
  let data = [];
  if (dataOrigin == 'asso') {
    data = BUNDLE.dataAsso;
  } else if (dataOrigin == 'friend') {
    data = BUNDLE.dataFriend;
  } else if (dataOrigin == 'room') {
    data = BUNDLE.dataRoom;
  } else {
    data = BUNDLE.dataAgenda;
  }

  let dimensions = RandomUtils.useWindowDimensions();

  const [renderKey, setRenderKey] = useState(0);
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  let nbDays = minWidth < dimensions.width ? 7 : 1;
  let currentDay =
    nbDays == 7 ? BUNDLE.day.copy().startOfWeek(dayList) : BUNDLE.day.copy();

  function handleDay(direction, value) {
    if (direction === 'prev') {
      BUNDLE.setDay((firstDay) => firstDay.prev(value));
    } else if (direction === 'next') {
      BUNDLE.setDay((firstDay) => firstDay.next(value));
    }
  }

  useEffect(() => {
      if (searchTerm.trim() === '') {
        setFilteredSuggestions([]);
        return;
      }
      setFilteredSuggestions(
        BUNDLE.rooms
          .filter((room) =>
            room.toLowerCase().includes(searchTerm.toLowerCase())
          )
          .slice(0, 6)
      );
    }, [searchTerm]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setShowSuggestions(e.target.value.length > 0);
  };

  const handleRoomChange = (e) => {
    BUNDLE.setRoom(e);
    setSearchTerm(e);
    setShowSuggestions(false);
  };

  const handleSearchBlur = () => {
    // Délai pour permettre le clic sur une suggestion
    setTimeout(() => setShowSuggestions(false), 200);
  };

  const calendarRef = useRef(null);

  useEffect(() => {
    setRenderKey((prev) => prev + 1);
  }, [BUNDLE.dataAsso, BUNDLE.dataAgenda, BUNDLE.dataRoom]);

  useEffect(() => {
    if (dataOrigin === 'room') {
      BUNDLE.refreshRoomCalendar();
    }
  }, [BUNDLE.currentRoom]);

  useEffect(() => {
    let touchStartX = 0;
    let touchEndX = 0;
    const minDist = 50;

    const handleTouchStart = (event) => {
      touchStartX = event.touches[0].clientX;
    };

    const handleTouchEnd = (event) => {
      touchEndX = event.changedTouches[0].clientX;
      let swipeDistance = touchStartX - touchEndX;

      if (swipeDistance > minDist) {
        // Swiped left
        handleDay('next', nbDays);
      } else if (swipeDistance < -minDist) {
        // Swiped right
        handleDay('prev', nbDays);
      }
    };

    if (calendarRef.current) {
      calendarRef.current.addEventListener('touchstart', handleTouchStart);
      calendarRef.current.addEventListener('touchend', handleTouchEnd);
    }

    return () => {
      if (calendarRef.current) {
        calendarRef.current.removeEventListener('touchstart', handleTouchStart);
        calendarRef.current.removeEventListener('touchend', handleTouchEnd);
      }
    };
  }, [nbDays]);

  let listDays = [];
  for (let i = 0; i < nbDays; i++) {
    listDays.push(
      <EventsInDay
        key={`${i}-${renderKey}`}
        date={currentDay.getDate()}
        data={data}
        dataOrigin={dataOrigin}
      />
    );
    currentDay = currentDay.next(1);
  }

  return (
    <>
      {dataOrigin == 'friend' && (
        <div className="calendar-close-button-wrapper">
          <span id="friend-name">
            {t('friends.seeing')} {BUNDLE.currentFriend}
          </span>
          <button
            type="button"
            className="btn btn-primary calendar-close-button"
            onClick={() => BUNDLE.setShowCalendar(false)}
          >
            {t('friends.return')}
          </button>
        </div>
      )}

      {dataOrigin == 'room' && (
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
              {filteredSuggestions.map((room, index) => (
                <div
                  key={index}
                  className="suggestion-item"
                  onClick={() => handleRoomChange(room)}
                >
                  <span className="suggestion-username">{room}</span>
                  <button
                    type="button"
                    className="btn btn-outline-primary btn-sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRoomChange(room);
                    }}
                  >
                    {t('rooms.select')}
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
      )}

      <div className="calendar" ref={calendarRef}>
        <button
          type="button"
          className="arrow-left"
          aria-label="arrow-left"
          onClick={() => {
            handleDay('prev', nbDays);
          }}
        ></button>
        <TimeBar />
        <div className="days">{listDays}</div>
        <button
          type="button"
          className="arrow-right turned"
          aria-label="arrow-right"
          onClick={() => {
            handleDay('next', nbDays);
          }}
        ></button>
      </div>
    </>
  );
};

export default AllEvents;