import { Heading, Text } from "@chakra-ui/react";
import { withUrqlClient } from 'next-urql';
import React from 'react';
import Layout from '../../components/Layout';
import { createUrqlClient } from '../../utils/createUrqlClient';

const Post = () => {


  let comp;

  if (fetching)
    comp = <div>Loading post</div>;
  else if (error)
    comp = <div>{error.message}</div>
  else if (!data?.post)
    comp = <div>Could not find post</div>
  else
    comp = <>
      <Heading mb={5}>{data.post.title}</Heading>
      <Text>{data.post.text}</Text>
    </>

  return <Layout>
    {comp}
  </Layout>
}

export default withUrqlClient(createUrqlClient, {
  ssr: true
})(Post);