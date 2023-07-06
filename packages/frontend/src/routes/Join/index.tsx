import { FormEventHandler, useRef, useState } from 'react';
import { postJoin } from '~/api';
import './index.css';

const Join = () => {
  const [statusText, setStatusText] = useState('');
  const emailInputRef = useRef<HTMLInputElement>(null);
  const joinMutation = postJoin({
    onSuccess: (data: { email: string }) =>
      setStatusText(`User(${data.email}) has successfully joined!`),
    onError: (err: { errorMessage: string; status: number }) => setStatusText(err.errorMessage),
  });

  const onSubmit: FormEventHandler = (e) => {
    e.preventDefault();
    if (!emailInputRef.current) return;

    joinMutation.mutate({
      email: emailInputRef.current.value,
    });
  };

  return (
    <form onSubmit={onSubmit}>
      <div>
        <label htmlFor="email">E-Mail</label>
        <input id="email" type="email" ref={emailInputRef} />
      </div>
      {statusText && <div>{statusText}</div>}
      <button type="submit">Sign Up</button>
    </form>
  );
};

export default Join;
