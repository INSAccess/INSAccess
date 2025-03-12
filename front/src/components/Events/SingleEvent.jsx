import { NavLink } from 'react-router-dom';
import Day from '../../js/Day';
import EventUtils from '../../js/EventUtils';

const SingleEvent = (props) => {
    const hours_events = Day.createHours();
    let start_index = hours_events.indexOf(props.start_time);
    let end_index = hours_events.indexOf(props.end_time);
    let eventHeight = EventUtils.getEventHeight(start_index, end_index, hours_events.length);
    let eventPosY = EventUtils.getEventPos(start_index, hours_events.length);
  
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

export default SingleEvent;