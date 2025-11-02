import { useState } from 'react';

import { Rating } from '@mui/material';
import { FiXCircle } from 'react-icons/fi';
import { TbEditCircle } from "react-icons/tb";


type EntryCardProps = {
  hobbyName: string;
  hoursSpent: number;
  rating: number;
  notes: string;
}

export function EntryCard({ hobbyName, hoursSpent, rating, notes }: EntryCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (

    <div className='calendar input-wrapper entrycard'>
      <div className='calendar form-wrapper row-100'>
        <div
          className='calendar form' >
          <div>
            <p>{hobbyName}</p>
          </div>
          <div className='calendar entries row-100'>
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
          </div>
          <div className='calendar row-100'>
            <button className='calendar entry-plus'>
              <TbEditCircle size={25} style={{ color: '#17456c' }} />
            </button>
            <button className='calendar entry-plus'>
              <FiXCircle size={25} style={{ color: '#17456c' }} />
            </button>
          </div>
        </div>

      </div>
    </div >

  )

}
