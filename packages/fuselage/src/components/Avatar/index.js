import PropTypes from 'prop-types';
import React, { useContext, createContext } from 'react';
import flattenChildren from 'react-keyed-flatten-children';

import { createPropType } from '../../helpers/createPropType';
import { size } from '../../styleTokens';
import { Box } from '../Box';

const AvatarContext = createContext({
  baseUrl: '',
});

export function Avatar({
  title,
  rounded = false,
  url,
  size = 'x36',
  ...props
}) {
  const { baseUrl } = useContext(AvatarContext);

  return <Box
    is='figure'
    rcx-avatar
    aria-label={title}
    {...props}
    width={size}
    height={size}
    verticalAlign='middle'
  >
    <Box
      is='img'
      {...props}
      rcx-avatar__element
      rcx-avatar__element--rounded={rounded}
      src={`${ baseUrl }${ url }`}
      width={size}
      height={size}
    />
  </Box>;
}

Avatar.Context = AvatarContext;

Avatar.propTypes = {
  rounded: PropTypes.bool,
  size: createPropType(size),
  title: PropTypes.string,
  url: PropTypes.string.isRequired,
};

const AvatarStack = ({ children, ...props }) =>
  <Box rcx-avatar-stack {...props}>
    {flattenChildren(children).reverse()}
  </Box>;

Avatar.Stack = AvatarStack;
