import { Server as HttpServer, IncomingMessage, ServerResponse } from 'http'
import { Server, Socket } from 'socket.io'
import { ClientToServerEvents, InterServerEvents, ServerToClientEvents, SocketData } from '~/_types'
import { logger } from '~/utils/logger'

import { createAdapter } from '@socket.io/redis-adapter'
import { getRedis } from '~/utils/redis'
import { chatIO } from './chat.io'

// the client will pass an auth "token" (in this simple case, just the username)
// to the server on initialize of the Socket.IO client in our React App
const addUserToSocketDataIfAuthenticated = async (socket: Socket, next: (err?: Error) => void) => {
  const user = socket.handshake.auth.token
  logger.info(user)
  // if (user) {
  //   try {
  //     socket.data = { ...socket.data, user: user };
  //   } catch (err) {}
  // }
  next()
}

export const setupIO = (
  server: HttpServer<typeof IncomingMessage, typeof ServerResponse>,
  npsName: string,
) => {
  // setup for redis
  const pubClient = getRedis()
  const subClient = pubClient.duplicate()

  // passing these generic type parameters to the `Server` class
  // ensures data flowing through the server are correctly typed.
  const io = new Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>(
    server,
    {
      adapter: createAdapter(pubClient, subClient),
      cors: {
        // origin: `http://localhost:3000`,
        methods: ['GET', 'POST'],
      },
    },
  )

  // this is middleware that Socket.IO uses on initiliazation to add
  // the authenticated user to the socket instance. Note: we are not
  // actually adding real auth as this is beyond the scope of the tutorial
  io.use(addUserToSocketDataIfAuthenticated)

  const nsp = io.of(npsName)
  nsp.on('connection', (socket) => {
    // client端在建立連接時帶的參數
    const socketId = socket.id
    const token = socket.handshake.auth?.token
    const roomId = socket.handshake.query?.roomId ?? []

    // logger.info({
    //   socketId,
    //   token,
    //   roomId,
    // })

    if (!roomId) {
      return
    }
    socket.join(roomId)

    socket.on('disconnect', () => {
      logger.info('roomId disconnected')
    })

    setupSocketioAction(socket, roomId)
  })
}

const setupSocketioAction = (
  socket: Socket<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>,
  roomId: string | string[],
) => {
  chatIO(socket, roomId)
}
