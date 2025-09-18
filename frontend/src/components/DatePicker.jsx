import { useState, useRef } from 'react';
import { useData } from '../contexts/DataContext.jsx';
import DatePicker from 'react-datepicker';
import Day from '../utils/Day.jsx';
import 'react-datepicker/dist/react-datepicker.css';

export const CustomDatePicker = ({ isMobile = false }) => {
  const { day, setDay } = useData();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const buttonRef = useRef(null);

  return (
    <div className="position-relative d-inline-block">
      <button
        ref={buttonRef}
        className={`btn btn-primary ${
          isMobile ? 'btn-sm' : 'btn-lg'
        } d-flex align-items-center gap-2`}
        type="button"
        onClick={() => setShowDatePicker(!showDatePicker)}
        aria-label="Open calendar"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          fill="currentColor"
          className="bi bi-calendar3"
          viewBox="0 0 16 16"
        >
          <path d="M14 0H2a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zM1 3.857C1 3.384 1.448 3 2 3h12c.552 0 1 .384 1 .857v10.286c0 .473-.448.857-1 .857H2c-.552 0-1-.384-1-.857V3.857z" />
          <path d="M6.5 7a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm-9 3a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm-9 3a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" />
        </svg>
      </button>

      {showDatePicker && (
        <div
          className="position-absolute"
          style={{
            top: '100%',
            left: '50%',
            transform: 'translateX(-40%)',
            marginTop: '8px',
          }}
        >
          <div onClick={(e) => e.stopPropagation()} aria-label="date picker">
            <DatePicker
              selected={day ? new Date(day) : null}
              onChange={(date) => {
                setDay(new Day(date));
                setShowDatePicker(false);
              }}
              aria-label="date picker"
              inline
            />
          </div>
        </div>
      )}
    </div>
  );
};
