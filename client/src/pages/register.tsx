import { Button } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import React from 'react';
import InputField from '../components/InputField';

const Register = () => {

  return (
    <Formik initialValues={{ username: '', password: '' }} onSubmit={(values) => console.log(values)}>
      {({ isSubmitting, values, handleChange }) =>
        <Form>
          <InputField name="username" placeholder="johndoe" label="Username" />
          <InputField name="password" placeholder="password" label="Password" type="password" />
          <Button variantColor="teal" mt={5} isLoading={isSubmitting} type="submit">Register</Button>
        </Form>
      }
    </Formik>
  )
}

export default Register