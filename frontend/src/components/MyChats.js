import React, { useEffect, useState } from 'react';
import { ChatState } from '../Context/ChatProvider';
import { Avatar, Box, Button, Stack, Text, useToast } from '@chakra-ui/react';
import axios from 'axios';
import { AddIcon } from '@chakra-ui/icons';
import ChatLoading from './ChatLoading';
import AddGroupChatModal from './miscellaneous/AddGroupChatModal';
import { getSender, getSenderFullDetails } from '../Config/ChatLogics';
import dateFormat from "dateformat";

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
                background={selectedChat === chat? "#75a19f": "#E8E8E8"}
                color={selectedChat === chat? "white": "black"}
                borderRadius="lg"
                // width="100%"
                display="flex"
                // alignItems="center"
                // marginBottom={2}
                key={chat._id}
              >
                
                <Avatar
                  marginRight={2}
                  size="sm"
                  cursor="pointer"
                  name={chat.isGroupChat ? chat.chatName : getSender(user, chat.users)}
                  src={chat.isGroupChat ? './../images/groups-icon-15.png' : getSenderFullDetails(user, chat.users).pic} />


                <Box
                  display="flex"
                  flexDir="column"
                >

                  <Text>
                    <span>
                      {chat.isGroupChat ? chat.chatName : getSender(user, chat.users)}
                    </span>
                    <span
                      style={{
                                    paddingLeft: '30px',
                                    // paddingRight: '0',
                                    // marginRight: '0',
                                    // paddingBottom: '0px',
                                    fontSize: '11px',
                                    // justifyContent: 'right',
                                    // display: 'flex'
                                    // margin: '5px 0px 0px 5px',
                            }}
                    >
                      {dateFormat(chat.latestMessage.createdAt, "h:MM TT")}
                    </span>
                  </Text>

                  <Text
                    display="flex"
                    fontSize="xs"
                  >
                    <span>{chat.isGroupChat ? (chat.latestMessage.sender._id === user._id ? '~You:' : `~${chat.latestMessage.sender.name}:`): ''}</span>
                    <Text paddingLeft={1}>{chat.latestMessage.content}</Text>
                  </Text>
                </Box>
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
