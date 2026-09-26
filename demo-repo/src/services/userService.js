const users = [
  {
    id: "1",
    name: "Alice",
    email: "alice@example.com",
  },
  {
    id: "2",
    name: "Bob",
    email: "bob@example.com",
  },
];

function findUserById(userId) {
  return users.find((user) => user.id === userId);
}

module.exports = {
  findUserById,
};