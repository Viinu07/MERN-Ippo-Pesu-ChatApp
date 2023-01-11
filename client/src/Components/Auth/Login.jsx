import { useState } from 'react';
import {
  FormControl,
  FormLabel,
  VStack,
  Input,
  InputGroup,
  Button,
  InputRightElement,
  useToast,
} from '@chakra-ui/react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();

  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false); //Handling the password visibility

  const toast = useToast(); //Functionality provided by the CHAKRA_UI
  const history = useHistory();

  /* Function handler */
  const handleClick = () => setShow(!show);

  /* Handling the submit form -> Validating the fields after submit and fetching the data from backend */
  const submitHandler = async () => {
    setLoading(true);
    if (!email || !password) {
      toast({
        title: 'Please fill all the fields',
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: 'bottom',
      });
      setLoading(false);
      return;
    }
    try {
      const config = {
        headers: {
          'Content-type': 'application/json',
        },
      };
      const { data } = await axios.post(
        '/api/user/login',
        {
          email,
          password,
        },
        config
      );
      toast({
        title: 'Login successful',
        status: 'success',
        duration: 5000,
        isClosable: true,
        position: 'bottom',
      });
      //console.log('userInfo', JSON.stringify(data));
      localStorage.setItem('userInfo', JSON.stringify(data));
      setLoading(false);
      history.push('/chats');
    } catch (error) {
      toast({
        title: 'Email/Password is incorrect',
        description: error.response.data.message,
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: 'bottom',
      });
      setLoading(false);
    }
  };

  return (
    <VStack spacing="5px">
      {/* Start tag */}

      {/* Email */}
      <FormControl id="email" isRequired>
        <FormLabel>Email</FormLabel>
        <Input
          placeholder="Enter your email : "
          value={email || ''}
          onChange={(e) => setEmail(e.target.value)}
        />
      </FormControl>

      {/* Password */}
      <FormControl id="password" isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input
            type={show ? 'text' : 'password'}
            placeholder="Enter your password : "
            value={password || ''}
            onChange={(e) => setPassword(e.target.value)}
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={handleClick}>
              {show ? 'Hide' : 'Show'}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>

      {/* Login Button */}
      <Button
        colorScheme="blue"
        width="100%"
        style={{ marginTop: 15 }}
        onClick={submitHandler}
        isLoading={loading}
      >
        Login
      </Button>
      {/* Guest User login credentials */}
      <Button
        colorScheme="green"
        width="100%"
        style={{ marginTop: 15 }}
        onClick={() => {
          setEmail('guestuser@user.com');
          setPassword('123456');
        }}
      >
        Guest Login
      </Button>
      {/* End tag */}
    </VStack>
  );
};

export default Login;
