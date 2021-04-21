import { Box, Button, Flex, Heading, Stack, Text } from "@chakra-ui/react";
import { withUrqlClient } from "next-urql";
import NextLinK from "next/link";
import React from "react";
import Layout from "../components/Layout";
import { useMeQuery, usePostsQuery } from "../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";

const Index = () => {
  const [{ data: postsData, fetching: fetchingPosts }] = usePostsQuery({
    variables: {
      limit: 10,
    }
  });
  const [{ data: meData, fetching }] = useMeQuery();
  return (
    <Layout>
      {!fetching && meData?.me && <NextLinK href="/create-post"><Button bg="tomato" m={5}>Create Post</Button></NextLinK>}
      {fetchingPosts ? <div>Loading ...</div> : postsData && postsData.posts.map(post => <Stack key={post.id} spacing={8}>
        <Box p={5} shadow="md" borderWidth="1px">
          <Heading fontSize="xl">{post.title}</Heading>
          <Text mt={4}>{post.textSnippet}</Text>
        </Box>
      </Stack>)}
      {postsData && <Flex>
        <Button isLoading={fetchingPosts} colorScheme="red" m={"auto"} fontWeight="bold" padding="3" my={5}>
          Load more
        </Button>
      </Flex>}
    </Layout>
  )
}

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
