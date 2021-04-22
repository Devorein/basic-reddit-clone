import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';
import { Box, Button, Flex, Heading, IconButton, Stack, Text } from "@chakra-ui/react";
import { withUrqlClient } from "next-urql";
import NextLinK from "next/link";
import React, { useState } from "react";
import Layout from "../components/Layout";
import { PostsQueryVariables, useMeQuery, usePostsQuery } from "../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";

const Index = () => {
  const [postQueryVariables, setPostQueryVariables] = useState<PostsQueryVariables>({
    limit: 10,
    cursor: null
  });

  const [{ data: postsData, fetching: fetchingPosts }] = usePostsQuery({
    variables: postQueryVariables
  });
  const [{ data: meData, fetching }] = useMeQuery();
  return (
    <Layout>
      {!fetching && meData?.me && <NextLinK href="/create-post"><Button bg="tomato" m={5}>Create Post</Button></NextLinK>}
      {fetchingPosts ? <div>Loading ...</div> : postsData && <Stack spacing={5}> {postsData.posts.posts.map(post =>
        <Flex key={post.id} >
          <Flex p={5} shadow="md" borderWidth="1px" direction="column" justifyContent="center" alignItems="center">
            <IconButton aria-label="Up Vote post" bg="tomato" size="sm">
              <ChevronUpIcon size="50px" cursor="pointer" color="white" />
            </IconButton>
            <Box>{post.points}</Box>
            <IconButton aria-label="Down Vote post" bg="tomato" size="sm">
              <ChevronDownIcon size="50px" cursor="pointer" color="white" />
            </IconButton>
          </Flex>
          <Box flex="1" p={5} shadow="md" borderWidth="1px">
            <Heading fontSize="xl">{post.title}</Heading>
            <Heading fontSize="sm">by {post.creator.username}</Heading>
            <Text mt={4}>{post.textSnippet}</Text>
          </Box>
        </Flex>
      )}
      </Stack>}
      {postsData && postsData.posts.hasMore && <Flex>
        <Button onClick={() => {
          setPostQueryVariables({
            limit: postQueryVariables.limit,
            cursor: postsData.posts.posts[postsData.posts.posts.length - 1].createdAt
          })
        }} isLoading={fetchingPosts} colorScheme="red" m={"auto"} fontWeight="bold" padding="3" my={5}>
          Load more
        </Button>
      </Flex>}
    </Layout>
  )
}

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
