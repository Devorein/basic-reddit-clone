import { Heading, Text } from "@chakra-ui/react";
import React from 'react';
import Layout from '../../components/Layout';
import { MutatePostButtons } from "../../components/MutatePostButtons";
import { usePostById } from "../../hooks/usePostById";
import { withApollo } from "../../utils/withApollo";

const Post = () => {
  const { postFetching, postError, postData } = usePostById();

  let comp;

  if (postFetching)
    comp = <div>Loading post</div>;
  else if (postError)
    comp = <div>{postError.message}</div>
  else if (!postData)
    comp = <div>Could not find post</div>
  else
    comp = <>
      <Heading mb={5}>{postData.title}</Heading>
      <Text>{postData.text}</Text>
      <MutatePostButtons direction="row" creatorId={postData.creatorId} id={postData.id} />
    </>

  return <Layout>
    {comp}
  </Layout>
}

export default withApollo({ ssr: true })(Post)