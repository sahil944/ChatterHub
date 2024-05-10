import { FormControl, FormLabel, Input,
    VStack, 
    InputGroup,
    InputRightElement,
    Button,
    Icon,
    useToast
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons'
import React, { useState } from 'react'
import axios from 'axios';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';

const Signup = () => {
    const [show, setShow] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [pic, setPic] = useState(undefined);
    const [loading, setLoading] = useState(false);
    const toast = useToast();
    const history = useHistory();

    const postDetails = (pics) => {
        setLoading(true);
        if(pics === undefined){
            toast({
                title: 'Please select an Image!.', 
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            return;
        }

        if (pics.type === "image/jpeg" || pics.type === "image/png"){
            const data = new FormData();
            data.append("file",pics);
            data.append("upload_preset", "chat-app");
            data.append("cloud_name", "chatter-hub");
            fetch("https://api.cloudinary.com/v1_1/chatter-hub/image/upload", {
                method: "post",
                body: data,
            }).then((res) => res.json())
            .then(data => {
                setPic(data.url.toString());
                 console.log(data.url.toString());
                setLoading(false);
            });
        }
    }
    const submitHandler = async() => {
        setLoading(true);
        if(!name || !email || !password || !confirmPassword){
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
        if(password !== confirmPassword){
            toast({
                title: 'Password do not match.', 
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
            const { data } = await axios.post("api/user",
                {name, email, password, pic},
                config
            );

            toast({
                title: 'User registration successful.', 
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
            <FormControl id="name" isRequired>
                <FormLabel>Name</FormLabel>
                <Input type='text' placeholder='Enter your name' value={name} onChange={(e) => setName(e.target.value)} />
            </FormControl>
            <FormControl id="email" isRequired>
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
            <FormControl id="password" isRequired>
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
            <FormControl isRequired>
                <FormLabel>Confirm password</FormLabel>
                <InputGroup>
                    <Input type={show?'text':'password'} placeholder='Enter confirm password' value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                    <InputRightElement>
                        <Icon h="1.75rem" size="sm" cursor="pointer" onClick={(e)=> setShow(!show)}>
                            {show?<ViewOffIcon />: <ViewIcon />}
                        </Icon>
                    </InputRightElement>
                </InputGroup>
            </FormControl>
            <FormControl>
                <FormLabel>Upload your picture</FormLabel>
                <Input 
                    type='file'
                    p={1.5}
                    accept='image/*'
                    defaultValue={pic || ''} 
                    onChange={(e) => postDetails(e.target.files[0])}
                />
            </FormControl>
            <Button
                colorScheme='blue'
                width="100%"
                marginTop={15}
                onClick={submitHandler}
                isLoading={loading}
            >
                Sign Up
            </Button>
        </VStack>
    </div>
  )
}

export default Signup;