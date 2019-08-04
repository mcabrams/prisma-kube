import React from 'react';
import { DataProxy } from 'apollo-cache';
import { FetchResult } from 'react-apollo';

import { getAuthToken } from '@src/helpers/auth';
import { timeDifferenceForDate } from '@src/helpers/time';
import {
  LinkInfoFragment, VoteComponent, VoteMutation,
} from '@src/generated/graphql';

type VoteMutationResult = FetchResult<VoteMutation>;
type LinkId = LinkInfoFragment['id'];
export type UpdateStoreAfterVoteFn = (
  store: DataProxy,
  mutationResult: VoteMutationResult,
  linkId: LinkId
) => void;

type LinkProps = {
  link: LinkInfoFragment;
  index: number;
  updateStoreAfterVote: UpdateStoreAfterVoteFn;
};

export const Link: React.FC<LinkProps> = props => {
  const authToken = getAuthToken();
  const voteForLink = () => {};
  return (
    <div className="flex mt2 items-start">
      <div className="flex items-center">
        <span className="gray">{props.index + 1}</span>
        {authToken && (
          <VoteComponent
            variables={{ linkId: props.link.id }}
            update={(store, mutationResult) => {
              props.updateStoreAfterVote(store, mutationResult, props.link.id);
            }}
          >
            {mutation => (
              <div className="ml1 gray f11" onClick={() => mutation()}>
                ▲
              </div>
            )}
          </VoteComponent>
        )}
      </div>
      <div className="ml1">
        <div>
          {props.link.description} ({props.link.url})
        </div>
        <div className="f6 lh-copy gray">
          {props.link.votes.length} votes | by{' '}
          {props.link.postedBy
            ? props.link.postedBy.name : 'Unknown'}{' '}
          {timeDifferenceForDate(props.link.createdAt)}
        </div>
      </div>
    </div>
  );
};
