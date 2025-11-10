import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { DateCalendar } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { getEntryByDate } from '../lib';

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
import { Entry, deleteEntry } from '../lib';

export function Calendar() {
  const { user } = useUser();
  const navigate = useNavigate();

  const { entryArray, setEntryArray, date, setDate } = useUser()

  useEffect(() => {
    if (!user) {
      navigate('/sign-in');
    }
  }, [user]);

  const formattedDate = dayjs(date).format('MMMM DD, YYYY');

  async function handleDeleteEntry(entry: Entry) {
    try {
      const deletedHobbyIndex = entryArray.findIndex(
        (obj) => obj.entryId === entry.entryId
      );
      deleteEntry(entry.entryId);
      entryArray.splice(deletedHobbyIndex, 1);
      setEntryArray([...entryArray])
    } catch (err) {
      console.error(err);
      alert(`Error deleting hobby ${entry.entryId}`);
    }
  }

  const entries = entryArray.map((entry: Entry) =>
    <div key={entry.entryId} >
      <EntryCard
        hobbyName={entry.hobbyName} hoursSpent={entry.hoursSpent} rating={entry.rating}
        notes={entry.notes} entryId={entry.entryId} handleDelete={() => handleDeleteEntry(entry)} />
    </div>
  )

  useEffect(() => {
    if (!date) return;
    let mounted = true;
    (async () => {
      try {
        const entryArray = await getEntryByDate(date);
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
  }, [date]);

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

        {entries}

        <div>
        </div>
      </div>


    </div>
  );
}
