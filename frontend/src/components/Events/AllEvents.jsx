import EventsInDay from './EventsInDay';
import RandomUtils from '../../utils/RandomUtils';
import { useState, useEffect, useRef } from 'react';
import { hoursTimeline, minWidth } from '../../utils/Constants';
import Day from '../../utils/Day';
import './AllEvents.scss';
import { useData } from '../../contexts/DataContext.jsx';
import { useTranslation } from 'react-i18next';

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
    t('Sunday'),
    t('Monday'),
    t('Tuesday'),
    t('Wednesday'),
    t('Thursday'),
    t('Friday'),
    t('Saturday'),
  ];

  const BUNDLE = useData();
  let data = [];
  if (dataOrigin == 'asso') {
    data = BUNDLE.dataAsso;
  } else if (dataOrigin == 'friend') {
    data = BUNDLE.dataFriend;
  } else {
    data = BUNDLE.dataAgenda;
  }

  let dimensions = RandomUtils.useWindowDimensions();

  const [renderKey, setRenderKey] = useState(0);

  let nbDays = minWidth < dimensions.width ? 7 : 1;
  let currentDay = nbDays == 7 ? BUNDLE.day.copy().startOfWeek(dayList) : BUNDLE.day.copy();

  function handleDay(direction, value) {
    if (direction === 'prev') {
      BUNDLE.setDay((firstDay) => firstDay.prev(value));
    } else if (direction === 'next') {
      BUNDLE.setDay((firstDay) => firstDay.next(value));
    }
  }

  const calendarRef = useRef(null);

  useEffect(() => {
    setRenderKey((prev) => prev + 1);
  }, [BUNDLE.dataAsso, BUNDLE.dataAgenda]);

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
          <button
            type="button"
            className="btn btn-primary calendar-close-button"
            onClick={() => BUNDLE.setShowCalendar(false)}
          >
            {t('Return')}
          </button>
        </div>
      )}

      <div className="calendar" ref={calendarRef}>
        <button
          type="button"
          className="arrow-left"
          onClick={() => {
            handleDay('prev', nbDays);
          }}
        ></button>
        <TimeBar />
        <div className="days">{listDays}</div>
        <button
          type="button"
          className="arrow-right turned"
          onClick={() => {
            handleDay('next', nbDays);
          }}
        ></button>
      </div>
    </>
  );
};

export default AllEvents;
