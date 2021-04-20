import { Box, Button } from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import { NextPage } from 'next';
import { withUrqlClient } from 'next-urql';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import InputField from '../../components/InputField';
import { useChangePasswordMutation } from '../../generated/graphql';
import { createUrqlClient } from '../../utils/createUrqlClient';
import { toErrorMap } from '../../utils/toErrorMap';

const ChangePassword: NextPage<{ token: string }> = ({ token }) => {
  const [, changePassword] = useChangePasswordMutation();
  const [tokenError, setTokenError] = useState<null | string>(null);
  const router = useRouter();
  return <Formik initialValues={{ newPassword: '' }} onSubmit={async (values, { setErrors }) => {
    const response = await changePassword({ newPassword: values.newPassword, token });
    if (response.data?.changePassword.errors) {
      const errorMap = toErrorMap(response.data.changePassword.errors);
      if ("token" in errorMap)
        setTokenError(errorMap.token)
      setErrors(errorMap);
    }
    else if (response.data?.changePassword.user)
      router.push("/")
  }}>
    {({ isSubmitting }) =>
      <Form>
        <InputField name="newPassword" placeholder="new password" label="New Password" type="password" />
        {tokenError && <Box mt={3} color="red">{tokenError}</Box>}
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

export default withUrqlClient(createUrqlClient)(ChangePassword as any);