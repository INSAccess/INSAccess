import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import './Pages/Settings.scss';

const DropDownSelect = ({ id, title, items, fonction }) => {
  return (
    <div className="select">
      <DropdownButton
        id={id}
        title={title}
        onSelect={(eventKey) => fonction(eventKey)}
        className="btn-custom"
      >
        {items}
      </DropdownButton>
    </div>
  );
};

/**
 * Custom Dropdown component
 * The item props should be a list of objects with the fields {items, current, id, title, handle} with handle being the function called when the user select any choice
 * @component
 * @returns {JSX.Element}
 */
const DropDownCustom = ({ items, current, id, title, handle }) => {
  let buttonList = [];
  for (let i = 0; i < items.length; i++) {
    buttonList.push(
      <Dropdown.Item
        key={i}
        eventKey={items[i]}
        as="button"
        href=""
        active={current == items[i]}
      >
        {items[i]}
      </Dropdown.Item>
    );
  }

  return (
    <DropDownSelect
      id={id}
      title={title + current}
      items={buttonList}
      fonction={handle}
    />
  );
};

export default DropDownCustom;
