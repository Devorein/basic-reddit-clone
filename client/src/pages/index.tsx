import { withUrqlClient } from "next-urql";
import React from "react";
import Layout from "../components/Layout";
import { usePostsQuery } from "../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";

const Index = () => {
  const [{ data }] = usePostsQuery();
  return (
    <Layout>
      {!data ? <div>Loading ...</div> : data.posts.map(post => <div key={post.id}>{post.title}</div>)}
    </Layout>
  )
}

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
