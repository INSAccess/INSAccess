import { NavLink } from 'react-router-dom';
import Day from '../../utils/Day';
import EventUtils from '../../utils/EventUtils';
import RandomUtils from '../../utils/RandomUtils'
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import './SingleEvent.scss';

/**
 * React component that only returns a button redirecting to a link if this is an association
 * @component
 * @param {boolean} asso whether you are trying to display a modal for an associative event or not
 * @param {string} link target link 
 */
const FollowLink = ({asso, link}) => {
  if (asso) {
    return (
      <NavLink to={link}>
        <Button>
          En savoir plus
        </Button>
      </NavLink>
    )
  } else {
    return <></>
  }
}

/**
 * React component that only returns a description if this is an association
 * @component
 * @param {boolean} asso whether you are trying to display a modal for an associative event or not
 * @param {string} desc description
 */
const Description = ({asso, desc}) => {
  if (asso){ 
    return <div><strong>Description : </strong><br/>{desc}</div> 
  } else { 
    return <></>
  }
}

/**
 * React component to display a single event
 * @component
 * @example
 * const element = {
 *  start_hour : "0900",
 *  end_hour : "1115",
 *  desc : "",
 *  link_teacher : "Random Name",
 *  link_room : "Ma-H-R1-03",
 *  link : "agendas.insa-rouen.fr"
 * }
 * const width = "93%"
 * const left = "0%"
 * return (
 *  <SingleEvent key={i} start_time={element.start_hour} end_time={element.end_hour}
    label={element.desc} teacher={element.link_teacher} room={element.link_room} link={element.link} 
    width={width} left={left}
    desc={''} asso={asso}/>
  )
 */
const SingleEvent = (props) => {
    const hours_events = Day.createHours();
    let start_index = hours_events.indexOf(props.start_time);
    let end_index = hours_events.indexOf(props.end_time);
    let eventHeight = EventUtils.getEventHeight(start_index, end_index, hours_events.length);
    let eventPosY = EventUtils.getEventPos(start_index, hours_events.length);
  
    const eventStyle = {
      height: `${eventHeight}%`,
      width: `${props.width}%`,
      top: `${eventPosY}%`,
      display:"block",
      position:"absolute",
      left: `${props.left}%`, 
      justifyContent:"left",
      userSelect: "none",
      marginLeft:"3.5%",
      marginRight:"3.5%"
    };

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
  
    return (
      <>
        <button type="button" className="event" style={eventStyle} onClick={handleShow}>
          <p className="title">{(props.label) ? props.label : ""}</p>
          <p className="room">{(props.room.length > 0) ? RandomUtils.Join(props.room) : ""}</p>
        </button>

        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>{props.label}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div><strong>Heure de début : </strong>{Day.presentableHour(props.start_time)}</div>
            <div><strong>Heure de fin : </strong>{Day.presentableHour(props.end_time)}</div>
            <div><strong>{(props.asso) ? "Associations" : "Profs"} : </strong>{RandomUtils.Join(props.teacher)}</div>
            <Description asso={props.asso} desc={props.desc}/>
            <br/>
            <FollowLink asso={props.asso} link={props.link}/>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={handleClose}>
              Fermer
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
} 

export default SingleEvent;