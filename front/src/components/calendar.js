import AllEvents from '../js/eventUtils.js'
import { PATH_CALENDAR } from '../js/constants.js'

const Calendar = ({start}) => {
  return (
    <AllEvents start={start} data_path={PATH_CALENDAR+start}/>
  )
}

export default Calendar;