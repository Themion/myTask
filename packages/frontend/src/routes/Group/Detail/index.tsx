import { NUMERIC_STRING_RULE } from '@my-task/common';
import { useParams } from 'react-router-dom';
import { fetchGroupInfo } from '~/api';
import { GroupInvite } from '~/components';

const GroupDetail = () => {
  const { id } = useParams();
  const groupId = NUMERIC_STRING_RULE.parse(id);
  const query = fetchGroupInfo(groupId, {});

  if (query.isLoading) return <div>loading...</div>;
  if (query.isError) throw new Error(query.error.errorMessage);

  const group = query.data;

  return (
    <div>
      <h3>{group.name}</h3>
      <GroupInvite groupId={groupId} />
      <ul></ul>
    </div>
  );
};

export default GroupDetail;
