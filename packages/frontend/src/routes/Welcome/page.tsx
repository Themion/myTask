import { User } from '@my-task/common';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { z } from 'zod';
import { confirmSignUpUser } from '~/api';

const Welcome = () => {
  const { uuid } = useParams();
  const [email, setEmail] = useState<string>();
  const [error, setError] = useState<any>();

  const joinConfirm = confirmSignUpUser({
    onSuccess: (data: User) => {
      console.log(data); // striceMode를 사용하므로 디버깅을 위함
      setEmail(data.email as string);
    },
    onError: (err) => setError(err),
  });

  if (error) throw error;

  if (!email && !error && !joinConfirm.isLoading) {
    const result = z.string().uuid().safeParse(uuid);
    if (!result.success) throw result.error;

    joinConfirm.mutate({ uuid: result.data });
  }

  return email ? <div>Welcome, {email}!</div> : <div>Loading...</div>;
};

export default Welcome;
