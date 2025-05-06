import Day from './Day.jsx'
import RandomUtils from './RandomUtils.jsx';

/**
 * Class for handling events
 */
class EventUtils {
  /**
   * Returns the height an events should have based on its start time, end time and the number of subdivisions possible
   * @param {int} start_index the index of the start time of the event in the time array
   * @param {int} end_index the index of the end time of the event in the time array
   * @param {int} nb_div the number of subdivisions possible (the length of the time array)
   * @returns {float} the expected height of the event
   */
  static getEventHeight(start_index, end_index, nb_div){
    return ((end_index-start_index)/(nb_div+1))*100
  }

  /**
   * Returns the position of the event from the top of the div
   * @param {int} start_index the index of the start time of the event in the time array
   * @param {int} nb_div the number of subdivisions possible (the length of the time array)
   * @returns {float} the expected position of the event
   */
  static getEventPos(start_index, nb_div){
    return 100*(start_index+1)/(nb_div+1);
  }

  /**
   * Returns the number of events happening in the given hour
   * @param {string} hour
   * @param {Array} events 
   * @returns {int} the number of events
   */
  static getNbEventsAtHour(hour, events){
    let nb_events = 0;
    for (let element of events){
      if (element.start_hour < hour && element.end_hour > hour){
        nb_events++;
      }
    }
    return nb_events;
  }
  
  /**
   * Returns the subdivisions of hours happening during an event
   * @param {struct} event
   * @returns {Array}
   */
  static getHoursOfEvent(event){
    let hours = []
    const hours_events = Day.createHours();
    for (let hour of hours_events){
      if (hour >= event.start_hour && hour <= event.end_hour){
        hours.push(hour);
      }
    }
    return hours;
  }
  
  /**
   * Returns the maximum of overlap for an event
   * @param {struct} event 
   * @param {Array} events 
   * @returns {int}
   */
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
  
  /**
   * Returns a list of all events of a given day
   * @param {string} date 
   * @param {json} data 
   * @returns {Array}
   */
  static getEventsOfDay(date, data){
    const events = []
    if (data) {
      data.forEach(ev => {
        if (ev.date === date) {
          events.push(ev)
        }
      })
    }
    return events;
  }
}

export default EventUtils;