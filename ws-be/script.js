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
    socket.on("join-room", async (roomId) => {
        socket.join(roomId);
        try {
            const existingMeetingRoom = await prisma.meetingRoom.findFirst({
                where: {
                    meetingId: roomId
                }
            })

            if (!existingMeetingRoom) {
                const meetingRoom = await prisma.meetingRoom.create({
                    data: {
                        meetingId: roomId

                    }
                })
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
                    meetingId: meetingRoomId
                }, include: {
                    conversation: true
                }
            })
            const questions = conversation
            console.log('""""""""""""""""""""""""""""""""""""')
            console.log(questions)
            console.log('""""""""""""""""""""""""""""""""""""')
            socket.emit("questions", questions)
            socket.to(meetingRoomId).emit('questions', questions)
        } catch (error) {
            console.log(error)
        }
    })


    async function getAll(meetingId) {
        try {
            const res = await prisma.meetingRoom.findFirst({
                where: {
                    meetingId
                }, include: {
                    conversation: true
                }

            })
            return res
        } catch (error) {

            console.log(error)
        }
    }






    socket.on("disconnect", () => {
        console.log("User Disconnected", socket.id);
    });
});


server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

