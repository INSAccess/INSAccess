import Day from './dateUtils.js'
import { minWidth, hours_timeline, baseEventWidth } from './constants.js'
import { useWindowDimensions, LoadData, max } from './randomUtils.js'
import {NavLink} from 'react-router-dom'
import { useState } from 'react'
import { Loading, Error } from '../components/templates.js'

const getEventHeight = (start_index, end_index, nb_div) => {
  return ((end_index-start_index)/(nb_div+1))*100
}

const getEventPos = (start_index, nb_div) => {
  return 100*(start_index+1)/(nb_div+1);
}

const SingleEvent = (props) => {
  const hours_events = Day.createHours();
  let start_index = hours_events.indexOf(props.start_time);
  let end_index = hours_events.indexOf(props.end_time);
  let eventHeight = getEventHeight(start_index, end_index, hours_events.length);
  let eventPosY = getEventPos(start_index, hours_events.length);

  const eventStyle = {
    height: `${eventHeight}%`,
    width: `${props.width}%`, //"93%",
    top: `${eventPosY}%`,
    flex: "93%",
    display:"block",
    position:"absolute",
    left: `${props.left}%`, //"0%",
    justifyContent:"left",
    userSelect: "none",
    marginLeft:"3.5%",
    marginRight:"3.5%"
  };

  return (
    <NavLink to={props.link}>
      <button type="button" className="event" style={eventStyle}>
        <p className="title" style={{fontSize:`${0.8-0.1*(props.label.length>=30)}vw`}}>{props.label}</p>
        <p className="room">{props.room}</p>
        <p className="teacher">{props.teacher}</p>
      </button>
    </NavLink>
  );
}   

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

function getNbEventsAtHour(hour, events){
  let nb_events = 0;
  for (let element of events){
    if (element.start < hour && element.end > hour){
      nb_events++;
    }
  }
  return nb_events;
}

function getHoursOfEvent(event){
  let hours = []
  const hours_events = Day.createHours();
  for (let hour of hours_events){
    if (hour >= event.start && hour <= event.end){
      hours.push(hour);
    }
  }
  return hours;
}

function getOverlappingEvents(event, events){

  let max_overlap = 0;
  let nb_overlap = 0;
  let hours_of_event = getHoursOfEvent(event)
  for (let hour of hours_of_event){
    nb_overlap = getNbEventsAtHour(hour, events)
    max_overlap = max(max_overlap, nb_overlap)
  }
  return max_overlap;
}

function getEventsOfDay(date, data){
  const events = []
  data.forEach(ev => {
    if (ev.date === date) {
      events.push(ev)
    }
  })
    return events;
}

const EventsOfDay = ({date, data}) => {
  const events_list = [];
  
  let i = 0;
  const events_of_day = getEventsOfDay(date, data);
  let day = new Day(date);
  const infos = day.getDateInfo();
  const placed = []

  for (let element of events_of_day){
    const nb_overlap_total = getOverlappingEvents(element, events_of_day);
    const nb_overlap_placed = getOverlappingEvents(element, placed);
    events_list.push(
      <SingleEvent key={i} start_time={element.start} end_time={element.end} 
      label={element.desc} teacher={element.teacher} room={element.room} link={element.link} 
      width={baseEventWidth/(nb_overlap_total)} left={baseEventWidth*(1-(nb_overlap_placed+1)/nb_overlap_total)} />
    );
    placed.push(element)
    i += 1;
  } 

  return (
    <div className="day">
      <div className="date">
        <p className="date-day">{infos[0]}</p>
        <p className="date-num">{infos[1]}</p> 
        <p className="date-month">{infos[2]}</p> 
      </div>
      <div className="events">
        {events_list}
      </div>
    </div>
  );
}

const AllEvents = ({start, data_path}) => {
  let dimensions = useWindowDimensions();
  let day = new Day(start);
  const [first_day, setDay] = useState(day);

  let {data, error, loading} = LoadData(data_path);

  if (loading) return <Loading />;
  if (error) {
    return <Error message={"Erreur lors de la récupération des cours, vérifiez que vous êtes bien connectés. Si le problème persiste, envoyez nous un message."}/>;
  }

  function handleDay(direction, value){
    if (direction === "prev"){
      setDay(first_day => first_day.prev(value))
    } else if (direction === "next"){
      setDay(first_day => first_day.next(value))
    }
  }
  
  let list_days = []
  let nb_days =  ((minWidth < dimensions.width) ? 5 : 1);
  let current_day = (nb_days == 5) ? first_day.copy().startOfWeek() : first_day.copy();

  for (let i = 0; i < nb_days; i++){
    list_days.push(<EventsOfDay key={i} date={current_day.getDate()} data={data}/>);
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