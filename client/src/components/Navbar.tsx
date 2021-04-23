import { Box, Button, Flex, Heading, Link } from '@chakra-ui/react';
import NextLink from "next/link";
import React from 'react';
import { useLogoutMutation, useMeQuery } from '../generated/graphql';
import { isServer } from '../utils/isServer';

interface NavbarProps {

}

const Navbar: React.FC<NavbarProps> = ({ }) => {
  const [{ fetching: logoutFetching }, logout] = useLogoutMutation();
  const [{ data, fetching }] = useMeQuery({
    pause: isServer()
  });
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
    <NextLink href="/"><Link><Heading>Lireddit</Heading></Link></NextLink>
    <Box ml="auto" color="white">
      {body}
    </Box>
  </Flex>);
}

export default Navbar