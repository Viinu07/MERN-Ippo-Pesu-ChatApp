import React from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  IconButton,
  Button,
  Image,
  Text,
} from '@chakra-ui/react';
import { ViewIcon } from '@chakra-ui/icons';

/* This component is used to display the profile details */
const ProfileModal = ({ user, children }) => {
  //console.log('ProfielModal users', user);

  const { isOpen, onOpen, onClose } = useDisclosure(); //Modal imported from Chakra_UI
  return (
    <>
      {children ? (
        <span onClick={onOpen}>{children}</span>
      ) : (
        <IconButton
          display={{ base: 'flex' }}
          icon={<ViewIcon />}
          onClick={onOpen}
        />
      )}
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent height="320px">
          <ModalHeader
            fontFamily="poppins"
            fontSize="25px"
            display="flex"
            justifyContent="center"
          >
            {user.name}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody
            display="flex"
            flexDir="column"
            alignItems="center"
            justifyContent="space-between"
          >
            <Image
              borderRadius="full"
              boxSize="100px"
              src={user.pic}
              alt={user.name}
            />
            <Text fontSize={{ base: '20px', md: '25px' }} fontFamily="poppins">
              {user.email}
            </Text>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="green" onClick={onClose} variant="ghost">
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
export default ProfileModal;
