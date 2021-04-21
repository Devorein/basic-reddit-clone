import { Button, Flex } from "@chakra-ui/react";
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
      else if (response.data?.login.user) {
        if (typeof router.query.next === 'string')
          router.push(router.query.next)
        else router.push("/")
      }

    }}>
      {({ isSubmitting }) =>
        <Form>
          <InputField name="usernameOrEmail" placeholder="johndoe" label="Username Or Email" />
          <InputField name="password" placeholder="password" label="Password" type="password" />
          <Flex justifyContent="space-between">
            <Button colorScheme="teal" m={5} isLoading={isSubmitting} type="submit">Login</Button>
            <Button colorScheme="teal" m={5} onClick={() => router.push("/forgot-password")}>Forgot Password?</Button>
          </Flex>
        </Form>
      }
    </Formik>
  )
}

export default withUrqlClient(createUrqlClient)(Login);