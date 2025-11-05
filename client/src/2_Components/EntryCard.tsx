import { Rating } from '@mui/material';
import { FiXCircle } from 'react-icons/fi';
import { TbEditCircle } from "react-icons/tb";
import { useState } from 'react';

type EntryCardProps = {
  hobbyName: string;
  hoursSpent: number;
  rating: number;
  notes: string;
  handleDelete: () => void;
}

export function EntryCard({ hobbyName, hoursSpent, rating, notes, handleDelete }: EntryCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  function expandEntryCard() {
    if (isExpanded) setIsExpanded(false)
    if (!isExpanded) setIsExpanded(true)
  }

  return (
    <div className='calendar input-wrapper entrycard' onClick={expandEntryCard}>
      <div className='calendar form-wrapper row-100'>
        <div
          className='calendar form' >
          <div>
            <p>{hobbyName}</p>
          </div>
          {isExpanded && (<div className='calendar entries row-100'>
            <div className='calendar row-100'>
              <div className='calendar row-50'>
                <p>Hours Spent</p>
              </div>
              <div className='calendar row-50 hoursSpent'>
                <p>{hoursSpent}</p>
              </div>
            </div>
            <div className='calendar row-100'>
              <div className='calendar row-50'>
                <p>Progress</p>
              </div>
              <div className='calendar row-50 star-rating'>
                <Rating defaultValue={rating} disabled={true} name='rating' />
              </div>
            </div>
            <div className='calendar entries row-100'>
              <div className='calendar row-100'>
                <p>Notes</p>
              </div>
              <div className='calendar row-100'>
                <p>{notes}</p>
              </div>
            </div>
            <div className='calendar row-100'>
              <button className='calendar entry-plus'>
                <TbEditCircle size={25} style={{ color: '#17456c' }} />
              </button>
              <button className='calendar entry-plus'>
                <FiXCircle size={25} style={{ color: '#17456c' }} onClick={handleDelete} />
              </button>
            </div>
          </div>)}
        </div>
      </div>
    </div >
  )

}
