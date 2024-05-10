import React from 'react'
import { ChatState } from '../Context/ChatProvider'
import { Box } from '@chakra-ui/react';
import SingleChat from './SingleChat';

const ChatBox = ({fetchAgain, setFetchAgain}) => {
  const {selectedChat}=ChatState();
  return (
    <Box
      display={{base: selectedChat ? "flex": "none", md: "flex"}}
      alignItems="center"
      flexDir="column"
      padding={3}
      borderRadius="lg"
      borderWidth="1px"
      background="white"
      width={{base: "100%", md: "68%"}}
    >
      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
    </Box>
  )
}

export default ChatBox
