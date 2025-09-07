import EventUtils from "../../utils/EventUtils";
import RandomUtils from "../../utils/RandomUtils";
import Day from "../../utils/Day";
import SingleEvent from "./SingleEvent"
import { baseEventWidth, minWidth } from "../../utils/Constants";
import './EventsInDay.scss'
import { useTranslation } from 'react-i18next';

/**
 * React component that displays all the event of a given day
 * @component
 * @returns {JSX.Element} 
 */
const EventsInDay = ({date, data, dataOrigin}) => {
  
  const { t } = useTranslation();

  const dayList = [t('Sunday'), t('Monday'), t('Tuesday'), t('Wednesday'), t('Thursday'), t('Friday'), t('Saturday'),];
  const monthList = [t('January'), t('February'), t('March'), t('April'), t('May'), t('June'), t('July'), t('August'), t('September'), t('October'), t('November'), t('December')];

  const eventsList = [];
  const placed = [];
  let dimensions = RandomUtils.useWindowDimensions();
  
  let i = 0;
  let day = new Day(date);
  const infos = day.getDateInfo(dayList, monthList);
  const eventsOfDay = EventUtils.getEventsOfDay(date, data["events"]).sort((a, b) => (parseInt(a.end_hour)-parseInt(a.start_hour)) - (parseInt(b.end_hour)-parseInt(b.start_hour)));

  for (let element of eventsOfDay){
    const nbOverlapTotal = EventUtils.getOverlappingEvents(element, eventsOfDay);
    const nbOverlapPlaced = EventUtils.getOverlappingEvents(element, placed);

    const width = baseEventWidth/nbOverlapTotal
    const left = baseEventWidth*(1-(nbOverlapPlaced+1)/nbOverlapTotal)

    eventsList.push(
      <SingleEvent key={i} startTime={element.start_hour} endTime={element.end_hour} 
      label={element.desc} teacher={element.link_teacher} room={element.link_room} link={element.link} 
      width={width} left={left} colors={data["colors"]}
      desc={element.info} dataOrigin={dataOrigin} uid={element.uid}/>
    );

    placed.push(element)
    i += 1;
  } 

  // Doesn't display the end of the week if empty
  if (eventsList.length == 0 && (day.getNumberDayOfWeek() == 6 || day.getNumberDayOfWeek() == 7) && minWidth < dimensions.width){
    return <></>
  }
  return (
    <div className="day">
      <div className="date">
        <p className="date-day">{infos[0]}</p>
        <p className="date-num">{infos[1]}</p> 
        <p className="date-month">{infos[2]}</p> 
      </div>
      <div className="events">
        {eventsList}
      </div>
    </div>
  );
}

export default EventsInDay;