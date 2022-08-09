export const sendRequest = (socket, payload) => {
  if (socket.readyState === 1) {
    socket.send(JSON.stringify(payload));
  }
};
