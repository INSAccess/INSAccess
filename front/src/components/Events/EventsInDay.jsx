import EventUtils from "../../js/EventUtils";
import Day from "../../js/Day";

const EventsInDay = ({date, data}) => {
    const events_list = [];
    
    let i = 0;
    const events_of_day = EventUtils.getEventsOfDay(date, data);
    let day = new Day(date);
    const infos = day.getDateInfo();
    const placed = []
  
    for (let element of events_of_day){
      const nb_overlap_total = EventUtils.getOverlappingEvents(element, events_of_day);
      const nb_overlap_placed = EventUtils.getOverlappingEvents(element, placed);
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

export default EventsInDay;