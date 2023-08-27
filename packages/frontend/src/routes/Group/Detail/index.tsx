import { NUMERIC_STRING_RULE } from '@my-task/common';
import { useParams } from 'react-router-dom';
import { GroupInvite } from '~/components';

const GroupDetail = () => {
  const { id } = useParams();
  const groupId = NUMERIC_STRING_RULE.parse(id);

  return (
    <div>
      <h3>Group Name</h3>
      <GroupInvite groupId={groupId} />
      <ul></ul>
    </div>
  );
};

export default GroupDetail;
