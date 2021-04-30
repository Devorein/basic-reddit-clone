import { Button } from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import { useRouter } from 'next/router';
import React from 'react';
import FullPageSpinner from '../components/FullPageSpinner';
import InputField from '../components/InputField';
import Layout from '../components/Layout';
import { useCreatePostMutation } from '../generated/graphql';
import { useIsAuth } from '../hooks/useIsAuth';
import { withApollo } from '../utils/withApollo';

const CreatePost = () => {
  const router = useRouter();
  const { meData, meFetching } = useIsAuth();

  const [createPost] = useCreatePostMutation();
  return meData && !meFetching ? <Layout><Formik initialValues={{ text: '', title: '' }} onSubmit={async (values) => {
    const response = await createPost({
      variables: { input: values }, update(cache) {
        cache.evict({ fieldName: 'posts:{}' })
      }
    })
    if (!response.errors)
      router.push("/");
  }}>
    {({ isSubmitting }) =>
      <Form>
        <InputField name="title" placeholder="title" label="Title" />
        <InputField name="text" placeholder="text" label="Text" textarea />
        <Button colorScheme="orange" m={5} isLoading={isSubmitting} type="submit">Create Post</Button>
      </Form>
    }
  </Formik>;
  </Layout> : <FullPageSpinner />
}

export default withApollo({ ssr: false })(CreatePost)
