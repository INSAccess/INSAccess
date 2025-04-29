import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import './Pages/Settings.scss'

const DropDownSelect = ({ id, title, items, fonction }) => {
    return (
        <div className="select">
            <DropdownButton 
                id={id} 
                title={title} 
                onSelect={(eventKey) => fonction(eventKey)} 
                className="btn-custom">
                {items}
            </DropdownButton>
        </div>
    )
}

const DropDownCustom = ({items, current, id, title, handle}) => {
    let button_list = [];
    for (let i = 0; i < items.length; i++){
        button_list.push(
            <Dropdown.Item 
                key={i} 
                eventKey={items[i]} 
                as="button" 
                href=""
                active={current == items[i]}>
                {items[i]}
            </Dropdown.Item>
        );
    }

    return (
        <DropDownSelect 
        id={id} 
        title={title + current} 
        items={button_list} 
        fonction={handle}
        />
    )
}

export default DropDownCustom