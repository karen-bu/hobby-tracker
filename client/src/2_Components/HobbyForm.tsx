import { FormEvent } from 'react';
import { useState } from 'react';
import { FiPlusCircle } from 'react-icons/fi';

type HobbyFormProps = {
  handleSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

export function HobbyForm({ handleSubmit }: HobbyFormProps) {
  const [content, setContent] = useState('');

  return (
    <form onSubmit={handleSubmit} className="hobbies input-wrapper">
      <input
        className="hobbies input"
        name="add-new-hobby"
        type="text"
        placeholder="Add New Hobby"
        value={content}
        onChange={(event) => setContent(event.target.value)}
      />
      {content !== '' && (
        <button className="hobbies input-plus">
          <FiPlusCircle size={25} style={{ color: '#196A95' }} />
        </button>
      )}
    </form>
  );
}
