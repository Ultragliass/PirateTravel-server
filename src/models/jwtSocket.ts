import { Socket } from "socket.io";

export interface JwtSocket extends Socket {
  decoded_token: {
    userType: string;
  };
}
