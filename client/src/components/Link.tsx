import React from 'react';
import { DataProxy } from 'apollo-cache';
import { FetchResult } from 'apollo-link';

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
  updateStoreAfterVote?: UpdateStoreAfterVoteFn;
};

export const Link: React.FC<LinkProps> = props => {
  const { index, link, updateStoreAfterVote } = props;
  const authToken = getAuthToken();
  const voteForLink = () => {};
  return (
    <div className="flex mt2 items-start">
      <div className="flex items-center">
        <span className="gray">{index + 1}</span>
        {authToken && updateStoreAfterVote && (
          <VoteComponent
            variables={{ linkId: link.id }}
            update={(store, mutationResult) => {
              updateStoreAfterVote(store, mutationResult, link.id);
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
          {link.description} ({link.url})
        </div>
        <div className="f6 lh-copy gray">
          {link.votes.length} votes | by{' '}
          {link.postedBy
            ? link.postedBy.name : 'Unknown'}{' '}
          {timeDifferenceForDate(link.createdAt)}
        </div>
      </div>
    </div>
  );
};
