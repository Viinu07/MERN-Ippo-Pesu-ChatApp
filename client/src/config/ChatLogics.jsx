/* Logic written to fetch a single sender <!--Single Chat--!>*/
export const getSender = (loggedUser, users) => {
  try {
    return users[0]._id === loggedUser._id ? users[1].name : users[0].name;
  } catch (error) {
    return;
  }
};
/* Logic written to fetch all senders <!--Group Chat--!>*/
export const getAllSender = (loggedUser, users) => {
  try {
    return users[0]._id === loggedUser._id ? users[1] : users[0];
  } catch (error) {
    return;
  }
};

/* Logic written to handle the messages from the sender and receiver differentiating the users from the current and next message */
export const isSameSender = (messages, currentMessage, index, userId) => {
  try {
    return (
      index < messages.length - 1 &&
      (messages[index + 1].sender._id !== currentMessage.sender._id ||
        messages[index + 1].sender._id === undefined) &&
      messages[index].sender._id !== userId
    );
  } catch (error) {
    return;
  }
};

export const isSameSenderAlign = (messages, currentMessage, index, userId) => {
  try {
    if (
      index < messages.length - 1 &&
      messages[index + 1].sender._id === currentMessage.sender._id &&
      messages[index].sender._id !== userId
    )
      return 33; //Margin value -> 33
    else if (
      (index < messages.length - 1 &&
        messages[index + 1].sender._id !== currentMessage.sender._id &&
        messages[index].sender._id !== userId) ||
      (index === messages.length - 1 && messages[index].sender._id !== userId)
    )
      return 0;
    else return 'auto'; // indicates the return type of function is declared at the end
  } catch (error) {
    return;
  }
};

/* Logic written to check the last message is from the other sender */
export const isLastMessage = (messages, index, userId) => {
  try {
    return (
      index === messages.length - 1 &&
      messages[messages.length - 1].sender._id !== userId &&
      messages[messages.length - 1].sender._id
    );
  } catch (error) {
    return;
  }
};

/* Logic written to align the same sender and receiver messages to left and right */

/* Logic written to check the id of the previous sender message to the current message */
export const isSameUser = (messages, currentMessage, index) => {
  return (
    index > 0 && messages[index - 1].sender._id === currentMessage.sender._id
  );
};
