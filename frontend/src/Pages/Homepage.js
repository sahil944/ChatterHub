import {React, useEffect} from 'react';
import { 
  Container,
  Box,
  Text,
  Tabs, TabList, TabPanels, Tab, TabPanel,
} from '@chakra-ui/react';
import Login from '../components/Authentication/Login';
import Signup from '../components/Authentication/Signup';
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

const Homepage = () => {
  const history = useHistory();
  useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));

        if(userInfo){
            history.push("/chats");
        }
    }, [history]);

  return <Container maxW='xl' centerContent>
    <Box
      display="flex"
      justifyContent="center"
      bg={"white"}
      padding={3}
      width="100%"
      margin = "40px 0 15px 0"
      borderRadius="lg"
      borderWidth="1px"
    >
      <Text fontSize="4xl" fontFamily="work sans" color="black">ChatterHub</Text>
    </Box>
    <Box
      bg="white"
      width="100%"
      padding={4}
      borderRadius="lg"
      borderWidth="1px"
      marginBottom="20px"   
    >
      <Tabs variant='soft-rounded'>
  <TabList>
    <Tab width="50%">Login</Tab>
    <Tab width="50%">Sign Up</Tab>
  </TabList>
  <TabPanels>
    <TabPanel>
      <Login />
    </TabPanel>
    <TabPanel>
      <Signup />
    </TabPanel>
  </TabPanels>
</Tabs>
    </Box>
  </Container>
}

export default Homepage
