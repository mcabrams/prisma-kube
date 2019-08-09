import React, { useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { DataProxy } from 'apollo-cache';
import { FetchResult } from 'apollo-link';

import { LINKS_PER_PAGE } from '@src/constants';
import {
  LinkListQuery,
  LinkOrderByInput,
  PostComponent,
  PostMutation,
} from '@src/generated/graphql';
import { FeedQuery } from '@src/queries/FeedQuery';

type PostMutationResult = FetchResult<PostMutation>;
export type UpdateStoreAfterCreateLinkFn = (
  store: DataProxy,
  mutationResult: PostMutationResult,
) => void;

const updateStoreAfterCreateLink: UpdateStoreAfterCreateLinkFn = (
  store, mutationResult,
) => {
  const first = LINKS_PER_PAGE;
  const skip = 0;
  const orderBy = LinkOrderByInput.CreatedAtDesc;
  const data = store.readQuery<LinkListQuery>({
    query: FeedQuery,
    variables: { skip, first, orderBy },
  });

  // TODO: Should raise error here
  if (!data) {
    return;
  }

  // TODO: Should raise error here
  if (!mutationResult ||
      !mutationResult.data ||
      !mutationResult.data.post) {
    return;
  }
  const post = mutationResult.data.post;

  data.feed.links.unshift(post);
  store.writeQuery({
    query: FeedQuery,
    data,
    variables: { skip, first, orderBy }
  });
};

export const CreateLink: React.FC<RouteComponentProps> = (props) => {
  const [description, setDescription] = useState('');
  const [url, setUrl] = useState('');

  return (
    <div>
      <div className="flex flex-column mt3">
        <input
          className="mb2"
          value={description}
          onChange={e => setDescription(e.target.value)}
          type="text"
          placeholder="A description for the link"
        />
        <input
          className="mb2"
          value={url}
          onChange={e => setUrl(e.target.value)}
          type="text"
          placeholder="The URL for the link"
        />
      </div>
      <PostComponent
        variables={{ description, url }}
        onCompleted={() => props.history.push('/new/1')}
        update={(store, mutationResult) => {
          updateStoreAfterCreateLink(store, mutationResult);
        }}
      >
        {
          (postMutation, { error }) => (
            <>
              <button onClick={() => {postMutation()}}>
                Submit
              </button>
              {error && <p>Uh oh, something went wrong!</p>}
            </>
          )
        }
      </PostComponent>
    </div>
  );
}
