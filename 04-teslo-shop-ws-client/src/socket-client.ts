import { Manager, Socket } from "socket.io-client"

let socket: Socket | undefined = undefined

const addListeners = () => {
  if (!socket) return
  const serverStatusLabel  = document.querySelector('#server-status')!;
  socket.on('connect', () => {
    serverStatusLabel.innerHTML = 'Connected'
  })
  socket.on('disconnect', () => {
    serverStatusLabel.innerHTML = 'Disconnected'
  })

  const clientsList = document.querySelector('#clients-ul')!;
  socket.on('clients-updated', (clients: string[]) => {
    const clientsHtml = clients
      .map((clientId) => `<li>${clientId}</li>`)
      .join('\n');

    clientsList.innerHTML = clientsHtml
  })

  const messageForm = document.querySelector<HTMLFormElement>('#message-form')!;
  const messageInput = document.querySelector<HTMLInputElement>('#message-input')!;
  messageForm.addEventListener('submit', (event) => {
    event.preventDefault()
    if (!socket) return
    
    const message = messageInput.value.trim()
    if (message.length <= 0) return

    socket.emit('message-form-client', { message });
    messageInput.value = ''
  })

  const messagesUl = document.querySelector<HTMLUListElement>('#messages-ul')!;
  socket.on('new-message', (payload: { fullName: string, message: string}) => {
    const newMessageLi = document.createElement('li')
    newMessageLi.innerHTML = `
      <li>
        <strong>${payload.fullName}: </strong>
        <span>${payload.message}</span>
      </li>
    `

    messagesUl.append(newMessageLi);
  });
}

export const connectToWebSocketServer = function (uri: string, token: string) {
  if (socket !== undefined) {
    socket.disconnect()
    socket.removeAllListeners()
  }
  
  const manager = new Manager(uri, {extraHeaders: {authentication: token}})
  socket = manager.socket('/')
  addListeners()
}
