// io is returned by the src and will be available globally
(() => {
  const script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = 'http://localhost:1992/socket.io/socket.io.js';
  document.head.appendChild(script);
})();


// Strip generated bundle from dom in development
(() => {
  const shlBundle = document.getElementById('shl-prod-bundle');
  document.head.removeChild(shlBundle);
})();

function resolveSocketIo() {
  return new Promise((resolve) => {
    const checkForSocket = () => {
      try {
        const socket = io('http://localhost:1992/hotSocket');
        // truthy once the io is defined
        if (socket) {
          clearInterval(interval);
          resolve(socket);
        }
      } catch (e) {
        console.log('error caught')
        console.log(e);
      }
    };
    const interval = setInterval(() => {
      checkForSocket();
    }, 500);
  });
}

async function connectToSocket() {
  return resolveSocketIo();
}

connectToSocket().then((socket) => {
  socket.on('file refresh', (msg) => {
    // truthy is ID is already present in DOM and removes node from DOM
    if (document.getElementById(msg.filename)) {
      console.log(`removing ${msg.filename} and swapping with replacement`);
      const rm = document.getElementById(msg.filename);
      document.head.removeChild(rm);
    }
    console.log(`${msg.filename} is incoming`);
    const css = document.createElement('style');
    css.type = 'text/css';
    css.id = msg.filename;
    css.innerHTML = msg.css;
    document.head.appendChild(css);
  });
});
