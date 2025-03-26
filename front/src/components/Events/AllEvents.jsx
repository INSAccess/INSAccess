import EventsInDay from "./EventsInDay";
import RandomUtils from "../../js/RandomUtils";
import { useState } from "react";
import { hours_timeline, minWidth } from "../../js/constants";
import Day from "../../js/Day"
import './AllEvents.scss'

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

  for (let i = 0; i < nb_days; i++){
    list_days.push(<EventsInDay key={i} date={current_day.getDate()} data={data} asso={asso}/>);
    current_day = current_day.next(1);
  }

  let skipDays = (nb_days == 1) ? 1 : 7;

  return (
    <div className="calendar">
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