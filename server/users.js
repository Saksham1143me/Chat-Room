const users = [];

const addUser = ({ id, name, room }) => {
  // Trim and normalize the input
  name = name.trim().toLowerCase();
  room = room.trim().toLowerCase();

  // Check for existing user in the same room
  const existingUser = users.find((user) => user.room === room && user.name === name);

  // Validation
  if (!name || !room) return { error: 'Username and room are required.' };
  if (existingUser) return { error: 'Username is taken.' };

  // Add user
  const user = { id, name, room };
  users.push(user);

  console.log("Users after addUser:", users);
  console.log("Added user:", user);

  return { user };
};

const removeUser = (id) => {
  const index = users.findIndex((user) => user.id === id);

  if (index !== -1) {
    const removedUser = users.splice(index, 1)[0];
    console.log("Removed user:", removedUser);
    return removedUser;
  }

  console.log(`User with ID: ${id} not found.`);
  return null;
};

const getUser = (id) => {
  const user = users.find((user) => user.id === id);
  console.log(`Get user by ID (${id}):`, user);
  return user;
};

const getUsersInRoom = (room) => {
  const usersInRoom = users.filter((user) => user.room === room.toLowerCase());
  console.log(`Users in room (${room}):`, usersInRoom);
  return usersInRoom;
};

// Export utility functions
module.exports = { addUser, removeUser, getUser, getUsersInRoom };
