import express from "express";
import http from "http";
import socketIo from "socket.io";
import cors from "cors";
import expressJwt from "express-jwt";

const PORT = process.env.PORT || 3001;
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const { JWT_SECRET = "secret" } = process.env;

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Hi there!");
});

server.listen(PORT, () => console.log(`Server is up at ${PORT}`));
