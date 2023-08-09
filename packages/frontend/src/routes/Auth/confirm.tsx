import { useEffect, useState } from 'react';
import { redirect, useParams } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import { z } from 'zod';
import { confirmAuth } from '~/api';
import { shouldRefreshAtom } from '~/recoil/atoms';

const AuthConfirm = () => {
  const { uuid } = useParams();
  const [email, setEmail] = useState<string | undefined>(undefined);
  // TODO: error를 state가 아닌 다른 방식으로 사용할 수 없을까?
  const [error, setError] = useState<any>();
  const [countdown, setCountdown] = useState<number>(3);
  const setRefresh = useSetRecoilState(shouldRefreshAtom);

  const joinConfirm = confirmAuth({
    onSuccess: (data) => {
      setEmail(data.email);
      setRefresh(true);
    },
    onError: (err) => setError(err),
  });

  useEffect(() => {
    const interval = setInterval(() => {
      if (email === undefined) return;
      if (countdown > 0) setCountdown((countdown) => countdown - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [email, countdown]);

  if (error) throw error;
  if (countdown === 0) redirect('/');

  if (!email && !error && !joinConfirm.isLoading) {
    const result = z.string().uuid().safeParse(uuid);
    if (!result.success) throw result.error;

    joinConfirm.mutate({ uuid: result.data });
  }

  return email ? (
    <div>
      <div>Welcome, {email}!</div>
      <span>
        You will be redirected in {countdown} second{countdown !== 1 && 's'}...
      </span>
    </div>
  ) : (
    <div>Loading...</div>
  );
};

export default AuthConfirm;
