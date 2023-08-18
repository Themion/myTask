import { Group } from '@my-task/common';
import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { fetchGroupList } from '~/api/group';
import { GroupAdd } from '~/components';
import styles from './styles.module.scss';

const GroupList = () => {
  const [group, setGroup] = useState<Partial<Group>[]>([]);
  const [count, setCount] = useState(0);
  const [searchParams] = useSearchParams();
  const page = parseInt(searchParams.get('page') ?? '1');
  const navigate = useNavigate();

  const query = fetchGroupList({}, { page });
  if (query.data && query.data.group.length !== group.length) {
    setGroup(() => query.data.group);
    setCount(() => query.data.count);
  }

  const buttonDisabled = !query.isSuccess;
  const prevButtonDisabled = buttonDisabled || page <= 1;
  const nextButtonDisabled = buttonDisabled || page * 10 >= count;

  const onPrevButtonClick = () => {
    navigate(`?page=${page - 1}`);
  };

  const onNextButtonClick = () => {
    navigate(`?page=${page + 1}`);
  };

  return (
    <>
      <div className={styles.wrapper}>
        <h2 className={styles.title}>Groups</h2>
        {query.isLoading ? (
          <div>loading...</div>
        ) : (
          <div className={styles.list}>
            {group.map(({ id, name }) => (
              <div key={id} className={styles.item}>
                <span className={styles.text}>{name}</span>
              </div>
            ))}
          </div>
        )}
        <div>
          <button
            type="button"
            onClick={onPrevButtonClick}
            disabled={prevButtonDisabled}
            aria-disabled={prevButtonDisabled}
          >
            prev
          </button>
          <button
            type="button"
            onClick={onNextButtonClick}
            disabled={nextButtonDisabled}
            aria-disabled={nextButtonDisabled}
          >
            next
          </button>
        </div>
      </div>
      <GroupAdd />
    </>
  );
};

export default GroupList;
