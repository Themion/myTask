import { User, parseWithZod } from '@my-task/common';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { z } from 'zod';
import { joinUserConfirm } from '~/api';

const Welcome = () => {
  const { uuid } = useParams();
  const [email, setEmail] = useState<string>();
  const [error, setError] = useState<any>();

  const joinConfirm = joinUserConfirm({
    onSuccess: (data: User) => {
      console.log(data); // striceMode를 사용하므로 디버깅을 위함
      setEmail(data.email as string);
    },
    onError: (err) => setError(err),
  });

  if (error) throw error;

  if (!email && !error && !joinConfirm.isLoading) {
    const result = parseWithZod(uuid, z.string().uuid());

    if (result.error) throw result.error;
    else if (!result.data) throw { errorMessage: '잘못된 경로로 Welcome 페이지에 접근하였습니다!' };

    joinConfirm.mutate({ uuid: result.data });
  }

  return email ? <div>Welcome, {email}!</div> : <div>Loading...</div>;
};

export default Welcome;
