import { Center, Spinner } from '@chakra-ui/react';
import React from 'react';

const FullPageSpinner = () => {
  return <Center bg="tomato" h="100vh" color="white">
    <Spinner
      thickness="4px"
      speed="0.65s"
      emptyColor="gray.200"
      color="black"
      size="xl"
    />
  </Center>;
}

export default FullPageSpinner;