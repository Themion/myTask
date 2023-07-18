import { RequestSignInDTO } from '@my-task/common';
import { FormEventHandler, useRef, useState } from 'react';
import { requestSignIn } from '~/api';

const SignInRequest = () => {
  const [statusText, setStatusText] = useState('');
  const emailInputRef = useRef<HTMLInputElement>(null);
  const mutation = requestSignIn({
    onSuccess: (data: RequestSignInDTO) =>
      setStatusText(`Authentication E-Mail is sent to (${data.email})!`),
    onError: (err) => setStatusText(err.errorMessage),
  });

  const onSubmit: FormEventHandler = (e) => {
    e.preventDefault();
    if (!emailInputRef.current) return;

    mutation.mutate({
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
      <button type="submit">Sign In</button>
    </form>
  );
};

export default SignInRequest;
