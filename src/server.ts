import { JWT_SECRET } from "./secret";
import { vacations } from "./routers/vacations";
import { users } from "./routers/user";
import { JwtSocket } from "./models/jwtSocket";
import express, { Request, Response, NextFunction } from "express";
import { initialize, io } from "./wss/websocketserver";
import http from "http";
import cors from "cors";
import expressJwt from "express-jwt";
import socketioJwt from "socketio-jwt";

const PORT = process.env.PORT || 3001;
const app = express();
const server = http.createServer(app);
initialize(server);

app.use(express.json());

app.use(cors());

app.use(
  expressJwt({ secret: JWT_SECRET }).unless({
    path: ["/users/login", "/users/register"],
  })
);

app.use("/users", users);

app.use("/vacations", vacations);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  res.status(401).send("Unauthorized.");
});

io()
  .sockets.on(
    "connection",
    socketioJwt.authorize({
      secret: JWT_SECRET,
    })
  )
  .on("authenticated", (socket: JwtSocket) => {
    const { userType } = socket.decoded_token;

    if (userType === "admin") {
      socket.join("admins");
    } else {
      socket.join("users");
    }
  });

server.listen(PORT, () => console.log(`Server is up at ${PORT}`));
