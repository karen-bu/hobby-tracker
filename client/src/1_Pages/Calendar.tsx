
import { useState } from 'react';

import { DateCalendar } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { PickerValue } from '@mui/x-date-pickers/internals';
import dayjs from 'dayjs';

import { FaAngleLeft } from "react-icons/fa";
import { FaAngleRight } from "react-icons/fa";

import { EntryForm } from '../2_Components/EntryForm';





export function Calendar() {
  const [date, setDate] = useState<PickerValue>(dayjs());
  const formattedDate = dayjs(date).format('MMMM DD, YYYY');


  function getYesterday() {
    setDate(dayjs(date).subtract(1, 'day'))
  }

  function getTomorrow() {
    setDate(dayjs(date).add(1, 'day'))
  }

  return (
    <div className="content-page calendar">
      <div className="calendar calendar-wrapper">
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateCalendar value={date} onChange={(value) => setDate(value)} />
        </LocalizationProvider>
        <div className="calendar date-wrapper">
          <div className='calendar row-100'>
            <p className='p-small'>Viewing entries for</p>
          </div>
          <div className='calendar row-33'>
            <FaAngleLeft size={30} className='calendar-arrow' onClick={getYesterday} />
            <p className='p-heading'>{formattedDate}</p>
            <FaAngleRight size={30} className='calendar-arrow' onClick={getTomorrow} /></div>
        </div>
      </div>
      <div className='calendar input-wrapper'>
        <EntryForm />
        {/* <Form formPlaceholder="Add New Entry" formClassName='calendar input' formName='add-new-entry' formType='select'
            buttonClassName="calendar input-plus"
            handleSubmit={() => console.log('submitted!')} /> */}
      </div>
    </div>
  );
}
