import React from 'react';

import { Link as LinkType } from '@src/types';

type LinkProps = {
  link: LinkType;
};

export const Link: React.FC<LinkProps> = props => (
  <div>
    <div>
        {props.link.description} ({props.link.url})
    </div>
  </div>
);
