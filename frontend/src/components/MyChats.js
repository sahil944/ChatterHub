import React, { useEffect, useState } from 'react';
import { ChatState } from '../Context/ChatProvider';
import { Box, Button, Stack, Text, useToast } from '@chakra-ui/react';
import axios from 'axios';
import { AddIcon } from '@chakra-ui/icons';
import ChatLoading from './ChatLoading';
import AddGroupChatModal from './miscellaneous/AddGroupChatModal';

const MyChats = ({fetchAgain}) => {
  const [loggedUser, setLoggedUser] = useState();
  const [loading, setLoading] = useState(false);
  const { user, selectedChat, setSelectedChat, chats, setChats } = ChatState();
  const toast = useToast();

  const fetchChats = async() => {
    try{
      setLoading(true);
      const config = {
          headers: {
              Authorization: `Bearer ${user.token}`
          },
      };

      const {data} = await axios.get("/api/chat", config);
      setLoading(false);
      setChats(data);
    }catch(error){
      toast({
          title: 'Failed to load chats!', 
          status: 'error',
          duration: 5000,
          isClosable: true,
          position: "bottom-left",
      });
      setLoading(false);
      return;
    }
  }
  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
  }, [fetchAgain]);
  
  return (
    <Box
      display={{base: selectedChat? 'none': 'flex', md: "flex"}}
      flexDir="column"
      alignItems="center"
      padding="3"
      background="white"
      width={{base: '100%', md: "31%"}}
      borderRight="lg"
      borderWidth="1px"
    >
      <Box
        display="flex"
        fontSize={{base: "28px", md: "30px"}}
        fontFamily="Work sans"
        justifyContent="space-between"
        alignItems="center"
        paddingBottom={3}
        paddingX={3}
        width="100%"
      >
        My Chats
        <AddGroupChatModal>
          <Button
            display="flex"
            fontSize={{base: "17px", md: "10px", lg:"17px"}}
            rightIcon={<AddIcon />}
          >New Group Chat</Button>
        </AddGroupChatModal>
      </Box>
      <Box
        display="flex"
        flexDir="column"
        padding={3}
        background="#F8F8F8"
        width="100%"
        height="100%"
        borderRadius="lg"
        overflowY="hidden"
      >
        {chats ? (
          <Stack overflowY="scroll">
            {chats.map((chat) => (
              <Box
                onClick={()=> setSelectedChat(chat)}
                cursor="pointer"
                paddingX={3}
                paddingY={2}
                background={selectedChat === chat? "#38B2AC": "#E8E8E8"}
                color={selectedChat === chat? "white": "black"}
                borderRadius="lg"
                key={chat._id}
              >
                <Text>{chat.chatName}</Text>
              </Box>
            ))}
          </Stack>
        ):
          (<ChatLoading />)  
        }
      </Box>
    </Box>
  );
}

export default MyChats
