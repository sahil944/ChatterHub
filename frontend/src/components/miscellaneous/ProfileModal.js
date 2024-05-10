import React from 'react'
import { IconButton, useDisclosure, Image, Text} from '@chakra-ui/react';
import { ViewIcon } from '@chakra-ui/icons';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton, Button
} from '@chakra-ui/react'

const ProfileModal = ({user, children}) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <div>
        {children ? 
            (<span onClick={onOpen}>{children}</span>):
            (<IconButton d={{base: "flex"}} icon={<ViewIcon />} onClick={onOpen} />)
        }
        <Modal isOpen={isOpen} onClose={onClose}
            size="lg"
            isCentered
        >
        <ModalOverlay />
        <ModalContent height="410px">
            <ModalHeader
                fontSize="40px"
                fontFamily="Work sans"
                display="flex"
                justifyContent="center"
            >
                {user.name}</ModalHeader>
            <ModalCloseButton />

            <ModalBody
                display="flex"
                alignItems="center"
                flexDirection="column"
                justifyContent="space-between"
            >
                <Image
                    borderRadius="full"
                    boxSize="150px"
                    src={user.pic}
                    alt={user.name}
                />
                <Text>{user.email}</Text>
            </ModalBody>

            <ModalFooter>
                <Button colorScheme='blue' mr={3} onClick={onClose}>
                Close
                </Button>
            </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  )
}

export default ProfileModal
