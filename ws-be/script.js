const express = require("express")
const { Server } = require("socket.io")
const { createServer } = require("http")
const cors = require("cors");
const { default: axios } = require("axios");
const { PrismaClient } = require("@prisma/client")

const prisma = new PrismaClient()

const port = 8000;

const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
        credentials: true,
    },
});

app.use(
    cors({
        origin: "*",
        methods: ["GET", "POST"],
        credentials: true,
    })
);

app.use(express.json())

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.post("/", (req, res) => {
    const body = req.body

    return res.json({
        body
    })

})

async function test(body) {
    const data = await axios.post("http://localhost:8000/", { body })
    return data
}




io.on("connection", (socket) => {
    console.log("User Connected", socket.id);

    // room join using the meeting id
    socket.on("join-room", async ({ id, userMail }) => {
        try {
            const existingMeetingRoom = await prisma.meetingRoom.findFirst({
                where: {
                    meetingId: id
                }
            })

            if (!existingMeetingRoom) {
                const meetingRoom = await prisma.meetingRoom.create({
                    data: {
                        meetingId: id,
                        users: userMail

                    }
                })
            } else {
                const usersUL = existingMeetingRoom.users + "," + userMail
                const updateUser = await prisma.meetingRoom.update({
                    where: {
                        meetingId: id
                    },
                    data: {
                        users: usersUL
                    }
                });
                console.log("''''''''''''''''''")
                console.log(updateUser)
                console.log("''''''''''''''''''")
            }

        } catch (error) {
            console.log(error)
        }
    });

    socket.on("message", async ({ meetingRoomId, text, role }) => {
        try {
            const convo = await prisma.meetingRoom.update({
                where: {
                    meetingId: meetingRoomId
                },
                data: {
                    conversation: {
                        create: {
                            role,
                            text
                        }
                    }
                },
                include: {
                    conversation: true
                }
            });
            console.log('=================convo====================')
            console.log(convo)
            console.log('=================convo====================')
        } catch (error) {
            console.log("Error:", error.message)
        }

    });



    socket.on('need-questions', async (meetingRoomId) => {
        try {
            const conversation = await prisma.meetingRoom.findFirst({
                where: {
                    meetingId: meetingRoomId,
                },
                include: {
                    conversation: {
                        select: {
                            text: true,
                            role: true,
                        },
                    },
                },
            });

            const response = await axios.post("https://interviewmate.azurewebsites.net/new-questions", {
                conversations: conversation.conversation
            });

            const questions = response.data;

            socket.emit('questions', questions);
        } catch (error) {
            console.log(error)
        }
    })


    socket.on('need-questions-empty', async (meetingRoomId) => {
        try {
            const description = await prisma.meetingRoom.findFirst({
                where: {
                    meetingId: meetingRoomId,
                }, select: {
                    description: true
                }
            });

            const response = await axios.post("https://interviewmate.azurewebsites.net/take-description", {
                description
            });

            const questions = response.data;

            socket.emit('questions', questions);
        } catch (error) {
            console.log(error)
        }
    })


    socket.on("need-analysis", async (meetingRoomId) => {
        try {
            const meetingRoom = await prisma.meetingRoom.findFirst({
                where: {
                    meetingId: meetingRoomId,
                }
            })

            if (meetingRoom.analysis === "") {

                const conversation = await prisma.meetingRoom.findFirst({
                    where: {
                        meetingId: meetingRoomId
                    },
                    select: {
                        description: true,
                        conversation: {
                            select: {
                                text: true,
                                role: true
                            }
                        }
                    }
                });

                if (!conversation) {
                    socket.emit("error", "Conversation not found");
                    return;
                }

                try {
                    const res = await axios.post("https://interviewmate.azurewebsites.net/analyze", {
                        conversations: conversation.conversation
                    });
                    // Emit only the data part of the response
                    socket.emit("analysis", res.data);
                    const analysis = JSON.stringify(res.data)
                    const updateMeeting = await prisma.meetingRoom.update({
                        where: {
                            meetingId: meetingRoomId
                        }, data: {
                            analysis
                        }
                    })
                    console.log(analysis)

                } catch (error) {
                    console.error("Error in analysis request:", error);
                    socket.emit("error", "Analysis request failed");
                }

            } else {
                socket.emit("analysis", meetingRoom.analysis)

            }
        } catch (error) {
            console.error("Error fetching conversation:", error);
            socket.emit("error", "Failed to fetch conversation");
        }
    });



    socket.on("disconnect", () => {
        console.log("User Disconnected", socket.id);
    });
});


server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

