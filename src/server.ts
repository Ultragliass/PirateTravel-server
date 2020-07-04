import { register } from "./routers/register";
import { login } from "./routers/login";
import { JWT_SECRET } from "./secret";
import { vacations } from "./routers/vacations";
import express, { Request, Response, NextFunction } from "express";
import http from "http";
import socketIo from "socket.io";
import cors from "cors";
import expressJwt from "express-jwt";

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

app.use("/vacations", vacations);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  res.status(401).send("Unauthorized.");
});

server.listen(PORT, () => console.log(`Server is up at ${PORT}`));
