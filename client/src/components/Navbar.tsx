import { useApolloClient } from '@apollo/client';
import { Box, Button, Flex, Heading, Link } from '@chakra-ui/react';
import NextLink from "next/link";
import React from 'react';
import { useLogoutMutation, useMeQuery } from '../generated/graphql';
import { isServer } from '../utils/isServer';

const Navbar = () => {
  const apolloClient = useApolloClient()
  const [logout, { loading: logoutFetching }] = useLogoutMutation();
  const { data: meData } = useMeQuery({
    skip: isServer()
  });
  let body = null;

  if (!meData?.me) {
    body = <>
      <NextLink href="/register">
        <Link mr="4">Register</Link>
      </NextLink>
      <NextLink href="/login">
        <Link mr="4">Login</Link>
      </NextLink>
    </>
  } else {
    body = <Flex align="center">
      <NextLink href="/create-post"><Button bg="tomato" m={5}>Create Post</Button></NextLink>
      <Box mr={5}>{meData.me.username}</Box>
      <Button isLoading={logoutFetching} onClick={async () => {
        await logout();
        await apolloClient.resetStore();
      }} variant="link">Logout</Button>
    </Flex>
  }
  return (<Flex bg="tomato" p={4} align="center">
    <NextLink href="/"><Link><Heading>Lireddit</Heading></Link></NextLink>
    <Box ml="auto" color="white">
      {body}
    </Box>
  </Flex>);
}

export default Navbar