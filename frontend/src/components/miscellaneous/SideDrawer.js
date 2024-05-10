import { BellIcon } from '@chakra-ui/icons';
import { Box,
    Button,
    Tooltip,
    Text,
    Menu, MenuButton, MenuList, MenuItem,
    Avatar,
    useDisclosure,
    Input,
    Spinner
} from '@chakra-ui/react';
import {
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  useToast
} from '@chakra-ui/react'
import React, { useState } from 'react';
import { ChatState } from '../../Context/ChatProvider';
import ProfileModal from './ProfileModal';
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import axios from 'axios';
import ChatLoading from '../ChatLoading'; 
import UserListItem from '../UserAvatar/UserListItem';
import { getSender } from '../../Config/ChatLogics';
import NotificationBadge, {Effect} from 'react-notification-badge';

const SideDrawer = () => {
    const history = useHistory();
    const [search, setSearch] = useState('');
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingChat, setLoadingChat] = useState(false);
    const { user, setSelectedChat, chats, setChats, notification, setNotification } = ChatState();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const toast = useToast();

    const logoutHandler = () => {
        localStorage.removeItem("userInfo");
        history.push("/");
    }

    const handleSearch = async() => {
        if(!search){
            toast({
                title: 'Please enter something in search!', 
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: "top-left",
            });
            return;
        }

        try {
            setLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                },
            };

            const {data} = await axios.get(`/api/user?search=${search}`, config);
            setLoading(false);
            setSearchResult(data);

        }catch(error){
            toast({
                title: 'Error ocurred!',
                description: 'Failed to load search results.', 
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: "bottom-left",
            });
            setLoading(false);
        }
    }

    const accessChat = async(userId) => {
        try{
            setLoading(true);
            const config = {
                headers: {
                    "Content-type": "application/json",
                    Authorization: `Bearer ${user.token}`
                },
            };

            const {data} = await axios.post("/api/chat", {userId}, config);
            
            if(!chats.find((c)=> c._id === data._id)) setChats([data,...chats]);

            setLoading(false);
            setSelectedChat(data);
            onClose();

        }catch(error){
            toast({
                title: 'Error fetching the chats!', 
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: "bottom-left",
            });
            setLoading(false);
            return;
        }
    }
  return (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        bg="white"
        w="100%"
        p="5px 10px 5px 10px"
        borderWidth="5px"
      >
        <Tooltip label="Search Users to chat" hasArrow placement="bottom-end">
            <Button variant="ghost" onClick={onOpen}>
                <i class="fas fa-search"></i>
                <Text
                    display={{base: "none", md: "flex"}} px="4"
                >
                    Search User
                </Text>
            </Button>
        </Tooltip>
        <Text fontSize="2xl" fontFamily="Work sans">Chatter Hub</Text>
        <div>
            <Menu>
                <MenuButton p={1}>
                    <NotificationBadge count={notification?.length} effect={Effect.SCALE} />
                    <BellIcon fontSize="2xl" m={1} />
                </MenuButton>
                <MenuList paddingLeft={2}>
                    {!notification?.length && "No New Messages"} 
                    {notification.map(n => (
                        <MenuItem 
                            key={n._id}
                            onClick={() => {
                                setSelectedChat(n.chat);
                                setNotification(notification.filter((notify) => notify!==n));
                            }}
                        >
                            {n.chat.isGroupChat? `New Message in ${n.chat.chatName}`: `New Message from ${getSender(user, n.chat.users)}`}
                        </MenuItem>
                    ))}
                </MenuList>
            </Menu>
            <Menu>
                <MenuButton as={Button} bg="white" content="cover" margin="0" padding="0" borderRadius="50%">
                    <Avatar size='sm' cursor="pointer" w="100%" name={user.name} src={user.pic} />
                </MenuButton>
                <MenuList>
                    <ProfileModal user={user}>
                        <MenuItem>My Profile</MenuItem>
                    </ProfileModal>
                    <MenuItem onClick={logoutHandler}>Logout</MenuItem> 
                </MenuList>
            </Menu>
        </div>
      </Box>
      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
            <DrawerHeader borderBottomWidth='1px'>Search Users</DrawerHeader>
            <DrawerBody>
                <Box display="flex" paddingBottom={2}>
                    <Input
                        placeholder="Search by name/email"
                        marginRight={2}
                        value={search}
                        onChange={(e) => {setSearch(e.target.value)}} 
                    />
                    <Button onClick={handleSearch}>Go</Button>
                </Box>
                {loading ? (
                    <ChatLoading />
                ): (
                    searchResult?.map((user)=> (
                        <UserListItem
                            key={user._id}
                            user={user}
                            handleFunction ={()=> accessChat(user._id)}
                        />
                    ))
                )}
                {loadingChat && <Spinner ml="auto" display="flex" />}
            </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  )
}

export default SideDrawer
