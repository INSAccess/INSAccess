import { NavLink } from 'react-router-dom';
import Day from '../../js/Day';
import EventUtils from '../../js/EventUtils';
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

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

const Description = ({asso, desc}) => {
  if (asso){ 
    return <div><strong>Description : </strong><br/>{desc}</div> 
  } else { 
    return <></>
  }
}

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
      display:"block",
      position:"absolute",
      left: `${props.left}%`, //"0%",
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
          <p className="title">{props.label}</p>
          <p className="room">{props.room.join(', ')}</p>
        </button>

        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>{props.label}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div><strong>Heure de début : </strong>{Day.presentableHour(props.start_time)}</div>
            <div><strong>Heure de fin : </strong>{Day.presentableHour(props.end_time)}</div>
            <div><strong>{(props.asso) ? "Associations" : "Profs"} : </strong>{props.teacher}</div>
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