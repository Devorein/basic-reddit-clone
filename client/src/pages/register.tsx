import { Button } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import React from 'react';
import InputField from '../components/InputField';
import { useRegisterMutation } from "../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";
import { toErrorMap } from "../utils/toErrorMap";

const Register = () => {
  const router = useRouter();
  const [, register] = useRegisterMutation();
  return (
    <Formik initialValues={{ username: '', password: '', email: '' }} onSubmit={async (values, { setErrors }) => {
      const response = await register({ input: values });
      if (response.data?.register.errors)
        setErrors(toErrorMap(response.data.register.errors));
      else if (response.data?.register.user) {
        router.push("/")
      }
    }}>
      {({ isSubmitting }) =>
        <Form>
          <InputField name="username" placeholder="johndoe" label="Username" />
          <InputField name="email" placeholder="email" label="Email" />
          <InputField name="password" placeholder="password" label="Password" type="password" />
          <Button colorScheme="teal" mt={5} isLoading={isSubmitting} type="submit">Register</Button>
        </Form>
      }
    </Formik>
  )
}

export default withUrqlClient(createUrqlClient)(Register)