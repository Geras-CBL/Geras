import React from 'react';

export const MaterialIcons = ({ name }: { name: string }) =>
  React.createElement('Text', { testID: `icon-${name}` }, name);
