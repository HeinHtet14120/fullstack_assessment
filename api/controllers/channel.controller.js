import prisma from '../lib/prisma.js';

export const getChannel = async (req, res) => {
    const id = req.params.id;
    const tokenUserId = req.user;
    try {

        const channel = await prisma.channel.findUnique({
            where: {
                id
            }
        })

        if (!channel) {
            return res.status(404).json({ message: "Channel not found!" });
        }

        if (!channel.members.includes(tokenUserId)) {
            return res.status(400).json({ message: "User is not a member of this channel!" });
        }

        res.status(200).json(channel)

    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "Failed to get channel !" })
    }
}

export const getPublicChannels = async (req, res) => {
    try {
        const publicChannels = await prisma.channel.findMany({
            where: {
                isPrivate: false
            }
        })

        res.status(200).json(publicChannels)
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "Failed to get public channels !" })
    }
}

export const getUserChannels = async (req, res) => {
    const tokenUserId = req.user;

    try {
        const userChannels = await prisma.channel.findMany({
            where: {
                members: {
                    has: tokenUserId
                }
            },
            select: {
                id: true,
                name: true,
            }
        });

        res.status(200).json(userChannels)
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "Failed to get user channels !" })
    }
}

export const createChannel = async (req, res) => {
    const body = req.body;
    const tokenUserId = req.user.id;

    try {
        const newChannel = await prisma.channel.create({
            data: {
                ...body,
                created_by: tokenUserId,
                members: [tokenUserId], // Automatically add the creator as a member
            }
        });

        if (newChannel) {
            await prisma.user.update({
                where: { id: tokenUserId },
                data: {
                    createdChannels: {
                        push: newChannel.id  // Connect the new channel to the user
                    }
                }
            });
        }
        res.status(200).json(newChannel);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Failed to create channel!" });
    }
};

export const updateChannel = async (req, res) => {
    const id = req.params.id;
    const tokenUserId = req.user.id;
    const { userId } = req.body;

    try {
        const channel = await prisma.channel.findUnique({
            where: { id },
        });

        if (!channel) {
            return res.status(404).json({ message: "Channel not found!" });
        }

        if (channel.created_by !== tokenUserId) {
            return res.status(403).json("Not Authorized");
        }

        if (channel.members.includes(userId)) {
            return res.status(400).json({ message: "User is already a member of this channel!" });
        }

        await prisma.channel.update({
            where: { id },
            data: {
                members: {
                    push: userId,
                }
            }
        });

        await prisma.user.update({
            where: { id: userId },
            data: {
                memberOfChannels: {
                    push: id,
                }
            }
        });

        res.status(200).json({ message: "New member added to the channel!" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to update channel!" });
    }
};


export const deleteChannel = async (req, res) => {
    const id = req.params.id;
    const tokenUserId = req.user.id;

    try {
        const channel = await prisma.channel.findUnique({
            where: { id }
        });

        if (!channel) {
            return res.status(404).json({ message: "Channel not found!" });
        }

        if (channel.created_by !== tokenUserId) {
            return res.status(403).json("Not Authorized");
        }

        await prisma.channel.delete({
            where: { id }
        });
        res.status(200).json({ message: "Channel deleted!" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Failed to delete channel!" });
    }
};

export const joinChannel = async (req, res) => {
    const { id } = req.body;
    const tokenUserId = req.user;

    try {

        const channel = await prisma.channel.findUnique({
            where: { id },
        });

        if (!channel) {
            return res.status(404).json({ message: "Channel not found!" });
        }

        if (channel.members.includes(tokenUserId)) {
            return res.status(400).json({ message: "User is already a member of this channel!" });
        }

        await prisma.channel.update({
            where: { id },
            data: {
                members: {
                    push: tokenUserId,
                }
            }
        })

        await prisma.user.update({
            where: { id: tokenUserId },
            data: {
                memberOfChannels: {
                    push: id,
                }
            }
        });

        res.status(200).json({ message: "Joined to the channel!" });

    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Failed to join channel!" });
    }
}

export const leaveChannel = async (req, res) => {
    const { id } = req.body;
    const tokenUserId = req.user;

    try {
        const channel = await prisma.channel.findUnique({
            where: { id },
        });

        if (!channel) {
            return res.status(404).json({ message: "Channel not found!" });
        }

        if (!channel.members.includes(tokenUserId)) {
            return res.status(400).json({ message: "User is not a member of this channel!" });
        }

        await prisma.channel.update({
            where: { id },
            data: {
                members: {
                    set: channel.members.filter(member => member !== tokenUserId)
                }
            }
        });

        await prisma.user.update({
            where: { id: tokenUserId },
            data: {
                memberOfChannels: {
                    set: (await prisma.user.findUnique({
                        where: { id: tokenUserId },
                        select: { memberOfChannels: true },
                    })).memberOfChannels.filter(channelId => channelId !== id)
                }
            }
        });

        res.status(200).json({ message: "Left the channel!" });

    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Failed to leave channel!" });
    }
};


