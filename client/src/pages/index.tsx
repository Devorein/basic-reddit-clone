import { Box, Button, Flex, Heading, Link, Stack, Text } from "@chakra-ui/react";
import NextLink from "next/link";
import React, { useState } from "react";
import Layout from "../components/Layout";
import { MutatePostButtons } from "../components/MutatePostButtons";
import VoteSection from '../components/VoteSection';
import { PostsQueryVariables, usePostsQuery } from "../generated/graphql";

const Index = () => {
  const [postQueryVariables, setPostQueryVariables] = useState<PostsQueryVariables>({
    limit: 10,
    cursor: null
  });

  const { data: postsData, loading: fetchingPosts } = usePostsQuery({
    variables: postQueryVariables
  });

  return (
    <Layout>
      {fetchingPosts ? <div>Loading ...</div> : postsData && <Stack spacing={5}> {postsData.posts.posts.map(post => !post ? null :
        <Flex key={post.id} >
          <VoteSection post={post} />
          <Box flex="1" p={5} shadow="md" borderWidth="1px">
            <NextLink href="/post/[id]" as={`/post/${post.id}`}>
              <Link>
                <Heading fontSize="xl">{post.title}</Heading>
              </Link>
            </NextLink>
            <Heading fontSize="sm">by {post.creator.username}</Heading>
            <Text mt={4}>{post.textSnippet}</Text>
          </Box>
          <MutatePostButtons id={post.id} creatorId={post.creatorId} />
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

export default Index;
