import { ArrowBackIcon } from '@chakra-ui/icons';
import { Box, Text } from '@chakra-ui/layout';
import {
  FormControl,
  IconButton,
  Input,
  Spinner,
  useToast,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { ChatState } from '../Context/ChatProvider';
import { getSender, getAllSender } from '../config/ChatLogics';
import ProfileModal from './extras/ProfileModal';
import UpdateGroupChatModal from './extras/UpdateGroupChatModal';
import ScrollMessages from './ScrollMessages';
import axios from 'axios';
import './styles.css';
import io from 'socket.io-client';

const ENDPOINT = 'http://localhost:5000';
var socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMesage] = useState();
  /* State for socket.io */
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [istyping, setIsTyping] = useState(false);

  const toast = useToast();

  const { user, selectedChat, setSelectedChat, notification, setNotification } =
    ChatState();

  const fetchMessages = async () => {
    if (!selectedChat) return;

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      setLoading(true);
      const { data } = await axios.get(
        `/api/message/${selectedChat._id}`,
        config
      );
      //console.log('Messages', data);
      setMessages(data);
      setLoading(false);

      socket.emit('join chat', selectedChat._id);
    } catch (error) {
      toast({
        title: 'Error Occured',
        description: 'Failed to load the messages',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'bottom',
      });
    }
  };

  const sendMessage = async (event) => {
    if (event.key === 'Enter' && newMessage) {
      socket.emit('stop typing', selectedChat._id);
      try {
        const config = {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user.token}`,
          },
        };
        setNewMesage('');
        const { data } = await axios.post(
          '/api/message',
          {
            content: newMessage,
            chatId: selectedChat._id,
          },
          config
        );
        //console.log(data);
        socket.emit('new message', data);
        setMessages([...messages, data]);
      } catch (error) {
        toast({
          title: 'Error Occured',
          description: 'Failed to send the new message',
          status: 'error',
          duration: 5000,
          isClosable: true,
          position: 'bottom',
        });
      }
    }
  };

  /* Configuration to connect Socket.io */
  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit('setup', user);
    socket.on('connected', () => setSocketConnected(true));
    socket.on('typing', () => setIsTyping(true));
    socket.on('stop typing', () => setIsTyping(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* Whenever the user switches the chat the state has to be rendered */
  useEffect(() => {
    fetchMessages();
    selectedChatCompare =
      selectedChat; /* Keeping backup from the selected chat state to emit the message/ notification of message */
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedChat]);

  console.log(notification);

  useEffect(() => {
    socket.on('message received', (newMessageReceived) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageReceived.chat._id
      ) {
        //give notification
        if (!notification.includes(newMessageReceived)) {
          setNotification([newMessageReceived, ...notification]);
          setFetchAgain(!fetchAgain);
        }
      } else {
        setMessages([...messages, newMessageReceived]);
      }
    });
  });

  const typingHandler = (event) => {
    setNewMesage(event.target.value);

    if (!socketConnected) return;
    /* If the user is not typing */
    if (!typing) {
      setTyping(true);
      socket.emit('typing', selectedChat._id);
      console.log(selectedChat._id);
    }
    let lastTimeTyping = new Date().getTime();
    var timerLength = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTimeTyping;

      if (timeDiff >= timerLength && typing) {
        socket.emit('stop typing', selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };

  return (
    <>
      {selectedChat ? (
        <>
          <Text
            fontSize={{ base: '25px', md: '30px' }}
            pb={3}
            px={2}
            w="100%"
            fontFamily="poppins"
            display="flex"
            justifyContent={{ base: 'space-between' }}
            alignItems="center"
          >
            <IconButton
              display={{ base: 'flex', md: 'none' }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat('')}
            />
            {!selectedChat.isGroupChat ? (
              <>
                {getSender(user, selectedChat.users)}
                <ProfileModal user={getAllSender(user, selectedChat.users)} />
              </>
            ) : (
              <>
                {selectedChat.chatName.toUpperCase()}
                <UpdateGroupChatModal
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                  fetchMessages={fetchMessages}
                />
              </>
            )}
          </Text>
          <Box
            display="flex"
            flexDir="column"
            justifyContent="flex-end"
            p={3}
            bg="#E8E8E8"
            w="100%"
            h="100%"
            borderRadius="lg"
            overflowY="hidden"
          >
            {loading ? (
              <Spinner
                size="xl"
                w={20}
                h={20}
                alignSelf="center"
                margin="auto"
              />
            ) : (
              <div className="messages">
                {<ScrollMessages messages={messages} />}
              </div>
            )}
            <FormControl onKeyDown={sendMessage} isRequired mt={3}>
              {console.log('Value changing or not ', istyping)}
              {istyping ? <div>Loading....</div> : <></>}
              <Input
                variant="filled"
                bg="#E0E0E0"
                placeholder="Enter new message"
                onChange={typingHandler}
                value={newMessage || ''}
              />
            </FormControl>
          </Box>
        </>
      ) : (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          h="100%"
        >
          <Text fontSize="3xl" pb={3} fontFamily="poppins">
            Select a user to start chatting
          </Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;
