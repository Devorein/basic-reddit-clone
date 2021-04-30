import { DeleteIcon, EditIcon } from '@chakra-ui/icons';
import { Flex, IconButton, Link } from '@chakra-ui/react';
import NextLink from "next/link";
import React from 'react';
import { useDeletePostMutation, useMeQuery } from '../generated/graphql';

interface MutatePostButtonsProps {
  id: number
  creatorId: number
  direction?: 'row' | 'column'
}

export const MutatePostButtons: React.FC<MutatePostButtonsProps> = ({ direction, id, creatorId }) => {
  const [deletePost] = useDeletePostMutation();
  const { data: meData } = useMeQuery();

  return meData?.me && creatorId === meData.me.id ? <Flex cursor="pointer" m={5} align="center" direction={direction ?? "column"} justifyContent="center">
    <NextLink href="/post/edit/[id]" as={`/post/edit/${id}`}>
      <IconButton m={3} as={Link} aria-label="Update Post" colorScheme="blue" icon={<EditIcon size={20} />} />
    </NextLink>
    <IconButton m={3} aria-label="Delete Post" colorScheme="red" icon={<DeleteIcon size={20} />}
      onClick={async () => {
        await deletePost({
          variables: {
            id
          }
        })
      }}
    />
  </Flex> : null;
}