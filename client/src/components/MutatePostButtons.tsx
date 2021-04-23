import { DeleteIcon, EditIcon } from '@chakra-ui/icons';
import { Flex, IconButton, Link } from '@chakra-ui/react';
import NextLink from "next/link";
import React from 'react';
import { useDeletePostMutation } from '../generated/graphql';

interface MutatePostButtonsProps {
  id: number
}

export const MutatePostButtons: React.FC<MutatePostButtonsProps> = ({ id }) => {
  const [, deletePost] = useDeletePostMutation();

  return <Flex cursor="pointer" m={5} align="center" direction="column" justifyContent="center">
    <NextLink href="/post/edit/[id]" as={`/post/edit/${id}`}>
      <IconButton m={3} as={Link} aria-label="Update Post" colorScheme="blue" icon={<EditIcon size={20} />} />
    </NextLink>
    <IconButton m={3} aria-label="Delete Post" colorScheme="red" icon={<DeleteIcon size={20} />}
      onClick={async () => {
        await deletePost({
          id
        })
      }}
    />
  </Flex>;
}