import { register } from "./routers/register";
import { login } from "./routers/login";
import { JWT_SECRET } from "./secret";
import { vacations } from "./routers/vacations";
import { IVacation } from "./models/vacation";
import express, { Request, Response, NextFunction } from "express";
import http from "http";
import socketIo, { Socket } from "socket.io";
import cors from "cors";
import expressJwt from "express-jwt";
import socketioJwt from "socketio-jwt";

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

io.sockets
  .on(
    "connection",
    socketioJwt.authorize({
      secret: JWT_SECRET,
    })
  )
  .on("authenticated", (socket: any) => {
    const { userType } = socket.decoded_token;
    console.log(`${userType} connected.`);

    socket.on("UPDATE_VACATION", () => {
      if (userType !== "admin") {
        return socket.emit(
          "UNAUTHORIZED",
          "You do not have permission to perform this action."
        );
      }

      socket.broadcast.emit("UPDATE_VACATIONS", "Vacation updated.");
    });
  });

server.listen(PORT, () => console.log(`Server is up at ${PORT}`));
