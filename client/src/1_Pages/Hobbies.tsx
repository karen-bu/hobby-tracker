import { useState, useEffect, FormEvent } from 'react';
import { useUser } from '../2_Components/useUser';
import { useNavigate } from 'react-router-dom';

import { HobbyForm } from '../2_Components/HobbyForm';
import { HobbyChip } from '../2_Components/HobbyChip';

import { fetchHobbies } from '../lib';
import { addHobby } from '../lib';
import { deleteHobby } from '../lib';
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

  async function submitHobbyForm(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      const formData = new FormData(event.currentTarget);
      const newHobby = Object.fromEntries(formData) as unknown as Hobby;
      const addedHobby = await addHobby(newHobby);
      setHobbyArray([...hobbyArray, addedHobby]);
    } catch (err) {
      console.error(err);
      alert(`Error adding hobby ${event.currentTarget.value}`);
    }
  }

  async function handleDeleteHobby(hobby: Hobby) {
    try {
      const deletedHobbyIndex = hobbyArray.findIndex(
        (obj) => obj.hobbyId === hobby.hobbyId
      );
      const newHobbyArray = [...hobbyArray];
      newHobbyArray.splice(deletedHobbyIndex, 1);
      setHobbyArray(newHobbyArray);
      deleteHobby(hobby.hobbyId);
    } catch (err) {
      console.error(err);
      alert(`Error deleting hobby ${hobby.hobbyName}`);
    }
  }

  const hobbyList = hobbyArray.map((hobby, index) => (
    <div className="hobbies chip-wrapper" key={hobby.hobbyId}>
      <HobbyChip
        label={hobby.hobbyName}
        handleClick={() => handleDeleteHobby(hobby)}
        index={index}
      />
    </div>
  ));

  return (
    <div className="content-page hobbies">
      <div className="hobbies list-wrapper">
        <div className="hobbies input-wrapper">
          <HobbyForm handleSubmit={submitHobbyForm} />
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
