const express = require("express")
const { Server } = require("socket.io")
const { createServer } = require("http")
const cors = require("cors");
const { default: axios } = require("axios");

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
let count = 0

async function test(body) {
    const data = await axios.post("http://localhost:8000/", { body })
    return data
}




io.on("connection", (socket) => {
    console.log("User Connected", socket.id);

    socket.on("message", ({ room, text, role }) => {
        // console.log({ room, text, role });
        test({ room, text, role }).then((data) => {
            console.log(data.data)
        })
        count += 1

    });



    socket.on('need-questions', (message) => {
        socket.to(room).emit('chat-questions', message)
    })

    socket.on('questions', (questions) => {
        socket.to(room).emit('questions-ret', questions)
    })







    socket.on("join-room", (room) => {
        socket.join(room);
        console.log(`User joined room ${room}`);
    });

    socket.on("disconnect", () => {
        console.log("User Disconnected", socket.id);
    });
});

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});