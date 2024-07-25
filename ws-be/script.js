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

                console.log("=======================================")
                console.log(meetingRoom)
                console.log("=======================================")

            }


            console.log(`User joined room ${roomId}`);
        } catch (error) {
            console.log(error)
        }
    });

    socket.on("message", async ({ meetingRoomId, text, role }) => {
        // console.log({ room, text, role });
        const convo = await prisma.meetingRoom.update({
            where: {
                meetingId: meetingRoomId
            },
            data: {
                conversation: {
                    create: { role, text }
                }
            }
        })
        console.log(convo)


    });



    socket.on('need-questions', (message) => {
        socket.to(room).emit('chat-questions', message)
    })

    socket.on('questions', (questions) => {
        socket.to(room).emit('questions-ret', questions)
    })








    socket.on("disconnect", () => {
        console.log("User Disconnected", socket.id);
    });
});

async function test() {

    const meetingRoomId = "your-meeting-room-id";
    try {
        const existingMeetingRoom = await prisma.meetingRoom.findFirst({
            where: {
                meetingId: meetingRoomId
            }
        })

        if (!existingMeetingRoom) {

            const meetingRoom = await prisma.meetingRoom.create({
                data: {
                    meetingId: meetingRoomId

                }
            })

            console.log("=======================================")
            console.log(meetingRoom)
            console.log("=======================================")

        }


        console.log(`User joined room ${meetingRoomId}`);
    } catch (error) {
        console.log(error)
    }
    const role = "your-role";
    const text = "your-text";

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
            conversation: true // Include the updated conversation in the response
        }
    });

    console.log(convo);


}

test()

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

