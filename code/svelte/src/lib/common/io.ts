import { io, Socket } from 'socket.io-client'
import type { ClientToServerEvents, ServerToClientEvents } from '../../../../express/src/_types'

const socketioUrl = 'ws://localhost:3000/socketio/001'
let socketMap = new Map<string, Socket<ServerToClientEvents, ClientToServerEvents>>()
export const getIO = (roomId: string) => {
  if (socketMap.has(roomId)) {
    const oo = socketMap.get(roomId)!
    if (oo.disconnected) {
      oo.connect()
    }
    return oo
  }
  const iioo = io(socketioUrl, {
    query: {
      roomId,
    },
    auth: {
      token: 'dfasdfasdfasfdsadfasdfasdf',
    },
  })
  socketMap.set(roomId, iioo)
  return iioo
}

export const disconnectIO = (roomId: string) => {
  const io = getIO(roomId)
  if (io.connected) {
    io.off()
    io.disconnect()
  }
}
