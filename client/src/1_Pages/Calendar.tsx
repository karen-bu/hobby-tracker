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
dayjs.tz.guess()


import { FaAngleLeft } from 'react-icons/fa';
import { FaAngleRight } from 'react-icons/fa';

import { EntryForm } from '../2_Components/EntryForm';
import { EntryCard } from '../2_Components/EntryCard';
import { useUser } from '../2_Components/useUser';
import { Entry, getEntryByDate, deleteEntry } from '../lib';

export function Calendar() {
  const { user } = useUser();
  const navigate = useNavigate();
  const [entryArray, setEntryArray] = useState<Entry[]>([])


  useEffect(() => {
    if (!user) {
      navigate('/sign-in');
    }
  }, [user]);

  const [date, setDate] = useState<PickerValue>(dayjs());
  const formattedDate = dayjs(date).format('MMMM DD, YYYY');

  async function handleDeleteEntry(entry: Entry) {
    try {
      const deletedHobbyIndex = entryArray.findIndex(
        (obj) => obj.entryId === entry.hobbyId
      );
      const newEntryArray = [...entryArray];
      entryArray.splice(deletedHobbyIndex, 1);
      setEntryArray(entryArray);
      deleteEntry(entry.entryId);
    } catch (err) {
      console.error(err);
      alert(`Error deleting hobby ${entry.entryId}`);
    }
  }


  const entries = entryArray.map((entry: Entry) =>
    <div key={entry.entryId} >
      <EntryCard
        hobbyName={entry.hobbyName} hoursSpent={entry.hoursSpent} rating={entry.rating}
        notes={entry.notes} handleDelete={() => handleDeleteEntry(entry)} />
    </div>
  )

  useEffect(() => {
    // console.log('Selected date:', date?.toISOString());
    if (!date) return;
    let mounted = true;
    (async () => {
      try {
        // console.log('Fetching entries for date:', date.toISOString());
        const entryArray = await getEntryByDate(date);
        // console.log('Fetched entries:', entryArray);
        if (mounted) setEntryArray(entryArray);
      } catch (error) {
        console.error(error);
      }
    }
    )
      ();

    return () => {
      mounted = false;
    };

  }, [date, entryArray]);

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
              onClick={() => setDate(dayjs(date).subtract(1, 'day'))}
            />
            <p className="p-heading">{formattedDate}</p>
            <FaAngleRight
              size={30}
              className="calendar-arrow"
              onClick={() => setDate(dayjs(date).add(1, 'day'))}
            />
          </div>
        </div>
      </div>
      <div className='calendar entries-wrapper'>
        <div>
          <EntryForm date={date} />
        </div>
        <div>
          {entries}
        </div>
        <div>
        </div>
      </div>


    </div>
  );
}
