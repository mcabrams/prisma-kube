import React from 'react';

import { FeedQuery } from '@src/queries/FeedQuery';
import { NewLinksSubscription } from '@src/queries/NewLinksSubscription';
import { NewVotesSubscription } from '@src/queries/NewVotesSubscription';
import { Link, UpdateStoreAfterVoteFn  } from '@src/components/Link';
import {
  LinkListComponent, LinkListComponentProps, LinkListQuery,
} from '@src/generated/graphql';
import { ObservableQuery } from 'apollo-client';

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
type LinkListObservableQuery = ObservableQuery<LinkListQuery>
type SubscribeToMore = LinkListObservableQuery['subscribeToMore'];

const subscribeToNewLinks = (subscribeToMore: SubscribeToMore) => {
  subscribeToMore({
    document: NewLinksSubscription,
    updateQuery: (prev, { subscriptionData }) => {
      if (!subscriptionData.data) {
        return prev;
      }
      // @ts-ignore TODO: Not sure how to fix this
      const newLink = subscriptionData.data.newLink;
      const exists = prev.feed.links.find(({ id }) => id === newLink.id);
      if (exists) {
        return prev;
      }

      return Object.assign({}, prev, {
        feed: {
          links: [newLink, ...prev.feed.links],
          count: prev.feed.links.length + 1,
          __typename: prev.feed.__typename,
        },
      });
    },
  });
};

const subscribeToNewVotes = (subscribeToMore: SubscribeToMore) => {
  subscribeToMore({
    document: NewVotesSubscription,
  });
};

interface LinkListProps {}

export const LinkList: React.FC<LinkListProps> = props => {
  return (
    <LinkListComponent>
      {({ loading, error, data, subscribeToMore }) => {
        if (loading) return <div>Fetching</div>;
        if (error) return <div>Error</div>;
        if (!data) return <div>No data</div>;

        subscribeToNewLinks(subscribeToMore);
        subscribeToNewVotes(subscribeToMore);
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
