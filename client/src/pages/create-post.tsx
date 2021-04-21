import { Button } from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import { withUrqlClient } from "next-urql";
import { useRouter } from 'next/router';
import React from 'react';
import InputField from '../components/InputField';
import { useCreatePostMutation } from '../generated/graphql';
import { createUrqlClient } from "../utils/createUrqlClient";

const CreatePost = () => {
  const router = useRouter();
  const [, createPost] = useCreatePostMutation();
  return <Formik initialValues={{ text: '', title: '' }} onSubmit={async (values) => {
    await createPost({ input: values })
    router.push("/");
  }}>
    {({ isSubmitting }) =>
      <Form>
        <InputField name="title" placeholder="title" label="Title" />
        <InputField name="text" placeholder="text" label="Text" textarea />
        <Button colorScheme="teal" m={5} isLoading={isSubmitting} type="submit">Create Post</Button>
      </Form>
    }
  </Formik>;
}

export default withUrqlClient(createUrqlClient)(CreatePost);