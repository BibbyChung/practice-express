import { Server as HttpServer, IncomingMessage, ServerResponse } from "http";
import { Namespace, Server, Socket } from "socket.io";
import {
  ClientToServerEvents,
  InterServerEvents,
  ServerToClientEvents,
  SocketData,
} from "~/_types";
import { logger } from "~/utils/logger";
import { setupVoteSocketio } from "./vote.socketio";

import { createAdapter } from "@socket.io/redis-adapter";
import { getRedis } from "~/utils/redis";

// the client will pass an auth "token" (in this simple case, just the username)
// to the server on initialize of the Socket.IO client in our React App
const addUserToSocketDataIfAuthenticated = async (
  socket: Socket,
  next: (err?: Error) => void
) => {
  const user = socket.handshake.auth.token;
  logger.info(user);
  // if (user) {
  //   try {
  //     socket.data = { ...socket.data, user: user };
  //   } catch (err) {}
  // }
  next();
};

export const setupSocketio = (
  server: HttpServer<typeof IncomingMessage, typeof ServerResponse>,
  npsName: string
) => {
  // setup for redis
  const pubClient = getRedis();
  const subClient = pubClient.duplicate();

  // passing these generic type parameters to the `Server` class
  // ensures data flowing through the server are correctly typed.
  const io = new Server<
    ClientToServerEvents,
    ServerToClientEvents,
    InterServerEvents,
    SocketData
  >(server, {
    adapter: createAdapter(pubClient, subClient),
    cors: {
      origin: `http://localhost:3000`,
      methods: ["GET", "POST"],
    },
  });

  // this is middleware that Socket.IO uses on initiliazation to add
  // the authenticated user to the socket instance. Note: we are not
  // actually adding real auth as this is beyond the scope of the tutorial
  io.use(addUserToSocketDataIfAuthenticated);

  const nsp = io.of(npsName);
  nsp.on("connection", (socket) => {
    logger.info(socket.client);
    logger.info("a user connected", socket.data.user);

    socket.on("disconnect", () => {
      logger.info("user disconnected");
    });

    setupSocketioAction(socket, nsp);
  });
};

const setupSocketioAction = (
  socket: Socket<
    ClientToServerEvents,
    ServerToClientEvents,
    InterServerEvents,
    SocketData
  >,
  nsp: Namespace<
    ClientToServerEvents,
    ServerToClientEvents,
    InterServerEvents,
    SocketData
  >
) => {
  setupVoteSocketio(socket, nsp);
};
