import React, { useState } from 'react';
import { WithApolloClient, withApollo } from 'react-apollo';

import { LinkInfo } from '@src/components/LinkInfo';
import { FeedSearchQueryQuery, LinkInfoFragment } from '@src/generated/graphql';
import { FeedSearchQuery } from '@src/queries/FeedSearchQuery';

interface SearchProps {}

const SearchWithoutApollo: React.FC<WithApolloClient<SearchProps>> = props => {
  const [links, setLinks] = useState<LinkInfoFragment[]>([]);
  const [filter, setFilter] = useState('');

  const executeSearch = async () => {
    const result = await props.client.query<FeedSearchQueryQuery>({
      query: FeedSearchQuery,
      variables: { filter },
    });
    const feedLinks = result.data.feed.links;
    setLinks(feedLinks);
  };

  return (
    <div>
      <div>
        Search
        <input type="text" onChange={e => setFilter(e.target.value)} />
        <button type="submit" onClick={() => executeSearch()}>OK</button>
      </div>
      {links.map((link, index) => (
        <LinkInfo
          key={link.id}
          link={link}
          index={index}
        />
      ))}
    </div>
  );
};

export const Search = withApollo(SearchWithoutApollo);
