import React from 'react';

import { FeedQuery } from '@src/queries/FeedQuery';
import { Link, UpdateStoreAfterVoteFn  } from '@src/components/Link';
import { LinkListComponent, LinkListQuery } from '@src/generated/graphql';

const updateCacheAfterVote: UpdateStoreAfterVoteFn =
  (store, mutationResult, linkId) => {
    const data = store.readQuery<LinkListQuery>({ query: FeedQuery });

    // TODO: Should raise error here
    if (!data) {
      return;
    }

    const votedLink = data.feed.links.find(link => link.id === linkId);

    // TODO: Should raise error here
    if (!votedLink ||
        !mutationResult ||
        !mutationResult.data ||
        !mutationResult.data.vote) {
      return;
    }

    votedLink.votes = mutationResult.data.vote.link.votes;

    store.writeQuery({ query: FeedQuery, data });
  };

interface LinkListProps {}

export const LinkList: React.FC<LinkListProps> = props => {
  return (
    <LinkListComponent>
      {({ loading, error, data }) => {
        if (loading) return <div>Fetching</div>;
        if (error) return <div>Error</div>;
        if (!data) return <div>No data</div>;

        const linksToRender = data.feed.links;

        return (
          <div>
            {linksToRender.map((link, index) => (
              <Link
                key={link.id}
                link={link}
                index={index}
                updateStoreAfterVote={updateCacheAfterVote}
              />
            ))}
          </div>
        );
      }}
    </LinkListComponent>
  );
};
