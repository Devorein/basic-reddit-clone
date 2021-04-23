import { withUrqlClient } from 'next-urql';
import { useRouter } from 'next/router';
import React from 'react';
import { useUpdatePostMutation } from '../../../generated/graphql';
import { createUrqlClient } from '../../../utils/createUrqlClient';

const EditPost = () => {
  const [, updatePost] = useUpdatePostMutation();
  const router = useRouter();
  const id = router.query.id;
  return <div>Edit Post {id}</div>;
}

export default withUrqlClient(createUrqlClient)(EditPost);