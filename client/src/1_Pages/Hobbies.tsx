import { useState, useEffect, FormEvent } from 'react';
import { useUser } from '../2_Components/useUser';
import { useNavigate } from 'react-router-dom';

import { HobbyForm } from '../2_Components/HobbyForm';
import { HobbyChip } from '../2_Components/HobbyChip';

import { fetchHobbies } from '../lib';
import { Hobby } from '../lib';

export function Hobbies() {
  const { user } = useUser();
  const navigate = useNavigate();

  const [hobbyArray, setHobbyArray] = useState<Hobby[]>([]);

  useEffect(() => {
    async function loadHobbies() {
      try {
        const hobbyArray = await fetchHobbies();
        setHobbyArray(hobbyArray);
      } catch (err) {
        alert(`Error fetching hobbies: ${err}`);
      }
    }

    if (user) {
      loadHobbies();
    } else {
      navigate('/sign-in');
    }
  }, [user, navigate]);

  const hobbyList = hobbyArray.map((hobby, index) => (
    <div className="hobbies chip-wrapper">
      <HobbyChip
        label={hobby.hobbyName}
        handleClick={() => console.log('clicked')}
        index={index}
      />
    </div>
  ));

  function testSubmit(event: FormEvent<HTMLFormElement>): void {
    event?.preventDefault();
    console.log('submitted!');
  }

  return (
    <div className="content-page hobbies">
      <div className="hobbies list-wrapper">
        <div className="hobbies input-wrapper">
          <HobbyForm handleSubmit={testSubmit} />
        </div>
        <div className="hobbies text-wrapper">
          <div className="hobbies text-wrapper">
            {!hobbyArray && (
              <p className="p-heading">
                You have no saved hobbies to track. Add some now!
              </p>
            )}
          </div>
        </div>
        {hobbyList}
      </div>
    </div>
  );
}
