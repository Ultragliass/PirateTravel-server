import express from "express";
import http from "http";
import socketIo from "socket.io";
import cors from "cors";
import expressJwt from "express-jwt";
import { JWT_SECRET } from "./secret";

const PORT: string | number = process.env.PORT || 3001;
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.json());

app.use(cors());

app.use(
  expressJwt({ secret: JWT_SECRET }).unless({ path: ["/register", "/login"] })
);



app.get("/", (req, res) => {
  res.send("Hi there!");
});

server.listen(PORT, () => console.log(`Server is up at ${PORT}`));
