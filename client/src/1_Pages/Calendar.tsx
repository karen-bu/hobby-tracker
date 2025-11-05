import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { DateCalendar } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { PickerValue } from '@mui/x-date-pickers/internals';

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
dayjs.extend(utc);
dayjs.extend(timezone);
// dayjs.tz.setDefault('America/Los_Angeles');
dayjs.tz.guess()


import { FaAngleLeft } from 'react-icons/fa';
import { FaAngleRight } from 'react-icons/fa';

import { EntryForm } from '../2_Components/EntryForm';
import { EntryCard } from '../2_Components/EntryCard';
import { useUser } from '../2_Components/useUser';
import { Entry, getEntryByDate } from '../lib';

export function Calendar() {
  const { user } = useUser();
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false)
  const [entryArray, setEntryArray] = useState<Entry[]>([])


  useEffect(() => {
    if (!user) {
      navigate('/sign-in');
    }
  });

  const [date, setDate] = useState<PickerValue>(dayjs());
  const formattedDate = dayjs(date).format('MMMM DD, YYYY');

  async function getYesterday() {
    setDate(dayjs(date).subtract(1, 'day'))
    try {
      const entryArray = await getEntryByDate(date)
      console.log(entryArray)
    }
    catch (error) {
      console.error()
    }
  }

  function getTomorrow() {
    setDate(dayjs(date).add(1, 'day'));
  }

  function expandEntryCard() {
    if (isExpanded) setIsExpanded(false)
    if (!isExpanded) setIsExpanded(true)
  }

  return (
    <div className="content-page calendar">
      <div className="calendar calendar-wrapper">
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateCalendar value={date} onChange={(value) => setDate(value)} />
        </LocalizationProvider>
        <div className="calendar date-wrapper">
          <div className="calendar text row-100">
            <p className="p-small">Viewing entries for</p>
          </div>
          <div className="calendar row-33">
            <FaAngleLeft
              size={30}
              className="calendar-arrow"
              onClick={getYesterday}
            />
            <p className="p-heading">{formattedDate}</p>
            <FaAngleRight
              size={30}
              className="calendar-arrow"
              onClick={getTomorrow}
            />
          </div>
        </div>
      </div>
      <div className='calendar entries-wrapper'>
        <div>
          <EntryForm date={date} />
        </div>
        <div>
          <EntryCard handleExpand={expandEntryCard} isExpanded={isExpanded}
            hobbyName={'Hockey'} hoursSpent={5} rating={3}
            notes={'Ante montes eleifend adipiscing aliquam tempus quisque vulputate commodo dignissim morbi maecenas nulla tellus mus a ullamcorper conubia a suspendisse.'} />
        </div>
      </div>


    </div>
  );
}
