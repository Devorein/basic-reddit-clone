import { Button } from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import React from 'react';
import InputField from '../components/InputField';
import { useForgotPasswordMutation } from '../generated/graphql';

const ForgotPassword: React.FC<{}> = ({ }) => {
  const [, forgotPassword] = useForgotPasswordMutation()
  return (
    <Formik initialValues={{ email: '' }} onSubmit={async (values) => {
      forgotPassword({ email: values.email });
    }}>
      {({ isSubmitting }) =>
        <Form>
          <InputField name="email" placeholder="email" label="Email" />
          <Button isLoading={isSubmitting} colorScheme="teal" m={5} type="submit">Forgot Password?</Button>
        </Form>
      }
    </Formik>
  )
}

export default ForgotPassword