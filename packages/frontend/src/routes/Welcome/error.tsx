import { useRouteError } from 'react-router-dom';
import { ZodError } from 'zod';

const ErrorPage = () => {
  const err = useRouteError() as any;

  const message = (() => {
    if (!err) return 'Path Error : You need encoded email to join via this page!';
    else if (err.errorMessage !== undefined) return err.errorMessage as string;

    switch (err.constructor) {
      case ZodError:
      case DOMException:
        return 'Parse Error : Given string cannot be parsed to UUID!';
      default:
        return 'Something Went Wrong!';
    }
  })();

  return <div>{message}</div>;
};

export default ErrorPage;
