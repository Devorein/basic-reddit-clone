import { Button } from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import { withUrqlClient } from 'next-urql';
import React, { useState } from 'react';
import InputField from '../components/InputField';
import { useForgotPasswordMutation } from '../generated/graphql';
import { createUrqlClient } from '../utils/createUrqlClient';

const ForgotPassword: React.FC<{}> = ({ }) => {
  const [sentEmail, setSentEmail] = useState(false);
  const [, forgotPassword] = useForgotPasswordMutation()
  return (
    <Formik initialValues={{ email: '' }} onSubmit={async (values) => {
      await forgotPassword(values);
      setSentEmail(true);
    }}>
      {({ isSubmitting }) =>
        sentEmail ? <div>A link to change your password has been sent to your email</div> : <Form>
          <InputField name="email" placeholder="email" label="Email" />
          <Button isLoading={isSubmitting} colorScheme="teal" m={5} type="submit">Forgot Password?</Button>
        </Form>
      }
    </Formik>
  )
}

export default withUrqlClient(createUrqlClient)(ForgotPassword)