import { RequestJoinUserDTO } from '@my-task/common';
import { FormEventHandler, useRef, useState } from 'react';
import { requestSignUpUser } from '~/api';
import './style.css';

const SignUp = () => {
  const [statusText, setStatusText] = useState('');
  const emailInputRef = useRef<HTMLInputElement>(null);
  const joinMutation = requestSignUpUser({
    onSuccess: (data: RequestJoinUserDTO) =>
      setStatusText(`User(${data.email}) has successfully joined!`),
    onError: (err) => setStatusText(err.errorMessage),
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

export default SignUp;
