import Day from './dateUtils.js'
import { minWidth, hours_timeline, baseEventWidth } from './constants.js'
import { useWindowDimensions, LoadData } from './randomUtils.js'
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
    width: "93%",//`${props.width}%`,
    top: `${eventPosY}%`,
    left: "0%",//`${props.left}%`,
    userSelect: "none"
  };

  return (
    <NavLink to={props.link}>
      <button type="button" className="event" style={eventStyle}>
        <p className="title">{props.label}</p>
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

function getOverlappingEvents(event, events){
  let nb_overlap = 0;
  for (let element in events){
    let case1 = events[element].end >= events[event].start && events[element].end <= events[event].end
    let case2 = events[element].start >= events[event].start && events[element].start <= events[event].end
    if ((case1 || case2)  && (element != event)){
      nb_overlap++;
    }
  }
  return nb_overlap;
}

function getEventColumns(){

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

  for (let element in events_of_day){
    const nb_overlap = getOverlappingEvents(element, events_of_day, i);
    const object = events_of_day[element]
    events_list.push(
      <SingleEvent key={i} start_time={object.start} end_time={object.end} label={object.desc} teacher={object.teacher} room={object.room} link={object.link} width={baseEventWidth/(nb_overlap+1)} left={100-100/(nb_overlap+1)} />
    );
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