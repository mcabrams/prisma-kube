import React from 'react';
import { RouteComponentProps } from 'react-router-dom';

import { LINKS_PER_PAGE } from '@src/constants';
import { FeedQuery } from '@src/queries/FeedQuery';
import { NewLinksSubscription } from '@src/queries/NewLinksSubscription';
import { NewVotesSubscription } from '@src/queries/NewVotesSubscription';
import { Link, UpdateStoreAfterVoteFn  } from '@src/components/Link';
import {
  LinkListQuery, LinkOrderByInput, useLinkListQuery,
} from '@src/generated/graphql';
import { ObservableQuery } from 'apollo-client';

const getIsNewPage = (location: LinkListProps['location']) =>
  location.pathname.includes('new');

const getFeedQueryVariables = (
  location: LinkListProps['location'],
  match: LinkListProps['match'],
) => {
  const isNewPage = getIsNewPage(location);
  const page = parseInt(match.params.page, 10);

  const skip = isNewPage ? (page - 1) * LINKS_PER_PAGE : 0;
  const first = isNewPage ?  LINKS_PER_PAGE : 100;
  const orderBy = isNewPage ? LinkOrderByInput.CreatedAtDesc : null;
  return { skip, first, orderBy };
};


type GetUpdateCacheAfterVote = (
  location: LinkListProps['location'],
  match: LinkListProps['match'],
) => UpdateStoreAfterVoteFn;

const getUpdateCacheAfterVote: GetUpdateCacheAfterVote = (location, match) => {
  const variables = getFeedQueryVariables(location, match);

  return (store, mutationResult, linkId) => {
    const data = store.readQuery<LinkListQuery>({
      query: FeedQuery,
      variables,
    });

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
}
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

const getLinksToRender = (
  data: LinkListQuery,
  location: LinkListProps['location']) => {
  const isNewPage = getIsNewPage(location);

  if (isNewPage) {
    return data.feed.links;
  }
  const rankedLinks = data.feed.links.slice();
  rankedLinks.sort((l1, l2) => l2.votes.length - l1.votes.length);
  return rankedLinks;
};

type LinkListProps = RouteComponentProps<{page: string;}>;

export const LinkList: React.FC<LinkListProps> = props => {
  const { location, match } = props;
  const nextPage = (data: LinkListQuery) => {
    const page = parseInt(match.params.page, 10);
    if (page <= data.feed.count / LINKS_PER_PAGE) {
      const nextPage = page + 1;
      props.history.push(`/new/${nextPage}`);
    }
  };

  const previousPage = () => {
    const page = parseInt(match.params.page, 10);
    if (page > 1) {
      const previousPage = page - 1;
      props.history.push(`/new/${previousPage}`);
    }
  };

  const updateCacheAfterVote = getUpdateCacheAfterVote(location, match);
  const { loading, error, data, subscribeToMore } = useLinkListQuery({
    variables: getFeedQueryVariables(location, match),
  });

  if (loading) return <div>Fetching</div>;
  if (error) return <div>Error</div>;
  if (!data) return <div>No data</div>;

  subscribeToNewLinks(subscribeToMore);
  subscribeToNewVotes(subscribeToMore);
  const linksToRender = getLinksToRender(data, location);
  const isNewPage = getIsNewPage(location);
  const pageIndex = match.params.page ?
    (parseInt(match.params.page, 10) - 1) * LINKS_PER_PAGE : 0;

  return (
    <>
      {linksToRender.map((link, index) => (
        <Link
          key={link.id}
          link={link}
          index={index + pageIndex}
          updateStoreAfterVote={updateCacheAfterVote}
        />
      ))}
      {isNewPage && (
        <div className="flex ml4 mv3 gray">
          <div className="pointer mr2" onClick={previousPage}>
            Previous
          </div>
          <div className="pointer" onClick={() => nextPage(data)}>
            Next
          </div>
        </div>
      )}
    </>
  );
};
