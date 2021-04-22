import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';
import { Box, Flex, IconButton } from '@chakra-ui/react';
import React, { useState } from 'react';
import { PostInfoFragment, useVoteMutation } from '../generated/graphql';

interface Props {
  post: PostInfoFragment
}

export default function VoteSection({ post }: Props) {
  const [loadingState, setLoadingState] = useState<'upvote-loading' | 'not-loading' | 'downvote-loading'>('not-loading');
  console.log(loadingState);
  const [, vote] = useVoteMutation();
  return (
    <Flex p={5} shadow="md" borderWidth="1px" direction="column" justifyContent="center" alignItems="center">
      <IconButton onClick={async () => {
        setLoadingState('upvote-loading');
        await vote({
          postId: post.id,
          value: 1
        })
        setLoadingState('not-loading');
      }} isLoading={loadingState !== 'not-loading'} aria-label="Up Vote post" bg="red.500" size="sm">
        <ChevronUpIcon size="50px" cursor="pointer" color="black" />
      </IconButton>
      <Box m={3}>{post.points}</Box>
      <IconButton onClick={async () => {
        setLoadingState('downvote-loading');
        await vote({
          postId: post.id,
          value: -1
        })
        setLoadingState('not-loading');
      }} isLoading={loadingState !== 'not-loading'} aria-label="Down Vote post" bg="red.500" size="sm">
        <ChevronDownIcon size="50px" cursor="pointer" color="black" />
      </IconButton>
    </Flex>
  )
}
