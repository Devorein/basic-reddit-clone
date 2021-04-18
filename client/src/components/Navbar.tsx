import { Box, Flex, Link } from '@chakra-ui/react';
import NextLink from "next/link";
import React from 'react';
import { useMeQuery } from '../generated/graphql';

interface NavbarProps {

}

const Navbar: React.FC<NavbarProps> = ({ }) => {
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
    body = <Box>{data.me.username}</Box>
  }
  return (<Flex bg="tomato" p={4}>
    <Box ml="auto" color="white">
      {body}
    </Box>
  </Flex>);
}

export default Navbar