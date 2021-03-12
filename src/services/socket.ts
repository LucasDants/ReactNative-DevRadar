import {io} from 'socket.io-client';
import {Dev} from '../pages/Main';

const socket = io('http://IPV4:3333', {
  autoConnect: false,
});

function subscribeToNewDevs(subscribeFunction: (dev: Dev) => void) {
  socket.on('new-dev', subscribeFunction);
}

function connect(latitude: string, longitude: string, techs: string) {
  socket.io.opts.query = {
    latitude,
    longitude,
    techs,
  };

  socket.connect();
}

function disconnect() {
  if (socket.connected) {
    socket.disconnect();
  }
}

export {connect, disconnect, subscribeToNewDevs};
