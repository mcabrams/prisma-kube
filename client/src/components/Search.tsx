import React, { useState } from 'react';
import { useLazyQuery } from '@apollo/react-hooks';
import { LinkInfo } from '@src/components/LinkInfo';

import {
  FeedSearchQueryQuery,
  FeedSearchQueryQueryVariables,
  LinkInfoFragment,
} from '@src/generated/graphql';
import { FeedSearchQuery } from '@src/queries/FeedSearchQuery';

interface SearchProps {}

export const Search: React.FC<SearchProps> = () => {
  const [links, setLinks] = useState<LinkInfoFragment[]>([]);
  const [filter, setFilter] = useState('');
  const [search, _] = (
    useLazyQuery<FeedSearchQueryQuery, FeedSearchQueryQueryVariables>(
      FeedSearchQuery,
      {
        onCompleted: data => setLinks(data.feed.links),
      },
    )
  );

  return (
    <div>
      <div>
        Search
        <input type="text" onChange={e => setFilter(e.target.value)} />
        <button
          type="submit"
          onClick={() => search({
            variables: { filter },
          })}
        >
          OK
        </button>
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
