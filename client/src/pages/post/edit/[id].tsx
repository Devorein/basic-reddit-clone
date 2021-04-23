import { Button } from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import { withUrqlClient } from 'next-urql';
import React from 'react';
import FullPageSpinner from '../../../components/FullPageSpinner';
import InputField from '../../../components/InputField';
import Layout from '../../../components/Layout';
import { useUpdatePostMutation } from '../../../generated/graphql';
import { usePostById } from '../../../hooks/usePostById';
import { createUrqlClient } from '../../../utils/createUrqlClient';

const EditPost = () => {
  const { router, intId, meData, meFetching, postData, postFetching } = usePostById();
  const [, updatePost] = useUpdatePostMutation();

  return meData && !meFetching && postData && !postFetching ? <Layout><Formik initialValues={{ text: postData.text, title: postData.title }} onSubmit={async (values) => {
    const response = await updatePost({ id: intId, input: values })
    if (!response.error)
      router.back();
  }}>
    {({ isSubmitting }) =>
      <Form>
        <InputField name="title" placeholder="title" label="Title" />
        <InputField name="text" placeholder="text" label="Text" textarea />
        <Button colorScheme="orange" m={5} isLoading={isSubmitting} type="submit">Update Post</Button>
      </Form>
    }
  </Formik>;
  </Layout> :
    <FullPageSpinner />
}

export default withUrqlClient(createUrqlClient)(EditPost);