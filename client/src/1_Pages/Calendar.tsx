import { DateCalendar } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

import { useState } from 'react';
import { PickerValue } from '@mui/x-date-pickers/internals';

import { HobbyChip } from '../2_Components/HobbyChip';

export function Calendar() {
  const [date, setDate] = useState<PickerValue>();
  const [value] = useState<PickerValue>();

  const formattedDate = dayjs(date).format('MMMM DD, YYYY');

  // function datePicker() {
  //   setDate(value)
  //   setValue(value)
  // }

  return (
    <div className="content-page calendar">
      <div className="calendar row-100 calendar-wrapper">
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateCalendar value={value} onChange={(value) => setDate(value)} />
        </LocalizationProvider>
        <div className="calendar row-100 date-wrapper">
          <h1>{formattedDate}</h1>
        </div>
      </div>
      <div className="calendar row-100 text-wrapper">
        <h1>Here's what you've done this week!</h1>
        <div>
          <HobbyChip
            label={'Hockey'}
            handleClick={() => console.log('clicked!')}
            index={3}
          />
        </div>
      </div>
    </div>
  );
}
