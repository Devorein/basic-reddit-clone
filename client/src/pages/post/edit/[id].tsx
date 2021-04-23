import { Button, Center, Spinner } from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import { withUrqlClient } from 'next-urql';
import { useRouter } from 'next/router';
import React from 'react';
import InputField from '../../../components/InputField';
import Layout from '../../../components/Layout';
import { usePostQuery, useUpdatePostMutation } from '../../../generated/graphql';
import { useIsAuth } from '../../../hooks/useIsAuth';
import { createUrqlClient } from '../../../utils/createUrqlClient';

const EditPost = () => {
  const router = useRouter();
  const { meData, fetching } = useIsAuth();
  const id = parseInt(router.query.id as string);

  const [, updatePost] = useUpdatePostMutation();
  const [{ data: postData, fetching: postFetching }] = usePostQuery({
    variables: {
      id
    }
  })

  return meData && !fetching && postData?.post && !postFetching ? <Layout><Formik initialValues={{ text: postData.post.text, title: postData.post.title }} onSubmit={async (values) => {
    const response = await updatePost({ id, input: values })
    if (!response.error)
      router.push("/");
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
    <Center bg="tomato" h="100vh" color="white">
      <Spinner
        thickness="4px"
        speed="0.65s"
        emptyColor="gray.200"
        color="black"
        size="xl"
      />
    </Center>

}

export default withUrqlClient(createUrqlClient)(EditPost);