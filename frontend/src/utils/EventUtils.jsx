import Day from './Day.jsx'
import RandomUtils from './RandomUtils.jsx';

/**
 * Class for handling events
 */
class EventUtils {
  /**
   * Returns the height an events should have based on its start time, end time and the number of subdivisions possible
   * @param {int} startIndex the index of the start time of the event in the time array
   * @param {int} endIndex the index of the end time of the event in the time array
   * @param {int} nbDiv the number of subdivisions possible (the length of the time array)
   * @returns {float} the expected height of the event
   */
  static getEventHeight(startIndex, endIndex, nbDiv){
    return ((endIndex-startIndex)/(nbDiv+1))*100
  }

  /**
   * Returns the position of the event from the top of the div
   * @param {int} startIndex the index of the start time of the event in the time array
   * @param {int} nbDiv the number of subdivisions possible (the length of the time array)
   * @returns {float} the expected position of the event
   */
  static getEventPos(startIndex, nbDiv){
    return 100*(startIndex+1)/(nbDiv+1);
  }

  /**
   * Returns the number of events happening in the given hour
   * @param {string} hour
   * @param {Array} events 
   * @returns {int} the number of events
   */
  static getNbEventsAtHour(hour, events){
    let nbEvents = 0;
    for (let element of events){
      if (element.start_hour < hour && element.end_hour > hour){
        nbEvents++;
      }
    }
    return nbEvents;
  }
  
  /**
   * Returns the subdivisions of hours happening during an event
   * @param {struct} event
   * @returns {Array}
   */
  static getHoursOfEvent(event){
    let hours = []
    const hoursEvents = Day.createHours();
    for (let hour of hoursEvents){
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
    let maxOverlap = 0;
    let nbOverlap = 0;
    let hoursOfEvent = EventUtils.getHoursOfEvent(event)
    for (let hour of hoursOfEvent){
      nbOverlap = EventUtils.getNbEventsAtHour(hour, events)
      maxOverlap = RandomUtils.max(maxOverlap, nbOverlap)
    }
    return maxOverlap;
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