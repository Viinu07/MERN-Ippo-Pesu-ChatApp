import { Box } from '@chakra-ui/react';
import { React, useState } from 'react';
import { ChatState } from '../Context/ChatProvider';
import SideBar from '../Components/extras/SideBar';
import MyChats from '../Components/MyChats';
import ChatBox from '../Components/ChatBox';

const Chat = () => {
  const [fetchAgain, setFetchAgain] = useState(false); //It is used to update the chats when the user leaves the group to have state changes
  const { user } = ChatState();

  return (
    <div style={{ width: '100%' }}>
      {user && <SideBar />}
      <Box
        display="flex"
        justifyContent="space-between"
        w="100%"
        h="91.5vh"
        p="10px"
      >
        {user && <MyChats fetchAgain={fetchAgain} />}
        {/* fetch chats is provided to the Mychats component */}
        {user && (
          <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        )}
      </Box>
    </div>
  );
};

export default Chat;
