import { useEffect, useState } from 'react';
import { redirect, useParams } from 'react-router-dom';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { z } from 'zod';
import { confirmAuth, removeAuth } from '~/api';
import { shouldRefreshAtom } from '~/recoil/atoms';

const SignOutButton = () => {
  const [refresh, setRefresh] = useRecoilState(shouldRefreshAtom);
  // TODO: error를 state가 아닌 다른 방식으로 사용할 수 없을까?
  const [error, setError] = useState<any>();
  const mutation = removeAuth({
    onSuccess: () => setRefresh(false),
    onError: (err) => setError(err),
  });

  const { isLoading, isError } = mutation;

  if (error) throw error;

  const onClick = () => mutation.mutate({});

  return (
    <button onClick={onClick} aria-busy={isLoading} disabled={!refresh || isLoading || isError}>
      Try to Sign Out!
    </button>
  );
};

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
      <SignOutButton />
    </div>
  ) : (
    <div>Loading...</div>
  );
};

export default AuthConfirm;
