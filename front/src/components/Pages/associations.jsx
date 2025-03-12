import AllEvents from '../../js/EventUtils.jsx'
import { PATH_ASSO } from '../../js/constants.jsx'

const Associations = ({start}) => {
  return (
    <AllEvents start={start} data_path={PATH_ASSO}/>
  )
}

export default Associations;