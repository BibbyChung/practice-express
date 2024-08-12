import { Socket } from 'socket.io'
import {
  ClientToServerEvents,
  InterServerEvents,
  msgInfoType,
  ServerToClientEvents,
  SocketData,
} from '~/_types'

export const chatIO = (
  socket: Socket<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>,
  roomId: string | string[],
) => {
  socket.on('msg', (msgInfo: msgInfoType) => {
    socket.nsp.to(roomId).emit('msg', msgInfo)
  })
}
