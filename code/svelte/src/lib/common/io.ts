import { io, Socket } from 'socket.io-client'
import type { ClientToServerEvents, ServerToClientEvents } from '../../../../express/src/_types'

const socketioUrl = 'ws://localhost:3000/socketio/001'
let socketMap = new Map<string, Socket<ServerToClientEvents, ClientToServerEvents>>()
export const getIO = (roomId: string) => {
  if (socketMap.has(roomId)) {
    return socketMap.get(roomId)!
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
