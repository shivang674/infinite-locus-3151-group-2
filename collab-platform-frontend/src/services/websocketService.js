import { Client } from '@stomp/stompjs'
import SockJS from 'sockjs-client'

let stompClient = null

export function connectWebSocket(documentId, onMessageReceived, onConnected) {
  stompClient = new Client({
    webSocketFactory: () => new SockJS('/ws'),
    reconnectDelay: 5000,
    onConnect: () => {
      stompClient.subscribe(`/topic/document.${documentId}`, message => {
        const body = JSON.parse(message.body)
        onMessageReceived(body)
      })
      if (onConnected) onConnected()
    },
    onStompError: frame => {
      console.error('STOMP error', frame)
    }
  })

  stompClient.activate()
}

export function sendEdit(documentId, content, userId, userName) {
  if (stompClient && stompClient.connected) {
    stompClient.publish({
      destination: `/app/document.edit.${documentId}`,
      body: JSON.stringify({
        documentId,
        content,
        userId,
        userName
      })
    })
  }
}

export function disconnectWebSocket() {
  if (stompClient) {
    stompClient.deactivate()
    stompClient = null
  }
}
