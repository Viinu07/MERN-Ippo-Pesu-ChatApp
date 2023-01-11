/* Chat dummy data */

const chat = [
  {
    isGroupChat: false,
    users: [
      {
        name: 'Test me',
        email: 'test@test.com',
      },
    ],
    _id: '617a077e18c25468bc7c4dd4',
    chatName: 'Test',
  },
  {
    isGroupChat: true,
    users: [
      {
        name: 'Test',
        email: 'test@test.com',
      },
      {
        name: 'Viinu',
        email: 'viinu@example.com',
      },
      {
        name: 'Guest User',
        email: 'guest@example.com',
      },
    ],
    _id: '617a518c4081150016472c78',
    chatName: 'Test Zone',
    groupAdmin: {
      name: 'Guest User',
      email: 'guest@example.com',
    },
  },
];

module.exports = { chat };
