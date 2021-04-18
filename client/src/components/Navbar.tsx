import { Box, Button, Flex, Link } from '@chakra-ui/react';
import NextLink from "next/link";
import React from 'react';
import { useLogoutMutation, useMeQuery } from '../generated/graphql';

interface NavbarProps {

}

const Navbar: React.FC<NavbarProps> = ({ }) => {
  const [{ fetching: logoutFetching }, logout] = useLogoutMutation();
  const [{ data, fetching }] = useMeQuery();
  let body = null;

  if (fetching) {

  } else if (!data?.me) {
    body = <>
      <NextLink href="/register">
        <Link mr="4">Register</Link>
      </NextLink>
      <NextLink href="/login">
        <Link mr="4">Login</Link>
      </NextLink>
    </>
  } else {
    body = <Flex>
      <Box mr="3" >{data.me.username}</Box>
      <Button isLoading={logoutFetching} onClick={() => logout()} variant="link">Logout</Button>
    </Flex>
  }
  return (<Flex bg="tomato" p={4}>
    <Box ml="auto" color="white">
      {body}
    </Box>
  </Flex>);
}

export default Navbar