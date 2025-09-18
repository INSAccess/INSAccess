import { baseEventWidth, minWidth } from '../../utils/Constants';
import { CustomDatePicker } from '../DatePicker.jsx';
import { useTranslation } from 'react-i18next';
import EventUtils from '../../utils/EventUtils';
import RandomUtils from '../../utils/RandomUtils';
import Day from '../../utils/Day';
import SingleEvent from './SingleEvent';
import './EventsInDay.scss';

/**
 * React component that displays all the event of a given day
 * @component
 * @returns {JSX.Element}
 */
const EventsInDay = ({ date, data, dataOrigin }) => {
  const eventsList = [];
  const placed = [];
  let dimensions = RandomUtils.useWindowDimensions();
  const { t } = useTranslation();
  const monthList = [
    t('date.months.january'),
    t('date.months.february'),
    t('date.months.march'),
    t('date.months.april'),
    t('date.months.may'),
    t('date.months.june'),
    t('date.months.july'),
    t('date.months.august'),
    t('date.months.september'),
    t('date.months.october'),
    t('date.months.november'),
    t('date.months.december'),
  ];
  const dayList = [
    t('date.days.sunday'),
    t('date.days.monday'),
    t('date.days.tuesday'),
    t('date.days.wednesday'),
    t('date.days.thursday'),
    t('date.days.friday'),
    t('date.days.saturday'),
  ];
  let i = 0;
  let day = new Day(date);
  const infos = day.getDateInfo(dayList, monthList);
  const eventsOfDay = EventUtils.getEventsOfDay(date, data).sort(
    (a, b) =>
      parseInt(a.end_hour) -
      parseInt(a.start_hour) -
      (parseInt(b.end_hour) - parseInt(b.start_hour))
  );

  for (let element of eventsOfDay) {
    const nbOverlapTotal = EventUtils.getOverlappingEvents(
      element,
      eventsOfDay
    );
    const nbOverlapPlaced = EventUtils.getOverlappingEvents(element, placed);

    const width = baseEventWidth / nbOverlapTotal;
    const left = baseEventWidth * (1 - (nbOverlapPlaced + 1) / nbOverlapTotal);

    eventsList.push(
      <SingleEvent
        key={i}
        startTime={element.start_hour}
        endTime={element.end_hour}
        label={element.desc}
        teacher={element.link_teacher}
        room={element.link_room}
        link={element.link}
        width={width}
        left={left}
        desc={element.info}
        dataOrigin={dataOrigin}
        uid={element.uid}
      />
    );

    placed.push(element);
    i += 1;
  }

  // Doesn't display the end of the week if empty
  if (
    eventsList.length == 0 &&
    (day.getNumberDayOfWeek() == 6 || day.getNumberDayOfWeek() == 0) &&
    minWidth < dimensions.width
  ) {
    return <></>;
  }
  return (
    <div className="day">
      <div className="date">
        <div className="date-content">
          {minWidth >= dimensions.width && (
            <div className="mobile-datepicker" aria-label="date picker">
              <CustomDatePicker isMobile={true} />
            </div>
          )}
          <p className="date-day">{infos[0]}</p>
          <p className="date-num">{infos[1]}</p>
          <p className="date-month">{infos[2]}</p>
        </div>
      </div>
      <div className="events">{eventsList}</div>
    </div>
  );
};

export default EventsInDay;