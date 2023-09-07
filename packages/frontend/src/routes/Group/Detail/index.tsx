import { MemberListDTO, NUMERIC_STRING_RULE } from '@my-task/common';
import { useCallback, useEffect, useReducer, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchGroupInfo, fetchMemberList } from '~/api';
import { GroupInvite } from '~/components';

type MemberList = MemberListDTO['member'];

const reducer = (state: MemberList, payload: MemberList) => state.concat(...payload);

const GroupDetail = () => {
  const [members, dispatch] = useReducer(reducer, []);
  const nextPage = Math.ceil(members.length / 30) + 1;
  const [maxPage, setMaxPage] = useState(1);

  const { id } = useParams();
  const groupId = NUMERIC_STRING_RULE.parse(id);

  const query = fetchGroupInfo(groupId, {});
  const mutation = fetchMemberList({
    onSuccess: (data) => {
      if (data.member.length === 0) return;
      dispatch(data.member);
      setMaxPage(() => Math.ceil(data.count / 30));
    },
  });

  const onClick = useCallback(() => mutation.mutate({ groupId, page: nextPage }), [members]);

  useEffect(() => mutation.mutate({ groupId }), []);

  if (query.isError) throw new Error(query.error.errorMessage);

  const group = !query.isLoading ? query.data : { id: -1, name: 'loading...' };
  const isDisabled = mutation.isLoading || nextPage > maxPage;

  return (
    <div>
      <h3>{group.name}</h3>
      <GroupInvite groupId={groupId} />
      <ul>
        {members.map((member) => (
          <li key={member.id}>
            {member.email}
            {member.isManager ? ' (manager)' : ''}
          </li>
        ))}
      </ul>
      <button onClick={onClick} disabled={isDisabled} aria-disabled={isDisabled}>
        Load More User
      </button>
    </div>
  );
};

export default GroupDetail;
