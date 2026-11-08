// frontend/src/services/calls.service.js
import { socket } from 'src/boot/socket'

export const callsService = {
  startCall: (targetUserId, withVideo = true) => {
    socket.emit('call:start', { targetUserId, withVideo, startedAt: new Date().toISOString() })
  },
  answerCall: (callerUserId) => {
    socket.emit('call:answer', { callerUserId, answeredAt: new Date().toISOString() })
  },
  endCall: (targetUserId) => {
    socket.emit('call:end', { targetUserId, endedAt: new Date().toISOString() })
  }
}
