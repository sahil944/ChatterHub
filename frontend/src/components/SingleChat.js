import React, { useEffect, useState } from 'react'
import { ChatState } from '../Context/ChatProvider'
import { Box, Button, FormControl, IconButton, Input, InputGroup, InputRightElement, Spinner, Text, useToast } from '@chakra-ui/react'
import { ArrowBackIcon, ArrowForwardIcon } from '@chakra-ui/icons';
import { getSender, getSenderFullDetails } from '../Config/ChatLogics';
import ProfileModal from './miscellaneous/ProfileModal';
import UpdateGroupChatModal from './miscellaneous/UpdateGroupChatModal';
import axios from 'axios';
import './style.css';
import ScrollableChat from './ScrollableChat';
import io from 'socket.io-client';
import Lottie from 'react-lottie';
import animationDate from '../images/typingAnimation.json';

const ENDPOINT = "http://localhost:5000";
var socket, selectedChatCompare;

const SingleChat = ({fetchAgain, setFetchAgain}) => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [newMessage, setNewMessage] = useState('');
    const [socketConnected, setSocketConnected] = useState(false);
    const [typing, setTyping] = useState(false);
    const [isTyping, setIsTyping] = useState(false);

    const {user, selectedChat, setSelectedChat, notification, setNotification} = ChatState();
    const toast = useToast();

    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: animationDate,
        rendererSettings: {
            preserveAspectRatio: "xMidYMid slice",
        },
    }

    useEffect(() => {
        socket = io(ENDPOINT);
        socket.emit('setup', user);
        socket.on('connected', () => setSocketConnected(true));
        socket.on('typing', () => setIsTyping(true));
        socket.on('stop typing', () => setIsTyping(false));
    }, []);

    const fetchMessages = async() => {
        if(!selectedChat) return;
        try{
            setLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                },
            };

            const {data} = await axios.get(`/api/message/${selectedChat._id}`, config);
            setMessages(data);
            setLoading(false);
            socket.emit('join chat', selectedChat._id);
            }catch(error){
            toast({
                title: 'Failed to load chats!', 
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            setLoading(false);
            return;
        }
    }

    useEffect(()=>{
      fetchMessages();
      selectedChatCompare = selectedChat;
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[selectedChat]);

    useEffect(() => {
        socket.on('message received', (newMessageRead) => {
            if(!selectedChat || selectedChatCompare._id !== newMessageRead.chat._id) {
                if(!notification.includes(newMessageRead)){
                    setNotification([newMessageRead, ...notification]);
                    setFetchAgain(!fetchAgain);
                }
            }else {
                setMessages([...messages, newMessageRead]);
            }
        })   
    })

    const submitMessage = async(event) => {
        if(event.key === "Enter" && newMessage){
            socket.emit('stop typing', selectedChat._id);
            try{
                // setLoading(true);
                const config = {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${user.token}`
                    },
                };
                setNewMessage("");
                const {data} = await axios.post("/api/message",{
                    content: newMessage,
                    chatId: selectedChat._id,
                } ,config);
                socket.emit('new message', data);
                setMessages([...messages, data]);
                // setLoading(false);
                }catch(error){
                toast({
                    title: 'Failed to send message!', 
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                    position: "bottom",
                });
                // setLoading(false)
                return;
            }
        }
    }

    const typingHandler = (e) => {
        setNewMessage(e.target.value);
        
        if(!socketConnected) return;
        
        if(!typing) {
            setTyping(true);
            socket.emit('typing', selectedChat._id);
        }

        let lastTypingTime = new Date().getTime();
        var timerLength = 3000;
        setTimeout(() => {
            var timeNow = new Date().getTime();
            var timeDiff = timeNow - lastTypingTime;

            if(timeDiff >= timerLength && typing) {
                socket.emit('stop typing', selectedChat._id);
                setTyping(false);
            }
        }, timerLength);
    }
  return (
    <>
        {selectedChat ? (
            <>
                <Text
                    fontSize={{base: "28px", md: "30px"}}
                    paddingBottom={3}
                    paddingX={2}
                    width="100%"
                    fontFamily="Work sans"
                    display="flex"
                    alignItems="center"
                    justifyContent={{base: "space-between"}}
                >
                    <IconButton
                        display={{base: "flex", md: "none"}}
                        icon={<ArrowBackIcon />}
                        onClick={() => setSelectedChat("")} 
                    />   

                    {!selectedChat.isGroupChat? (
                        <>
                            {getSender(user, selectedChat.users)}
                            <ProfileModal user={getSenderFullDetails(user, selectedChat.users) } />
                        </>
                    ): (
                        <>
                        {selectedChat.chatName.toUpperCase()}
                        <UpdateGroupChatModal fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} fetchMessages={fetchMessages} />
                        </>
                    )}
                </Text>
                <Box
                    display="flex"
                    flexDir="column"
                    width="100%"
                    height="100%"
                    overflowY="hidden"
                    borderRadius="lg"
                    justifyContent="flex-end"
                    background="#E8E8E8"
                    padding={3}
                >
                    {loading ? ( <Spinner size="xl" width={20} height={20} alignSelf="center" margin="auto" />): (
                        <div className="messages">
                            <ScrollableChat messages={messages} />
                        </div>
                    )}
                    <FormControl onKeyDown={submitMessage} isRequired marginTop={3}>
                        {isTyping ?  
                            <div> 
                                <Lottie
                                    options={defaultOptions}
                                    width={70}
                                    style={{marginLeft: 0, marginBottom: 15}} 
                                />
                            </div> : <></>
                        }
                        <InputGroup>
                            <Input placeholder="Enter a message.." id="sendMessage" variant="filled" value={newMessage} background="#E0E0E0" onChange={typingHandler} />
                            <InputRightElement
                                display={newMessage? 'flex': 'none'}
                                background="white"
                                width='2.5rem'
                                h='1.75rem'
                                margin={1.5}
                                borderRadius="lg"
                            >
                            <ArrowForwardIcon boxSize={6} color={'green.500'} />
                            </InputRightElement>
                        </InputGroup>
                    </FormControl>
                </Box>
            </>
        ) : (
            <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                height="100%"
            >
                <Text
                    fontSize="3xl"
                    paddingBottom={3}
                    fontFamily="Work sans"
                >
                    Click on a user to start Chatting...
                </Text>
            </Box>
        )}
    </>
  )
}

export default SingleChat
