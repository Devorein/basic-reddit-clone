import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { Box, Button, Flex, Heading, IconButton, Link, Stack, Text } from "@chakra-ui/react";
import { withUrqlClient } from "next-urql";
import NextLink from "next/link";
import React, { useState } from "react";
import Layout from "../components/Layout";
import VoteSection from '../components/VoteSection';
import { PostsQueryVariables, useDeletePostMutation, useMeQuery, usePostsQuery } from "../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";

const Index = () => {
  const [postQueryVariables, setPostQueryVariables] = useState<PostsQueryVariables>({
    limit: 10,
    cursor: null
  });
  const [{ data: meData }] = useMeQuery();
  const [, deletePost] = useDeletePostMutation();

  const [{ data: postsData, fetching: fetchingPosts }] = usePostsQuery({
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
          {meData?.me && post.creatorId === meData.me.id && <Flex cursor="pointer" m={5} align="center" direction="column" justifyContent="center">
            <NextLink href="/post/edit/[id]" as={`/post/edit/${post.id}`}>
              <IconButton m={3} as={Link} aria-label="Update Post" colorScheme="blue" icon={<EditIcon size={20} />} />
            </NextLink>
            <IconButton m={3} aria-label="Delete Post" colorScheme="red" icon={<DeleteIcon size={20} />}
              onClick={async () => {
                await deletePost({
                  id: post.id
                })
              }}
            />
          </Flex>}
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
