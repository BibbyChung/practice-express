import { Namespace, Socket } from 'socket.io'
import {
  ClientToServerEvents,
  InterServerEvents,
  PollState,
  ServerToClientEvents,
  SocketData,
} from '~/_types'
import { logger } from '~/utils/logger'

// the server determines the PollState object, i.e. what users will vote on
// this will be sent to the client and displayed on the front-end
const poll: PollState = {
  question: "What are eating for lunch ✨ Let's order",
  options: [
    {
      id: 1,
      text: 'Party Pizza Place',
      description: 'Best pizza in town',
      votes: [],
    },
    {
      id: 2,
      text: 'Best Burger Joint',
      description: 'Best burger in town',
      votes: [],
    },
    {
      id: 3,
      text: 'Sus Sushi Place',
      description: 'Best sushi in town',
      votes: [],
    },
  ],
}

export const setupVoteSocketio = (
  socket: Socket<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>,
  nsp: Namespace<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>,
) => {
  // the client will send an 'askForStateUpdate' request on mount
  // to get the initial state of the poll
  socket.on('askForStateUpdate', () => {
    logger.info('client asked For State Update')
    socket.emit('updateState', poll)
  })

  socket.on('vote', (optionId: number) => {
    // If user has already voted, remove their vote.
    poll.options.forEach((option) => {
      option.votes = option.votes.filter((user) => user !== socket.data.user)
    })
    // And then add their vote to the new option.
    const option = poll.options.find((o) => o.id === optionId)
    if (!option) {
      return
    }
    option.votes.push(socket.data.user)
    // Send the updated PollState back to all clients
    nsp.emit('updateState', poll)
  })
}
