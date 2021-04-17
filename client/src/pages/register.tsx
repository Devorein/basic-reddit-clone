import { Button } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import React from 'react';
import { useMutation } from "urql";
import InputField from '../components/InputField';

const REGISTER_MUTATION = `
mutation CreateUser($username: String!, $password:String!){
  register(input:{
    username: $username,
    password: $password
  }){
    user{
      username
      updatedAt
      id
      createdAt
    }
    errors{
      field
      message
    }
  }
}`

const Register = () => {
  const [, register] = useMutation(REGISTER_MUTATION);
  return (
    <Formik initialValues={{ username: '', password: '' }} onSubmit={(values) => register(values)}>
      {({ isSubmitting, values, handleChange }) =>
        <Form>
          <InputField name="username" placeholder="johndoe" label="Username" />
          <InputField name="password" placeholder="password" label="Password" type="password" />
          <Button colorScheme="teal" mt={5} isLoading={isSubmitting} type="submit">Register</Button>
        </Form>
      }
    </Formik>
  )
}

export default Register