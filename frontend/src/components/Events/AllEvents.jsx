import EventsInDay from "./EventsInDay";
import RandomUtils from "../../utils/RandomUtils";
import { useState, useEffect, useRef } from "react";
import { hours_timeline, minWidth } from "../../utils/Constants";
import Day from "../../utils/Day"
import './AllEvents.scss'

/**
 * React component for the timestamps on the left of the calendar
 * @component
 */
const TimeBar = () => {
  const hours = [];

  hours.push(<div key={-1} className="spacer"></div>);

  for (let i = 0; i < hours_timeline.length; i++){
    hours.push(<div key={i} className="time-marker">{hours_timeline[i]}</div>)
  }

  return (
    <div className="timeline">
        {hours}
    </div>
  );
}


/**
 * React component for all the events currently displayed
 * @component
 * @param {Day} start the first day of the week to display
 * @param {list} data the events of the week in JSON format
 * @param {boolean} asso whether you are trying to display associative events or not
 * @example
 * const first_day = new Day("1970-01-01")
 * const data = []
 * const isAsso = false
 * return (
 *  <AllEvents start={first_day} data={data} asso={isAsso} />
 * )
 */
const AllEvents = ({start, data, asso}) => {
  let dimensions = RandomUtils.useWindowDimensions();
  let day = new Day(start);

  let list_days = []
  const [first_day, setDay] = useState(day);
  let nb_days =  ((minWidth < dimensions.width) ? 5 : 1);
  let current_day = (nb_days == 5) ? first_day.copy().startOfWeek() : first_day.copy();

  function handleDay(direction, value){
    if (direction === "prev"){
      setDay(first_day => first_day.prev(value))
    } else if (direction === "next"){
      setDay(first_day => first_day.next(value))
    }
  }

const calendarRef = useRef(null);
let skipDays = (nb_days == 1) ? 1 : 7;

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
  }, [nb_days]);

  for (let i = 0; i < nb_days; i++){
    list_days.push(<EventsInDay key={i} date={current_day.getDate()} data={data} asso={asso}/>);
    current_day = current_day.next(1);
  }



  return (
    <div className="calendar" ref={calendarRef}>
      <button type="button" className="arrow-left" onClick={() => {handleDay("prev", skipDays)}}></button>
      <TimeBar />
      <div className="days">
        {list_days}
      </div>
      <button type="button" className="arrow-right turned" onClick={() => {handleDay("next", skipDays)}}></button>
  </div>
      
  );
}

export default AllEvents;