import { FormControl, FormLabel, Input,
    VStack, 
    InputGroup,
    InputRightElement,
    Button,
    Icon,
    useToast
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import React, { useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';

const Login = () => {
    const [show, setShow] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const toast = useToast();
    const history = useHistory();

    const submitHandler = async() => {
        setLoading(true);
        if(!email || !password){
            toast({
                title: 'Please fill all the fields.', 
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            setLoading(false);
            return;
        }

        try{
            const config = {
                headers:{
                    "Content-type": "application/json",
                },
            }
            const { data } = await axios.post("api/user/login",
                {email, password},
                config
            );

            toast({
                title: 'Login successful.', 
                status: 'success',
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });

            localStorage.setItem("userInfo", JSON.stringify(data));
            setLoading(false);
            history.push('/chats');
        }catch (error) {
            toast({
                title: 'Error Occured!', 
                description: error.response.data.message,
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            setLoading(false);
            return;
        }
    };

  return (
    <div>
        <VStack spacing="5px">
            <FormControl isRequired>
                <FormLabel>Email</FormLabel>
                <Input type='email' placeholder='Enter your email' value={email} onChange={(e) => setEmail(e.target.value)} />
                {/* {!isError ? (
                    <FormHelperText>
                    Enter the email you'd like to receive the newsletter on.
                    </FormHelperText>
                ) : (
                    <FormErrorMessage>Email is required.</FormErrorMessage>
                )} */}
            </FormControl>
            <FormControl isRequired>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                    <Input type={show?'text':'password'} placeholder='Enter your password' value={password} onChange={(e) => setPassword(e.target.value)} />
                    <InputRightElement >
                        <Icon 
                            h="1.75rem"
                            size="sm"
                            cursor="pointer"
                            onClick={(e)=> setShow(!show)}
                        >
                            {show?<ViewOffIcon />: <ViewIcon />}
                        </Icon>
                    </InputRightElement>
                </InputGroup>
            </FormControl>
             
            <Button
                colorScheme='blue'
                width="100%"
                marginTop={15}
                onClick={submitHandler}
                isLoading={loading}
            >
                Login
            </Button>
            <Button
                variant="solid"
                colorScheme='red'
                width="100%"
                onClick={() => {
                    setEmail("guest@example.com");
                    setPassword("123456");
                }}
            >
                Get Guest User Credentials
            </Button>
        </VStack>
    </div>
  )
}

export default Login
