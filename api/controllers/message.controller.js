import prisma from '../lib/prisma.js';
import { format } from 'date-fns';

export const addMessage = async (req, res) => {
  const { id } = req.params;
  const { text } = req.body;
  const userId = req.user;

  try {
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

    const newMessage = await prisma.message.create({
      data: {
        message: text,
        senderId: userId,
        channelId: id,
        timestamp: new Date()
      }
    });

    const sender = await prisma.user.findUnique({
      where: {
        id: userId
      },
      select: {
        id: true,
        username: true
      }
    });

    res.status(200).json({
      ...newMessage,
      sender: sender.username
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error saving message", error: err.message });
  }
};

export const getMessages = async (req, res) => {
  const { id } = req.params;

  try {
    const channel = await prisma.channel.findUnique({
      where: {
        id: id,
      },
    });

    if (!channel) {
      return res.status(404).json({ message: "Channel not found!" });
    }

    const messages = await prisma.message.findMany({
      where: {
        channelId: id,
      },
      orderBy: {
        timestamp: 'asc',
      },
      include: {
        sender: {
          select: {
            username: true,
          },
        },
      },
    });


    const formattedMessages = messages.map((msg) => ({
      id: msg.id,
      message: msg.message,
      senderId: msg.senderId,
      sender: msg.sender.username,
      timestamp: msg.timestamp,
    }));

    res.status(200).json(formattedMessages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error retrieving messages", error: err.message });
  }
};

