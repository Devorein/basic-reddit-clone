import { Button } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import React from 'react';
import InputField from '../components/InputField';
import { useLoginMutation } from "../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";
import { toErrorMap } from "../utils/toErrorMap";

const Login = () => {
  const router = useRouter();
  const [, login] = useLoginMutation();
  return (
    <Formik initialValues={{ usernameOrEmail: '', password: '' }} onSubmit={async (values, { setErrors }) => {
      const response = await login(values);
      if (response.data?.login.errors)
        setErrors(toErrorMap(response.data.login.errors));
      else if (response.data?.login.user)
        router.push("/")
    }}>
      {({ isSubmitting }) =>
        <Form>
          <InputField name="usernameOrEmail" placeholder="johndoe" label="Username Or Email" />
          <InputField name="password" placeholder="password" label="Password" type="password" />
          <Button colorScheme="teal" mt={5} isLoading={isSubmitting} type="submit">Login</Button>
        </Form>
      }
    </Formik>
  )
}

export default withUrqlClient(createUrqlClient)(Login);