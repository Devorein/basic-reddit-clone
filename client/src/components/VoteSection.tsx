import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';
import { Box, Flex, IconButton } from '@chakra-ui/react';
import React, { useState } from 'react';
import { PostInfoFragment, useMeQuery, useVoteMutation } from '../generated/graphql';

interface Props {
  post: PostInfoFragment
}

export default function VoteSection({ post }: Props) {
  const [loadingState, setLoadingState] = useState<'upvote-loading' | 'not-loading' | 'downvote-loading'>('not-loading');
  const [vote] = useVoteMutation();
  const { data: meData } = useMeQuery();

  return (
    <Flex p={5} shadow="md" borderWidth="1px" direction="column" justifyContent="center" alignItems="center">
      <IconButton colorScheme={post.voteStatus === 1 ? 'green' : undefined} disabled={!Boolean(meData?.me)} onClick={async () => {
        setLoadingState('upvote-loading');
        await vote({
          variables: {
            postId: post.id,
            value: post.voteStatus === 1 ? 0 : 1
          }
        })
        setLoadingState('not-loading');
      }} isLoading={loadingState !== 'not-loading'} aria-label="Up Vote post" size="sm">
        <ChevronUpIcon size="50px" cursor="pointer" color="black" />
      </IconButton>
      <Box m={3}>{post.points}</Box>
      <IconButton colorScheme={post.voteStatus === -1 ? 'red' : undefined} disabled={!Boolean(meData?.me)} onClick={async () => {
        setLoadingState('downvote-loading');
        await vote({
          variables: {
            postId: post.id,
            value: post.voteStatus === -1 ? 0 : -1
          }
        })
        setLoadingState('not-loading');
      }} isLoading={loadingState !== 'not-loading'} aria-label="Down Vote post" size="sm">
        <ChevronDownIcon size="50px" cursor="pointer" color="black" />
      </IconButton>
    </Flex>
  )
}
