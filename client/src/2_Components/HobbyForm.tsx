import { FormEvent } from 'react';
import { useState } from 'react';
import { FiPlusCircle } from 'react-icons/fi';

type FormProps = {
  handleSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

export function HobbyForm({ handleSubmit }: FormProps) {
  const [content, setContent] = useState('');

  return (
    <form onSubmit={handleSubmit}>
      <input
        className='hobbies input'
        name='add-new-hobby'
        type='text'
        placeholder="Add New Hobby"
        value={content}
        onChange={(event) => setContent(event.target.value)}
      />
      {content !== '' && (
        <button className="hobbies input-plus">
          <FiPlusCircle size={25} style={{ color: '#17456C' }} />
        </button>
      )}

    </form>
  );
}
