import prisma from '../lib/prisma.js';

// Add a message to a channel
export const addMessage = async (req, res) => {
  const { id } = req.params;  // Channel ID from the URL
  const { text } = req.body;         // Message text from the request body
  const userId = req.user;         // Assume you have userId from authentication middleware

  try {
    // Ensure the user is a member of the channel
    const channel = await prisma.channel.findUnique({
      where: {
        id: id
      }
    });

    if (!channel) {
      return res.status(404).json({ message: "Channel not found!" });
    }

    if (!channel.members.includes(userId)) {
      return res.status(400).json({ message: "User is not a member of this channel!" });
    }

    // Add the message to the database
    const newMessage = await prisma.message.create({
      data: {
        message: text,
        senderId: userId,
        channelId: id,
        timestamp: new Date()
      }
    });

    res.status(200).json(newMessage);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error saving message", error: err.message });
  }
};

// Get all messages for a channel
export const getMessages = async (req, res) => {
  const { id } = req.params;

  console.log("APi channel : ", req.params)

  try {
    // Check if the channel exists
    const channel = await prisma.channel.findUnique({
      where: {
        id: id
      }
    });

   

    if (!channel) {
      return res.status(404).json({ message: "Channel not found!" });
    }

    // Fetch all messages from the channel, sorted by timestamp
    const messages = await prisma.message.findMany({
      where: {
        channelId: id
      },
      orderBy: {
        timestamp: 'asc'
      }
    });

    res.status(200).json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error retrieving messages", error: err.message });
  }
};
