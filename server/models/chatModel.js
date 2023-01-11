/* Required Model should contain*/
/* 
chatName - Provides the chatName
isGroupChat - to check whether it is a group
users - to display the users
latestMessage - should render the latest message
groupAdmin - to check whether the user is a group admin enabling to remove user from the group
*/

const mongoose = require('mongoose');

const chatModel = mongoose.Schema(
  {
    chatName: { type: String, trim: true },
    isGroupChat: { type: Boolean, default: false },
    users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    latestMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Message',
    },
    groupAdmin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = Chat = mongoose.model('Chat', chatModel);

//module.exports = { chat };
