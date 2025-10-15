import { DateCalendar } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import { useState } from "react";

import dayjs from "dayjs";

export function Calendar() {
  const [date, setDate] = useState(dayjs())

  return (
    <div className="content-page calendar">
      <div className='calendar row-100'>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateCalendar value={dayjs()} onChange={() => setDate(date)} />
        </LocalizationProvider>
      </div>
      <div className='calendar row-100'>

      </div>
      <div className='calendar row-100 text'>
        <h1>Here's what you've done this week!</h1>
      </div>
    </div>
  );
}
