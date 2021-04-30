import { Button } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { useRouter } from "next/router";
import React from 'react';
import InputField from '../components/InputField';
import { MeDocument, MeQuery, useRegisterMutation } from "../generated/graphql";
import { toErrorMap } from "../utils/toErrorMap";
import { withApollo } from "../utils/withApollo";

const Register = () => {
  const router = useRouter();
  const [register] = useRegisterMutation();
  return (
    <Formik initialValues={{ username: '', password: '', email: '' }} onSubmit={async (values, { setErrors }) => {
      const response = await register({
        variables: { input: values }, update(cache, { data }) {
          cache.writeQuery<MeQuery>({
            query: MeDocument,
            data: {
              __typename: "Query",
              me: data?.register?.user
            }
          })
        }
      });
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
          <Button colorScheme="orange" mt={5} isLoading={isSubmitting} type="submit">Register</Button>
        </Form>
      }
    </Formik>
  )
}

export default withApollo({ ssr: false })(Register)