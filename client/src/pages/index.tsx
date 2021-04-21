import { Button } from "@chakra-ui/react";
import { withUrqlClient } from "next-urql";
import NextLinK from "next/link";
import React from "react";
import Layout from "../components/Layout";
import { useMeQuery, usePostsQuery } from "../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";

const Index = () => {
  const [{ data }] = usePostsQuery({
    variables: {
      limit: 10
    }
  });
  const [{ data: meData, fetching }] = useMeQuery();
  return (
    <Layout>
      {!fetching && meData?.me && <NextLinK href="/create-post"><Button bg="tomato" m={5}>Create Post</Button></NextLinK>}
      {!data ? <div>Loading ...</div> : data.posts.map(post => <div key={post.id}>{post.title}</div>)}
    </Layout>
  )
}

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
