import { Rating } from '@mui/material';
import { FiXCircle } from 'react-icons/fi';
import { FiCheckCircle } from "react-icons/fi";
import { TbEditCircle } from "react-icons/tb";
import { TbTrash } from "react-icons/tb";

import { useState, FormEvent } from 'react';
import { editEntry, Entry } from '../lib';
import { useUser } from './useUser';

type EntryCardProps = {
  hobbyName: string;
  hoursSpent: number;
  rating: number;
  notes: string;
  handleDelete: () => void;
  entryId: number;
}

export function EntryCard({ hobbyName, hoursSpent, rating, notes, handleDelete, entryId }: EntryCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isDisabled, setIsDisabled] = useState(true)
  const [_editHoursSpent, setEditHoursSpent] = useState('')
  const [_editNotes, setEditNotes] = useState('')
  const { entryArray, setEntryArray, date } = useUser()

  function expandEntryCard() {
    if (!isExpanded) setIsExpanded(true)
    if (isExpanded) setIsExpanded(false)
  }

  async function submitEditForm(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    try {
      const formData = new FormData(event.currentTarget);
      const editedEntry = Object.fromEntries(formData.entries()) as unknown as Entry
      if (date) editedEntry.entryDate = date?.toDate()
      editedEntry.entryId = entryId
      const fetchedEditedEntry = await editEntry(editedEntry)
      const editedEntryIndex = entryArray.findIndex(
        (obj) => obj.entryId === editedEntry.entryId
      );
      const editedEntryArray = [...entryArray]
      editedEntryArray.splice(editedEntryIndex, 1, fetchedEditedEntry)
      setEntryArray(editedEntryArray)
      setIsDisabled(true)
    }
    catch (err) {
      console.error(err)
    }
  }


  return (
    <div className='calendar input-wrapper entrycard' >
      <form className='calendar form-wrapper row-100' onSubmit={(event) => submitEditForm(event)}>
        <div
          className='calendar form' >
          <div className='calendar text row-100' onClick={expandEntryCard} >
            <div >
              <p >{hobbyName}</p>
            </div>
          </div>
          {isExpanded && (<div className='calendar entries row-100'>
            <div className='calendar row-100'>
              <div className='calendar row-50'>
                <p>Hours Spent</p>
              </div>
              <div className='calendar row-50 hoursSpent'>
                <input className='hoursSpent' name='hoursSpent'
                  disabled={isDisabled} defaultValue={hoursSpent}
                  onChange={(e) => setEditHoursSpent(e.target.value)} />
              </div>
            </div>
            <div className='calendar row-100'>
              <div className='calendar row-50'>
                <p>Progress</p>
              </div>
              <div className='calendar row-50 star-rating'>
                <Rating defaultValue={rating} disabled={isDisabled} name='rating' />
              </div>
            </div>
            <div className='calendar entries row-100'>
              <div className='calendar row-100'>
                <p>Notes</p>
              </div>
              <div className='calendar row-100'>
                <textarea className='calendar textarea'
                  name='notes' defaultValue={notes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  disabled={isDisabled} />
              </div>
            </div>
            <div className='calendar row-100'>
              {!isDisabled &&
                (<button className='calendar entry-plus' type='submit'>
                  <FiCheckCircle size={25} style={{ color: '#17456c' }} />
                </button>)}
              {isDisabled &&
                (<button className='calendar entry-plus' type='button' onClick={() => setIsDisabled(false)}>
                  <TbEditCircle size={25} style={{ color: '#17456c' }} />
                </button>)}
              <button className='calendar entry-plus' type='button' onClick={() => setIsDisabled(true)}>
                <FiXCircle size={25} style={{ color: '#17456c' }} />
              </button>
              <button className='calendar entry-plus' type='button' onClick={handleDelete} >
                <TbTrash size={25} style={{ color: '#17456c' }} />
              </button>
            </div>
          </div>)}
        </div>
      </form>
    </div >
  )

}
