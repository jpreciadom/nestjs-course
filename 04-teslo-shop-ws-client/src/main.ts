import { connectToWebSocketServer } from './socket-client'
import './style.css'
import typescriptLogo from './typescript.svg'
import viteLogo from '/vite.svg'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <a href="https://vitejs.dev" target="_blank">
      <img src="${viteLogo}" class="logo" alt="Vite logo" />
    </a>
    <a href="https://www.typescriptlang.org/" target="_blank">
      <img src="${typescriptLogo}" class="logo vanilla" alt="TypeScript logo" />
    </a>
    <h2>Websockets client</h2>
    <input id ="jwt" placeholder="Json Web Token" />
    <button id="btn-connect"> Connect</button>

    <br />
    <span id="server-status">Offline</span>

    <ul id="clients-ul"></ul>

    <form id="message-form">
      <input placeholder="Message" id="message-input" />
    </form>

    <h3>Messages</h3>
    <ul id="messages-ul"></ul>
  </div>
`

const jwtTokenInput = document.querySelector<HTMLInputElement>('#jwt')!;
const connectButton = document.querySelector<HTMLButtonElement>("#btn-connect")!;

connectButton.addEventListener('click', () => {
  const token = jwtTokenInput.value.trim()
  if(token.length <= 0) return

  connectToWebSocketServer('http://localhost:3000/socket.io/socket.io.js', token);
})
