import { ApolloCache, gql } from '@apollo/client';
import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';
import { Box, Flex, IconButton } from '@chakra-ui/react';
import React, { useState } from 'react';
import { PostInfoFragment, useMeQuery, useVoteMutation, VoteMutation } from '../generated/graphql';

interface Props {
  post: PostInfoFragment
}

function updateVote(value: number, postId: number, cache: ApolloCache<VoteMutation>) {
  const data = cache.readFragment<PostInfoFragment>({
    fragment: gql`
    fragment _ on Post {
      id
      points
      voteStatus
    }
  `,
    id: `Post:${postId}`
  }
  );
  if (data) {
    const amount = value - data.voteStatus!;
    const newPoints = data.points + amount;
    cache.writeFragment({
      fragment: gql`
      fragment __ on Post {
        id
        points
        voteStatus
      }
    `,
      id: `Post:${postId}`,
      data: { points: newPoints, voteStatus: value }
    }
    );
  }
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
          },
          update(cache) {
            updateVote(post.voteStatus === 1 ? 0 : 1, post.id, cache)
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
          },
          update(cache) {
            updateVote(post.voteStatus === -1 ? 0 : -1, post.id, cache)
          }
        })
        setLoadingState('not-loading');
      }} isLoading={loadingState !== 'not-loading'} aria-label="Down Vote post" size="sm">
        <ChevronDownIcon size="50px" cursor="pointer" color="black" />
      </IconButton>
    </Flex>
  )
}
