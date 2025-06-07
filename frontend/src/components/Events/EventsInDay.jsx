import EventUtils from "../../utils/EventUtils";
import RandomUtils from "../../utils/RandomUtils";
import Day from "../../utils/Day";
import SingleEvent from "./SingleEvent"
import { baseEventWidth, minWidth } from "../../utils/Constants";
import './EventsInDay.scss'

/**
 * React component that displays all the event of a given day
 * @component
 * @returns {JSX.Element} 
 */
const EventsInDay = ({date, data, asso}) => {
    const events_list = [];
    const placed = [];
    let dimensions = RandomUtils.useWindowDimensions();
    
    let i = 0;
    let day = new Day(date);
    const infos = day.getDateInfo();
    const events_of_day = EventUtils.getEventsOfDay(date, data["events"]);
  
    for (let element of events_of_day){
      const nb_overlap_total = EventUtils.getOverlappingEvents(element, events_of_day);
      const nb_overlap_placed = EventUtils.getOverlappingEvents(element, placed);

      const width = baseEventWidth/nb_overlap_total
      const left = baseEventWidth*(1-(nb_overlap_placed+1)/nb_overlap_total)

      events_list.push(
        <SingleEvent key={i} start_time={element.start_hour} end_time={element.end_hour} 
        label={element.desc} teacher={element.link_teacher} room={element.link_room} link={element.link} 
        width={width} left={left} colors = {data["colors"]}
        desc={element.info} asso={asso}/>
      );

      placed.push(element)
      i += 1;
    } 
  
    // Doesn't display the end of the week if empty
    if (events_list.length == 0 && (day.getNumberDayOfWeek() == 6 || day.getNumberDayOfWeek() == 7) && minWidth < dimensions.width){
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
          {events_list}
        </div>
      </div>
    );
}

export default EventsInDay;