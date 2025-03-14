import Day from './Day.jsx'
import RandomUtils from './RandomUtils.jsx';

class EventUtils {
  static getEventHeight(start_index, end_index, nb_div){
    return ((end_index-start_index)/(nb_div+1))*100
  }

  static getEventPos(start_index, nb_div){
    return 100*(start_index+1)/(nb_div+1);
  }

  static getNbEventsAtHour(hour, events){
    let nb_events = 0;
    for (let element of events){
      if (element.start < hour && element.end > hour){
        nb_events++;
      }
    }
    return nb_events;
  }
  
  static getHoursOfEvent(event){
    let hours = []
    const hours_events = Day.createHours();
    for (let hour of hours_events){
      if (hour >= event.start && hour <= event.end){
        hours.push(hour);
      }
    }
    return hours;
  }
  
  static getOverlappingEvents(event, events){
  
    let max_overlap = 0;
    let nb_overlap = 0;
    let hours_of_event = EventUtils.getHoursOfEvent(event)
    for (let hour of hours_of_event){
      nb_overlap = EventUtils.getNbEventsAtHour(hour, events)
      max_overlap = RandomUtils.max(max_overlap, nb_overlap)
    }
    return max_overlap;
  }
  
  static getEventsOfDay(date, data){
    const events = []
    data.forEach(ev => {
      if (ev.date === date) {
        events.push(ev)
      }
    })
      return events;
  }
}

export default EventUtils;