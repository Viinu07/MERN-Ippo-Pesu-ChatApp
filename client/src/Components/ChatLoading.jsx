import React from 'react';
import { Skeleton, Stack } from '@chakra-ui/react';
/* Chat loading skeleton handled */
const ChatLoading = () => {
  return (
    <Stack>
      <Skeleton height="100px" />
      <Skeleton height="100px" />
      <Skeleton height="100px" />
      <Skeleton height="100px" />
      <Skeleton height="100px" />
      <Skeleton height="100px" />
    </Stack>
  );
};

export default ChatLoading;
