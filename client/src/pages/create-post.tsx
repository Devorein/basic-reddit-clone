import { Button } from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import React from 'react';
import InputField from '../components/InputField';

const CreatePost = () => {
  return <Formik initialValues={{ text: '', title: '' }} onSubmit={async (values, { setErrors }) => {

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

export default CreatePost