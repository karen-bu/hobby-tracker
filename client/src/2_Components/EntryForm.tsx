import * as React from 'react';
import { useState, FormEvent } from "react";
import { useUser } from "./useUser";
import { type Entry, addEntry } from '../lib';

import dayjs from "dayjs";


import { Autocomplete } from "@mui/material";
import { TextField } from '@mui/material';
import { Rating } from '@mui/material';
import { PickerValue } from '@mui/x-date-pickers/internals';

import { FiPlusCircle } from "react-icons/fi";
import { FiXCircle } from "react-icons/fi";

type EntryFormProps = {
  date: PickerValue;
}

export function EntryForm({ date }: EntryFormProps) {
  const { hobbyArray, setHobbyArray, entryArray, setEntryArray } = useUser()
  const hobbies = hobbyArray.map((hobby) => hobby.hobbyName)
  const [isBlurred, setIsBlurred] = useState(true)
  const [value, setValue] = React.useState<string | null>(hobbies[0]);
  const [hoursValue, setHoursValue] = useState('')
  const formattedDate = dayjs(date).format('MMMM DD, YYYY');

  async function submitEntryForm(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      const foundHobby = hobbyArray.find(
        (obj) => obj.hobbyName === value
      );
      const formData = new FormData(event.currentTarget);
      const newEntry = Object.fromEntries(formData.entries()) as unknown as Entry
      if (date) newEntry.entryDate = date?.toDate()
      if (value) newEntry.hobbyName = value
      if (foundHobby) newEntry.hobbyId = foundHobby?.hobbyId
      const addedEntry = await addEntry(newEntry)
      setEntryArray([...entryArray, addedEntry])
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className='calendar input-wrapper'
      onFocus={() => setIsBlurred(false)}>
      <div className='calendar form-wrapper row-100'>

        <form
          className='calendar form' onSubmit={submitEntryForm} >
          <div>
            <p>Add new entry for {formattedDate}</p>
          </div>
          <Autocomplete
            sx={{ width: '100%' }}
            disablePortal
            options={hobbies}
            renderInput={(params) => <TextField {...params} label='Select Hobby' />}
            onFocus={() => setIsBlurred(false)}
            value={value || null}
            onChange={(event: any, newValue: string | null) => setValue(newValue)}
          />
          {isBlurred === false && (

            <div className='calendar entries row-100'>
              <div className='calendar row-100'>
                <div className='calendar row-50'>
                  <p>Hours Spent</p>
                </div>
                <div className='calendar row-50'>
                  <input className='hoursSpent' name='hoursSpent'
                    onFocus={() => setIsBlurred(false)}
                    value={hoursValue}
                    onChange={(event) => setHoursValue(event.target.value)}
                  />
                </div>
              </div>
              <div className='calendar row-100'>
                <div className='calendar row-50'>
                  <p>Progress</p>
                </div>
                <div className='calendar row-50 star-rating'
                  onFocus={() => setIsBlurred(false)}>
                  <Rating precision={1} name='rating' />
                </div>
              </div>
              <div className='calendar entries row-100'>
                <div className='calendar row-100'>
                  <p>Notes</p>
                </div>
                <div className='calendar row-100'>
                  <textarea
                    className='calendar textarea'
                    name='notes'
                    onFocus={() => setIsBlurred(false)} />
                </div>
                <div className='calendar row-100'>
                  <button className='calendar entry-plus'>
                    <FiPlusCircle size={25} style={{ color: '#17456c' }} />
                  </button>
                  <button className='calendar entry-plus' onClick={() => setIsBlurred(true)}>
                    <FiXCircle size={25} style={{ color: '#17456c' }} />
                  </button>
                </div>
              </div>
            </div>
          )
          }
        </form >
      </div>
    </div >
  )
}
