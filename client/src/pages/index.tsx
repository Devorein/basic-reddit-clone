import { Box, Button, Heading, Stack, Text } from "@chakra-ui/react";
import { withUrqlClient } from "next-urql";
import NextLinK from "next/link";
import React from "react";
import Layout from "../components/Layout";
import { useMeQuery, usePostsQuery } from "../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";

const Index = () => {
  const [{ data }] = usePostsQuery({
    variables: {
      limit: 10,
    }
  });
  const [{ data: meData, fetching }] = useMeQuery();
  return (
    <Layout>
      {!fetching && meData?.me && <NextLinK href="/create-post"><Button bg="tomato" m={5}>Create Post</Button></NextLinK>}
      {!data ? <div>Loading ...</div> : data.posts.map(post => <Stack key={post.id} spacing={8}>
        <Box p={5} shadow="md" borderWidth="1px">
          <Heading fontSize="xl">{post.title}</Heading>
          <Text mt={4}>{post.textSnippet}</Text>
        </Box>
      </Stack>)}
    </Layout>
  )
}

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
