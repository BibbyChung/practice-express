export type PollState = {
  question: string
  options: {
    id: number
    text: string
    description: string
    votes: string[]
  }[]
}

export type msgInfoType = {
  userId: string
  msg: string
}

export type ClientToServerEvents = {
  vote: (optionId: number) => void
  askForStateUpdate: () => void

  msg: (msgInfo: msgInfoType) => void
}

export type ServerToClientEvents = {
  updateState: (state: PollState) => void

  msg: (msgInfo: msgInfoType) => void
}

export type InterServerEvents = {}

export type SocketData = {
  user: string
}
