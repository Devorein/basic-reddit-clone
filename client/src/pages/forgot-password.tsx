import { Button } from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import React, { useState } from 'react';
import InputField from '../components/InputField';
import { useForgotPasswordMutation } from '../generated/graphql';
import { withApollo } from '../utils/withApollo';

const ForgotPassword: React.FC<{}> = ({ }) => {
  const [sentEmail, setSentEmail] = useState(false);
  const [forgotPassword] = useForgotPasswordMutation()
  return (
    <Formik initialValues={{ email: '' }} onSubmit={async (values) => {
      await forgotPassword({ variables: values });
      setSentEmail(true);
    }}>
      {({ isSubmitting }) =>
        sentEmail ? <div>A link to change your password has been sent to your email</div> : <Form>
          <InputField name="email" placeholder="email" label="Email" />
          <Button isLoading={isSubmitting} colorScheme="orange" m={5} type="submit">Forgot Password?</Button>
        </Form>
      }
    </Formik>
  )
}

export default withApollo({ ssr: false })(ForgotPassword)
