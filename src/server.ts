import express from "express";
import http from "http";
import { register } from "./routers/register";
import socketIo from "socket.io";
import cors from "cors";
import expressJwt from "express-jwt";
import { JWT_SECRET } from "./secret";
import { login } from "./routers/login";

const PORT: string | number = process.env.PORT || 3001;
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.json());

app.use(cors());

app.use(
  expressJwt({ secret: JWT_SECRET }).unless({ path: ["/register", "/login"] })
);

app.use("/register", register);

app.use("/login", login);

server.listen(PORT, () => console.log(`Server is up at ${PORT}`));
