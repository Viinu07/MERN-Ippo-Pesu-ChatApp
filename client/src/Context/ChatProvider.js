/* Context provides the ability for us to use the state variables across different components */
import { createContext, useContext, useState, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

const ChatContext = createContext();

const ChatProvider = ({ children }) => {
  const [user, setUser] = useState();
  const [selectedChat, setSelectedChat] = useState();
  const [chats, setChats] = useState([]);
  const [notification, setNotification] = useState([]);

  const history = useHistory();
  const location = useLocation(); //useLocation is used here to trigger the funtion based components based on change of URL

  /* Here the useEffect is used to watchdog the change in the URL with respect to the userInfo */
  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    setUser(userInfo);
    if (userInfo === undefined) history.push('/');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  //console.log('Chat Provider', user);

  return (
    <ChatContext.Provider
      value={{
        user,
        setUser,
        selectedChat,
        setSelectedChat,
        chats,
        setChats,
        notification,
        setNotification,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

/* This is used to use the state across the component */
export const ChatState = () => {
  return useContext(ChatContext);
};

export default ChatProvider;
