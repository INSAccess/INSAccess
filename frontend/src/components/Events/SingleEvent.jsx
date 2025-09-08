import { NavLink } from 'react-router-dom';
import Day from '../../utils/Day';
import EventUtils from '../../utils/EventUtils';
import RandomUtils, { parseJsonSafe } from '../../utils/RandomUtils';
import { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import './SingleEvent.scss';
import { API_URL } from '../../utils/Constants.jsx';
import { CompactPicker } from 'react-color';
import { useData } from '../../contexts/DataContext.jsx';
import Alert from '@mui/material/Alert';
import { useTranslation } from 'react-i18next';

/**
 * React component that only returns a button redirecting to a link if this is an association
 * @component
 * @returns {JSX.Element}
 */
const FollowLink = ({ asso, link }) => {
  const { t } = useTranslation();

  if (asso) {
    return (
      <NavLink to={link} target="_blank" rel="noopener noreferrer">
        <Button>{t('More')}</Button>
      </NavLink>
    );
  } else {
    return <></>;
  }
};

/**
 * React component that only returns a description if this is an association
 * @component
 * @returns {JSX.Element}
 */
const Description = ({ asso, desc }) => {
  const { t } = useTranslation();

  if (asso) {
    return (
      <div>
        <strong>{t('Description')}</strong>
        <br />
        {desc}
      </div>
    );
  } else {
    return <></>;
  }
};

/**
 * React component that only returns a delete button if this is an event of the connected association
 * @component
 * @returns {JSX.Element}
 */
const DeleteButton = ({
  handleClose,
  eventUID,
  asso,
  teacher,
  assoName,
  setStatusMessage,
  setSuccessMessage,
  raiseErrorFlag,
  raiseSuccessFlag,
}) => {
  const { t } = useTranslation();

  const handleDeleteEvent = async () => {
    try {
      const response = await fetch(API_URL + '/api/events/' + eventUID, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': RandomUtils.getCSRFToken(),
        },
        mode: 'cors',
        credentials: 'include',
      });
      const data = await parseJsonSafe(response);

      if (!response.ok) {
        setStatusMessage(t('DeleteError') + ' : ' + data.error);
        raiseErrorFlag(true);
        handleClose();
      } else {
        setSuccessMessage(t('DeleteSuccess'));
        raiseSuccessFlag(true);
        handleCLose();
      }
    } catch (error) {
      console.error(error);
    }
  };

  if (asso && teacher == assoName) {
    return (
      <div style={{ marginTop: '2%' }}>
        <button className="btn btn-primary" onClick={handleDeleteEvent}>
          {t('Delete')}
        </button>
      </div>
    );
  } else {
    return <></>;
  }
};

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

  const BUNDLE = useData();
  const { assoName } = useData();

  let colors = [];
  let setColorsList = () => {};

  if (props.dataOrigin == 'asso') {
    colors = BUNDLE.colorsAsso;
    setColorsList = BUNDLE.setColorsAsso;
  } else if (props.dataOrigin == 'user') {
    colors = BUNDLE.colorsAgenda;
    setColorsList = BUNDLE.setColorsAgenda;
  } else {
    colors = BUNDLE.colorsFriend;
    setColorsList = BUNDLE.setColorsFriend;
  }

  const hoursEvents = Day.createHours();
  let startIndex =
    parseInt(props.startTime) >= parseInt(hoursEvents[0])
      ? hoursEvents.indexOf(props.startTime)
      : 0;
  let endIndex =
    parseInt(props.endTime) <= parseInt(hoursEvents[hoursEvents.length - 1])
      ? hoursEvents.indexOf(props.endTime)
      : hoursEvents.length - 1;

  // Funky cases
  if (startIndex == 0 && endIndex == 0){
    endIndex = 1;
  }
  if (startIndex == hoursEvents.length - 1 && endIndex == hoursEvents.length - 1){
    startIndex = hoursEvents.length - 22;
  }

  let eventHeight = EventUtils.getEventHeight(
    startIndex,
    endIndex,
    hoursEvents.length
  );
  let eventPosY = EventUtils.getEventPos(startIndex, hoursEvents.length);

  const [show, setShow] = useState(false);
  const [color, setColor] = useState(colors[props.label]);
  const [errorFlag, raiseErrorFlag] = useState(false);
  const [successFlag, raiseSuccessFlag] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (props.dataOrigin == 'asso') {
      //put the custom color of the users
      setColor(colors[props.teacher[0]]); //Take the color of the first association of the event
    } else {
      setColor(colors[props.label] || '#d44d44');
    }
  }, [
    colors,
    props.label,
    props.startTime,
    props.endTime,
    props.teacher,
    props.room,
  ]);

  function handleColorChange(colorObject) {
    const newColors = { ...colors };
    newColors[props.label] = colorObject['hex'];

    setColorsList(newColors);
  }

  async function saveColor(colorObject) {
    const response = await fetch(API_URL + '/api/user/color', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': RandomUtils.getCSRFToken(),
      },
      mode: 'cors',
      credentials: 'include',
      body: JSON.stringify({ color: colorObject['hex'], title: props.label }),
    });

    if (!response.ok) {
      setStatusMessage(`${t('SaveError')} : ${response.statusText}`);
      raiseErrorFlag(true);
    } else {
      handleColorChange(colorObject);
      handleClose();
    }
  }

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <button
        type="button"
        className="event"
        style={{
          height: `${eventHeight}%`,
          width: `${props.width}%`,
          top: `${eventPosY}%`,
          left: `${props.left}%`,
          backgroundColor: color,
        }}
        onClick={handleShow}
      >
        <p className="title">{props.label ? props.label : ''}</p>
        <p className="room">
          {props.room.length > 0 ? RandomUtils.Join(props.room) : ''}
        </p>
      </button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header>
          <Modal.Title>{props.label}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <strong>{t('StartHour')}</strong>
            {Day.presentableHour(props.startTime)}
          </div>
          <div>
            <strong>{t('EndHour')}</strong>
            {Day.presentableHour(props.endTime)}
          </div>
          {props.teacher.length > 0 && <div>
            <strong>
              {props.dataOrigin == 'asso' ? t('Associations') : t('Teachers')} :{' '}
            </strong>
            {RandomUtils.Join(props.teacher)}
          </div>}
          {props.dataOrigin == 'user' && (
            <div id="event-color-picker">
              <CompactPicker color={color} onChangeComplete={saveColor} />
            </div>
          )}
          <Description asso={props.dataOrigin == 'asso'} desc={props.desc} />
          <br />
          <FollowLink asso={props.dataOrigin == 'asso'} link={props.link} />
          <br />
          <DeleteButton
            handleClose={handleClose}
            eventUID={props.uid}
            asso={props.dataOrigin == 'asso'}
            teacher={props.teacher[0]}
            assoName={assoName}
            raiseSuccessFlag={raiseSuccessFlag}
            setSuccessMessage={setSuccessMessage}
            raiseErrorFlag={raiseErrorFlag}
            setStatusMessage={setStatusMessage}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleClose}>
            {t('Close')}
          </Button>
        </Modal.Footer>
      </Modal>

      {errorFlag && (
        <Alert
          severity="error"
          onClose={() => {
            raiseErrorFlag(false);
          }}
        >
          {statusMessage}
        </Alert>
      )}
      {successFlag && (
        <Alert
          severity="success"
          onClose={() => {
            raiseSuccessFlag(false);
          }}
        >
          {successMessage}
        </Alert>
      )}
    </>
  );
};

export default SingleEvent;
