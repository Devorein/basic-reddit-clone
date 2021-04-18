import { Box, Flex, Link } from '@chakra-ui/react';
import NextLink from "next/link";
import React from 'react';

interface NavbarProps {

}

const Navbar: React.FC<NavbarProps> = ({ }) => {
  return (<Flex bg="tomato" p={4}>
    <Box ml="auto" color="white">
      <NextLink href="/register">
        <Link mr="4">Register</Link>
      </NextLink>
      <NextLink href="/login">
        <Link mr="4">Login</Link>
      </NextLink>
    </Box>
  </Flex>);
}

export default Navbar