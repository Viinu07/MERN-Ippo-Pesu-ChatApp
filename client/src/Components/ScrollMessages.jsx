import { Avatar, Tooltip } from '@chakra-ui/react';
import React from 'react';
import ScrollableFeed from 'react-scrollable-feed';
import {
  isSameSender,
  isLastMessage,
  isSameSenderAlign,
  isSameUser,
} from '../config/ChatLogics';
import { ChatState } from '../Context/ChatProvider';

/* React Scrollable chat is used for handling the scroll  */

const ScrollMessages = ({ messages }) => {
  const { user } = ChatState();

  return (
    <ScrollableFeed>
      {messages &&
        messages.map((currentMessage, index) => (
          <div style={{ display: 'flex' }} key={currentMessage._id}>
            {(isSameSender(messages, currentMessage, index, user._id) ||
              isLastMessage(messages, index, user._id)) && (
              <Tooltip
                label={currentMessage.sender.name}
                placement="bottom-start"
                hasArrow
              >
                <Avatar
                  mt="7px"
                  mr={1}
                  size="sm"
                  cursor="pointer"
                  name={currentMessage.sender.name}
                  src={currentMessage.sender.pic}
                />
              </Tooltip>
            )}
            <span
              style={{
                backgroundColor: `${
                  currentMessage.sender._id === user._id ? '#BEE3F8' : '#B9F5D0'
                }`,
                borderRadius: '20px',
                padding: '5px 15px',
                maxWidthL: '75%',
                marginLeft: isSameSenderAlign(
                  messages,
                  currentMessage,
                  index,
                  user._id
                ),
                marginTop: isSameUser(messages, currentMessage, index, user._id)
                  ? 3
                  : 10 /* Spacing between the messages is handled */,
              }}
            >
              {currentMessage.content}
            </span>
          </div>
        ))}
    </ScrollableFeed>
  );
};

export default ScrollMessages;
