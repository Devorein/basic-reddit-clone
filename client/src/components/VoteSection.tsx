import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';
import { Box, Flex, IconButton } from '@chakra-ui/react';
import React from 'react';
import { PostInfoFragment, useVoteMutation } from '../generated/graphql';

interface Props {
  post: PostInfoFragment
}

export default function VoteSection({ post }: Props) {
  const [, vote] = useVoteMutation();
  return (
    <Flex p={5} shadow="md" borderWidth="1px" direction="column" justifyContent="center" alignItems="center">
      <IconButton onClick={() => {
        vote({
          postId: post.id,
          value: 1
        })
      }} aria-label="Up Vote post" colorScheme="tomato" size="sm">
        <ChevronUpIcon size="50px" cursor="pointer" color="white" />
      </IconButton>
      <Box m={3}>{post.points}</Box>
      <IconButton aria-label="Down Vote post" colorScheme="tomato" size="sm">
        <ChevronDownIcon size="50px" cursor="pointer" color="white" />
      </IconButton>
    </Flex>
  )
}
