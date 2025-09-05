import { NavLink } from 'react-router-dom';
import Day from '../../utils/Day';
import EventUtils from '../../utils/EventUtils';
import RandomUtils from '../../utils/RandomUtils'
import { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import './SingleEvent.scss';
import { API_URL } from '../../utils/Constants.jsx'
import { CompactPicker } from 'react-color';
import { useData } from '../../contexts/DataContext.jsx'
import Alert from '@mui/material/Alert';
import { useTranslation } from 'react-i18next';

/**
 * React component that only returns a button redirecting to a link if this is an association
 * @component
 * @returns {JSX.Element}
 */
const FollowLink = ({asso, link}) => {

  const { t, i18n } = useTranslation();

  if (asso) {
    return (
      <NavLink to={link} target="_blank" rel="noopener noreferrer">
        <Button>
          {t('More')}
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

  const { t, i18n } = useTranslation();

  if (asso){
    return <div><strong>{t('Description')}</strong><br/>{desc}</div>
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
 *  <SingleEvent key={i} startTime={element.start_hour} endTime={element.end_hour}
 *  label={element.desc} teacher={element.link_teacher} room={element.link_room} link={element.link}
 *  width={width} left={left}
 *  desc={''} asso={asso}/>
 *)
 */
const SingleEvent = (props) => {

    const { t } = useTranslation();

    const hoursEvents = Day.createHours();
    let startIndex = hoursEvents.indexOf(props.startTime);
    let endIndex = hoursEvents.indexOf(props.endTime);
    let eventHeight = EventUtils.getEventHeight(startIndex, endIndex, hoursEvents.length);
    let eventPosY = EventUtils.getEventPos(startIndex, hoursEvents.length);

    const [show, setShow] = useState(false);
    const [color, setColor] = useState(props.colors[props.label]);
    const [errorFlag, raiseErrorFlag] = useState(false);
    const [statusMessage, setStatusMessage] = useState("")

    const BUNDLE = useData()



    useEffect(() => {
      if (props.asso){//put the custom color of the users
        setColor(props.colors[props.teacher[0]]);//Take the color of the first association of the event
      }
      setColor(props.colors[props.label] || '#d44d44');
    }, [props.colors, props.label, props.startTime, props.endTime, props.teacher, props.room]);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleSetColor = (color) => {
      setColor(color["hex"])
    }

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
        <button type="button" className="event" style={{height: `${eventHeight}%`, width: `${props.width}%`, top: `${eventPosY}%`, left: `${props.left}%`, backgroundColor: color}} onClick={handleShow}>
          <p className="title">{(props.label) ? props.label : ""}</p>
          <p className="room">{(props.room.length > 0) ? RandomUtils.Join(props.room) : ""}</p>
        </button>

        <Modal show={show} onHide={handleClose}>
          <Modal.Header >
            <Modal.Title>{props.label}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div><strong>{t('StartHour')}</strong>{Day.presentableHour(props.startTime)}</div>
            <div><strong>{t('EndHour')}</strong>{Day.presentableHour(props.endTime)}</div>
            <div><strong>{(props.asso) ? t("Associations") : t("Teachers")} : </strong>{RandomUtils.Join(props.teacher)}</div>
             {!props.asso && (
              <>
                <div id="event-color-picker">
                  <CompactPicker color={color} onChangeComplete={handleSetColor}/>
                </div>
                <Button onClick={saveColor}>{t('Save')}</Button>
              </>
              )}
            <Description asso={props.asso} desc={props.desc}/>
            <br/>
            <FollowLink asso={props.asso} link={props.link}/>
          </Modal.Body>
          <Modal.Footer>
            {errorFlag && <Alert severity="error" onClose={() => {raiseErrorFlag(false)}}>{statusMessage}</Alert>}
            <Button variant="primary" onClick={handleClose}>
              {t('Close')}
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
}

export default SingleEvent;