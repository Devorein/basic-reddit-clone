import { Box, Button, Flex, Heading, Stack, Text } from "@chakra-ui/react";
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
  console.log({ fetchingPosts, postsData })
  const [{ data: meData, fetching }] = useMeQuery();
  return (
    <Layout>
      {!fetching && meData?.me && <NextLinK href="/create-post"><Button bg="tomato" m={5}>Create Post</Button></NextLinK>}
      {fetchingPosts ? <div>Loading ...</div> : postsData && <Stack spacing={5}> {postsData.posts.posts.map(post =>
        <Box key={post.id} p={5} shadow="md" borderWidth="1px">
          <Heading fontSize="xl">{post.title}</Heading>
          <Text mt={4}>{post.textSnippet}</Text>
        </Box>)}
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
