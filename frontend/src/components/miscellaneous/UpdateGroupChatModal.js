import { Box, Button, ButtonSpinner, FormControl, IconButton, Input, Spinner, useDisclosure, useToast } from '@chakra-ui/react'
import React, { useState } from 'react'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react'
import { ViewIcon } from '@chakra-ui/icons';
import { ChatState } from '../../Context/ChatProvider';
import UserBadgeItem from '../UserAvatar/UserBadgeItem';
import axios from 'axios';
import UserListItem from '../UserAvatar/UserListItem';

const UpdateGroupChatModal = ({fetchAgain, setFetchAgain, fetchMessages}) => {
    const { isOpen, onClose, onOpen } = useDisclosure();
    const [groupChatName, setGroupChatName] = useState();
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(false);
    const [searchResult, setSearchResult] = useState([]);
    const [renameLoading, setRenameLoading]  = useState(false);
    const { user, selectedChat, setSelectedChat} = ChatState();
    const toast = useToast();
    const handleRename = async() => {
        if(!groupChatName) return;
        try {
        setRenameLoading(true);
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };
        const { data } = await axios.put("/api/chat/rename",{
            chatId: selectedChat._id,
            chatName: groupChatName,
        }, config);
        setSelectedChat(data);
        setFetchAgain(!fetchAgain);
        setRenameLoading(false);
      } catch (error) {
        toast({
          title: "Error Occured!",
          description: error.response.data.message,
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
        setRenameLoading(false)
      }
      setGroupChatName("");
    }

    const handleRemove = async(user1) => {
        if(selectedChat.groupAdmin._id !==  user._id && user._id !== user1._id) {
        toast({
            title: "Only admins can remove someone!",
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom",
            });
            return;
        }

        try {
        setLoading(true);
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };
        const { data } = await axios.put("/api/chat/groupremove",{
            chatId: selectedChat._id,
            userId: user1._id,
        }, config);
        (user._id === user1._id) ? setSelectedChat() : setSelectedChat(data);
        setFetchAgain(!fetchAgain);
        fetchMessages();
        setLoading(false);
      } catch (error) {
        toast({
          title: "Error Occured!",
          description: error.response.data.message,
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
        setLoading(false)
      }
    }

    const handleAddUser = async(user1) => {
        if(selectedChat.users.find((u) => u._id === user1._id)) {
            toast({
            title: "User already exists in the group!",
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom",
            });
            return;
        }

        if(selectedChat.groupAdmin._id !==  user._id) {
        toast({
            title: "Only admins can add someone!",
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom",
            });
            return;
        }

        try {
        setLoading(true);
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };
        const { data } = await axios.put("/api/chat/groupadd",{
            chatId: selectedChat._id,
            userId: user1._id,
        }, config);
        setSelectedChat(data);
        setFetchAgain(!fetchAgain);
        setLoading(false);
      } catch (error) {
        toast({
          title: "Error Occured!",
          description: error.response.data.message,
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
        setLoading(false)
      }
    }
  return (
    <>
      <IconButton display={{base: "flex"}} icon={<ViewIcon />} onClick={onOpen} />

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{selectedChat.chatName}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
                <Box width="100%" display="flex" flexWrap="wrap" paddingBottom={3}>
                    {selectedChat.users.map((u) => (
                    <UserBadgeItem
                    key={user._id}
                    user={u}
                    handleFunction={()=> handleRemove(u)}
                    />
                  ))}
                </Box>
                <FormControl display="flex">
                    <Input placeholder="Chat Name" marginBottom={3} value={groupChatName} onChange={(e)=> setGroupChatName(e.target.value)} />
                    <Button
                    variant="solid"
                    colorScheme="teal"
                    marginLeft={1}
                    isLoading={renameLoading}
                    onClick={() => handleRename()}
                    >
                        Update   
                    </Button>
                </FormControl>
                <FormControl>
                    <Input placeholder="Add User to Group" marginBottom={1} onChange={(e)=> setSearch(e.target.value)} />
                </FormControl>
                {loading ? (<Spinner size="lg" />): (
                    searchResult?.map((user) => (
                        <UserListItem
                            key={user._id}
                            user={user}
                            handleFunction={() => handleAddUser(user)}
                        />
                    ))
                )}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='red' mr={3} onClick={() => handleRemove(user)}>
              Leave Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default UpdateGroupChatModal
