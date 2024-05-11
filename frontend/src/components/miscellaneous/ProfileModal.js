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
} from '@chakra-ui/react';
import "./ProfileModal.css";

const ProfileModal = ({user, children}) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <div>
        {children ? 
            (<span onClick={onOpen}>{children}</span>):
            (<IconButton d={{base: "flex"}} icon={<ViewIcon />} onClick={onOpen} />)
        }
        <Modal isOpen={isOpen} onClose={onClose}
            size="sm"
            isCentered
        >
        <ModalOverlay />
        <ModalContent>
            {/* <ModalHeader
                fontSize="40px"
                fontFamily="Work sans"
                display="flex"
                justifyContent="center"
            >
                {user.name}</ModalHeader> */}
            {/* <ModalCloseButton /> */}

            <div class="profile-card">
        <div class="image">
            <Image
                    class="profile-img"
                    borderRadius="full"
                    boxSize="150px"
                    src={user.pic}
                    alt={user.name}
                />
            {/* <img src="profile_img.jpg" alt="Profile Image" class="profile-img" /> */}
        </div>
        <div class="text-data">
            <span class="name">{user.name}</span>
            <span class="job">{user.email}</span>
        </div>
        {/* <div class="media-buttons">
            <a href="#" style="background-color: #3963f8;" class="link">
                <i class='bx bxl-facebook'></i>
            </a>
            <a href="#" style="background-color: #1da1f2;" class="link">
                <i class='bx bxl-twitter' ></i>
            </a>
            <a href="#" style="background-color: #d32fd6;" class="link">
                <i class='bx bxl-instagram' ></i>
            </a>
            <a href="#" style="background-color: #3664be ;" class="link">
                <i class='bx bxl-linkedin' ></i>
            </a>
            <a href="#" style="background-color: #e33517 ;" class="link">
                <i class='bx bxl-youtube' ></i>
            </a>
        </div> */}
        <div class="buttons">
            <button class="button">Subscribe</button>
            <button class="button">Message</button>
        </div>
        <div class="analytics">
            <div class="data">
                <i class='bx bx-heart'></i>
                <span class="number">60k</span>
            </div>
            <div class="data">
                <i class='bx bx-message-rounded'></i>
                <span class="number">20k</span>
            </div>
            <div class="data">
                <i class='bx bx-share'></i>
                <span class="number">1k</span>
            </div>
        </div>
    
            </div>

            {/* <ModalBody
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
            </ModalBody> */}
            {/* <ModalFooter>
                <Button colorScheme='blue' mr={3} onClick={onClose}>
                Close
                </Button>
            </ModalFooter> */}
        </ModalContent>
      </Modal>
      
    </div>
  )
}

export default ProfileModal
