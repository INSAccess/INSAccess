import EventsInDay from "./EventsInDay";
import RandomUtils from "../../utils/RandomUtils";
import { useState, useEffect, useRef } from "react";
import { hoursTimeline, minWidth } from "../../utils/Constants";
import Day from "../../utils/Day"
import './AllEvents.scss'
import { useData } from '../../contexts/DataContext.jsx'
import { useTranslation } from 'react-i18next';

/**
 * React component for the timestamps on the left of the calendar
 * @component
 * @returns {JSX.Element}
 */
const TimeBar = () => {
  const hours = [];

  hours.push(<div key={-1} className="spacer"></div>);

  for (let i = 0; i < hoursTimeline.length; i++){
    hours.push(<div key={i} className="time-marker">{hoursTimeline[i]}</div>)
  }

  return (
    <div className="timeline">
        {hours}
    </div>
  );
}


/**
 * React component for all the events currently displayed
 * @param {Object} props
 * @param {Day} props.start
 * @param {Array} props.data
 * @param {boolean} props.asso  
 * 
 * @component
 * @returns {JSX.Element}
 */
const AllEvents = ({asso}) => {
  const { t, i18n } = useTranslation();

  const dayList = [t('Sunday'), t('Monday'), t('Tuesday'), t('Wednesday'), t('Thursday'), t('Friday'), t('Saturday'),];

  const BUNDLE = useData()
  let data = []
  if (asso){
    data = BUNDLE.dataAsso
  } else {
    data = BUNDLE.dataAgenda
  }
  const start = BUNDLE.day

  let dimensions = RandomUtils.useWindowDimensions();
  let day = new Day(start);

  let listDays = []
  const [firstDay, setDay] = useState(day);
  let nbDays =  ((minWidth < dimensions.width) ? 6 : 1);
  let currentDay = (nbDays == 6) ? firstDay.copy().startOfWeek(dayList) : firstDay.copy();

  function handleDay(direction, value){
    if (direction === "prev"){
      setDay(firstDay => firstDay.prev(value))
    } else if (direction === "next"){
      setDay(firstDay => firstDay.next(value))
    }
  }

const calendarRef = useRef(null);
let skipDays = (nbDays == 1) ? 1 : 7;

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
        handleDay("next", skipDays);
      } else if (swipeDistance < -minDist) {
        // Swiped right
        handleDay("prev", skipDays);
      }
    };

    if (calendarRef.current) {
      calendarRef.current.addEventListener("touchstart", handleTouchStart);
      calendarRef.current.addEventListener("touchend", handleTouchEnd);
    }

    return () => {
      if (calendarRef.current) {
        calendarRef.current.removeEventListener("touchstart", handleTouchStart);
        calendarRef.current.removeEventListener("touchend", handleTouchEnd);
      }
    };
  }, [nbDays]);

  for (let i = 0; i < nbDays; i++){
    listDays.push(<EventsInDay key={i} date={currentDay.getDate()} data={data} asso={asso}/>);
    currentDay = currentDay.next(1);
  }

  return (
    <div className="calendar" ref={calendarRef}>
      <button type="button" className="arrow-left" onClick={() => {handleDay("prev", skipDays)}}></button>
      <TimeBar />
      <div className="days">
        {listDays}
      </div>
      <button type="button" className="arrow-right turned" onClick={() => {handleDay("next", skipDays)}}></button>
  </div>
      
  );
}

export default AllEvents;