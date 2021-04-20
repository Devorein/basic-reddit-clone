import { Button } from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import { NextPage } from 'next';
import React from 'react';
import InputField from '../../components/InputField';


const ChangePassword: NextPage<{ token: string }> = ({ token }) => {
  return <Formik initialValues={{ newPassword: '' }} onSubmit={async (values, { setErrors }) => {
    // const response = await login(values);
    // if (response.data?.login.errors)
    //   setErrors(toErrorMap(response.data.login.errors));
    // else if (response.data?.login.user)
    //   router.push("/")
  }}>
    {({ isSubmitting }) =>
      <Form>
        <InputField name="newPassword" placeholder="new password" label="New Password" type="password" />
        <Button colorScheme="teal" mt={5} isLoading={isSubmitting} type="submit">Change Password</Button>
      </Form>
    }
  </Formik>;
}

ChangePassword.getInitialProps = ({ query }) => {
  return {
    token: query.token as string
  }
}

export default ChangePassword;