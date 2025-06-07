import { NavLink } from 'react-router-dom';
import Day from '../../utils/Day';
import EventUtils from '../../utils/EventUtils';
import RandomUtils from '../../utils/RandomUtils'
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import './SingleEvent.scss';
import { API_URL } from '../../utils/Constants.jsx'
import { HexColorPicker } from "react-colorful";
import { useData } from '../../contexts/DataContext.jsx'
import Alert from '@mui/material/Alert';

/**
 * React component that only returns a button redirecting to a link if this is an association
 * @component
 * @returns {JSX.Element}
 */
const FollowLink = ({asso, link}) => {
  if (asso) {
    return (
      <NavLink to={link} target="_blank" rel="noopener noreferrer">
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
 * @returns {JSX.Element}
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
 * @returns {JSX.Element}
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
 *  label={element.desc} teacher={element.link_teacher} room={element.link_room} link={element.link} 
 *  width={width} left={left}
 *  desc={''} asso={asso}/>
 *)
 */
const SingleEvent = (props) => {
    const hours_events = Day.createHours();
    let start_index = hours_events.indexOf(props.start_time);
    let end_index = hours_events.indexOf(props.end_time);
    let eventHeight = EventUtils.getEventHeight(start_index, end_index, hours_events.length);
    let eventPosY = EventUtils.getEventPos(start_index, hours_events.length);
  
    var eventStyle = {
      height: `${eventHeight}%`,
      width: `${props.width}%`,
      top: `${eventPosY}%`,
      display:"block",
      position:"absolute",
      left: `${props.left}%`, 
      justifyContent:"left",
      userSelect: "none",
      marginLeft:"3.5%",
      marginRight:"3.5%",
    };

    if (props.asso){//put the custom color of the users
      eventStyle["backgroundColor"] = props.colors[props.teacher[0]];//Take the color of the first association of the event
    }
    else if ((props.label in props.colors)){
      eventStyle["backgroundColor"] = props.colors[props.label];
    }

    const [show, setShow] = useState(false);
    const [color, setColor] = useState("#aabbcc");
    const [errorFlag, raiseErrorFlag] = useState(false);
    const [statusMessage, setStatusMessage] = useState("")

    const BUNDLE = useData()

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    async function saveColor(){
      const response = await fetch(API_URL+"/api/post_user_color", {
          method:'POST',
          headers:{'Content-Type':'application/json', 'X-CSRFToken':RandomUtils.getCSRFToken()},
          mode:'cors',
          credentials:'include',
          body:JSON.stringify({"color" : color, "title" : props.label})
      });

      if (!response.ok){
        setStatusMessage(`Echec de la sauvegarde : ${response.status} ${response.statusText}`)
        raiseErrorFlag(true)
      } else {
        BUNDLE.forceUpdate()
        handleClose()
      }
  }
  
    return (
      <>
        <button type="button" className="event" style={eventStyle} onClick={handleShow}>
          <p className="title">{(props.label) ? props.label : ""}</p>
          <p className="room">{(props.room.length > 0) ? RandomUtils.Join(props.room) : ""}</p>
        </button>

        <Modal show={show} onHide={handleClose}>
          <Modal.Header >
            <Modal.Title>{props.label}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div><strong>Heure de début : </strong>{Day.presentableHour(props.start_time)}</div>
            <div><strong>Heure de fin : </strong>{Day.presentableHour(props.end_time)}</div>
            <div><strong>{(props.asso) ? "Associations" : "Profs"} : </strong>{RandomUtils.Join(props.teacher)}</div>
             {!props.asso && (
              <>
                <div id="event-color-picker">
                  <strong>Couleur : </strong>
                  <HexColorPicker color={color} onChange={setColor}/>
                </div>
                <Button onClick={saveColor}>Sauvegarder</Button>
              </>
              )}
            <Description asso={props.asso} desc={props.desc}/>
            <br/>
            <FollowLink asso={props.asso} link={props.link}/>
          </Modal.Body>
          <Modal.Footer>
            {errorFlag && <Alert severity="error" onClose={() => {raiseErrorFlag(false)}}>{statusMessage}</Alert>}
            <Button variant="primary" onClick={handleClose}>
              Fermer
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
} 

export default SingleEvent;