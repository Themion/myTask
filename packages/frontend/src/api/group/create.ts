import { CreateGroupDTO } from '@my-task/common';
import { useMutation } from '@tanstack/react-query';
import { HttpMethod } from '~/constants';
import { MutationOptions } from '~/types';
import _fetch from '../core';

const createGroup = (options: MutationOptions<CreateGroupDTO, CreateGroupDTO>) =>
  useMutation({
    mutationKey: ['createGroup'],
    mutationFn: (body) => _fetch('/group', { method: HttpMethod.POST, body }),
    ...options,
  });

export default createGroup;
