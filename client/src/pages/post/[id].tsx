import { Text } from "@chakra-ui/react";
import { withUrqlClient } from 'next-urql';
import { useRouter } from 'next/router';
import React from 'react';
import Layout from '../../components/Layout';
import { usePostQuery } from '../../generated/graphql';
import { createUrqlClient } from '../../utils/createUrqlClient';

const Post = () => {
  const router = useRouter();
  const intId = typeof router.query.id === 'string' ? parseInt(router.query.id) : -1;
  const [{ data, fetching }] = usePostQuery({
    pause: intId === -1,
    variables: {
      id: intId
    }
  });

  return fetching ? <div>Loading post</div> : data?.post ? <Layout>
    <Text>{data.post.text}</Text>
  </Layout> : <div>No Post Found</div>
}

export default withUrqlClient(createUrqlClient, {
  ssr: true
})(Post);