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

import { useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

const SignUp = () => {
  /* Form Input States */
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [confirmPassword, setConfirmPassword] = useState();
  const [pic, setpic] = useState();
  /* Uploading pic functionality */
  const [loading, setLoading] = useState(false);

  const toast = useToast(); //Functionality provided by the CHAKRA_UI
  const history = useHistory(); //Used to push the user to the next page
  /* Show or hide the password */
  const [show, setShow] = useState(false);
  /* Function handler */
  const handleClick = () => setShow(!show);

  /* Handling the upload imaage functionality */

  const postDetails = (pics) => {
    setLoading(true); //if the image is not uploaded initially the setLoading will be true
    if (pics === undefined) {
      toast({
        title: 'Please select an image',
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: 'bottom',
      });
      return;
    }

    /* Validating the pic format and carrying out the upload functionality*/
    /* Here for the upload feature <----Cloudinary-----> is used */
    if (pics.type === 'image/jpeg' || pics.type === 'image/png') {
      const data = new FormData();
      data.append('file', pics);
      data.append('upload_preset', 'Ippo-Pesu-ChatApp');
      data.append('cloud_name', 'dbpxo91s0');

      fetch('https://api.cloudinary.com/v1_1/dbpxo91s0/image/upload', {
        method: 'post',
        body: data,
      })
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          //console.log('Initial data', data);
          setpic(data.url.toString());
          //console.log('Return', data.url.toString());
          setLoading(false);
        })
        .catch((err) => {
          //console.log('Error', err);
          setLoading(false);
        });
    } else {
      toast({
        title: 'Please select an image',
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: 'bottom',
      });
      setLoading(false);
      return;
    }
  };

  /* Handling the submit form -> Validating the fields after submit and fetching the data from backend*/
  const submitHandler = async () => {
    setLoading(true);
    if (!name || !email || !password || !confirmPassword) {
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
    if (password !== confirmPassword) {
      toast({
        title: 'Passwords does not match, Please provide the correct password',
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: 'bottom',
      });
      setLoading(false);
      return;
    }
    /* Api request to store the data if the fields are validated properly */
    try {
      const config = {
        headers: {
          'Content-type': 'application/json',
        },
      };
      const { data } = await axios.post(
        '/api/user',
        {
          name,
          email,
          password,
          pic,
        },
        config
      );
      console.log(data);
      toast({
        title: 'User registered successfully',
        status: 'success',
        duration: 5000,
        isClosable: true,
        position: 'bottom',
      });
      localStorage.setItem('userInfo', JSON.stringify(data));
      setLoading(false);
      history.push('/chats');
    } catch (error) {
      toast({
        title: 'Error Occured',
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

      {/* First Name */}
      <FormControl id="first-name" isRequired>
        <FormLabel>Name</FormLabel>
        <Input
          placeholder="Enter your name : "
          onChange={(e) => setName(e.target.value)}
        />
      </FormControl>

      {/* Email */}
      <FormControl id="email" isRequired>
        <FormLabel>Email</FormLabel>
        <Input
          placeholder="Enter your email : "
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
            onChange={(e) => setPassword(e.target.value)}
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={handleClick}>
              {show ? 'Hide' : 'Show'}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>

      {/* Confirm password */}
      <FormControl id="confirm-password" isRequired>
        <FormLabel>Confirm Password</FormLabel>
        <InputGroup>
          <Input
            type={show ? 'text' : 'password'}
            placeholder="Enter your confirm password :"
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={handleClick}>
              {show ? 'Hide' : 'Show'}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>

      {/* Upload pic */}
      <FormControl id="pic">
        <Input
          type="file"
          p={1.5}
          accept="image/*"
          onChange={(e) => postDetails(e.target.files[0])}
        />
      </FormControl>
      {/* End tag */}
      <Button
        colorScheme="blue"
        width="100%"
        style={{ marginTop: 15 }}
        onClick={submitHandler}
        isLoading={loading}
      >
        SignUp
      </Button>
    </VStack>
  );
};

export default SignUp;
