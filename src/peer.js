import Peer from 'react-native-peerjs';
import {errorMessages} from './errorMessages';
import {
  createGame,
  gameError,
  resetGame,
  selectNumber,
  setOpponentGameBoardReady,
} from './redux/actions/gameActions';
import {setPlayerId} from './redux/actions/playerActions';
import store from './redux/store';

const INITIATE_MESSAGE = 'INITIATE_MESSAGE';
const INITIATE_MESSAGE_RECEIVED = 'INITIATE_MESSAGE_RECEIVED';
const BOARD_READY = 'BOARD_READY';
const CHOSE_NUMBER = 'CHOSE_NUMBER';

let peerObj, conn, myPeerId, opponentPeerId;

export function setupPeer() {
  peerObj = new Peer();

  peerObj.on('open', function (id) {
    myPeerId = id;
    store.dispatch(setPlayerId(id));
  });

  peerObj.on('connection', function (recieveConn) {
    conn = recieveConn;

    conn.on('data', function (data) {
      messageHandler(data);
    });
  });

  peerObj.on('error', function (err) {
    const message = errorMessages[err?.type] || 'Something went wrong';
    store.dispatch(gameError(message));
    store.dispatch(resetGame());
    peerObj.destroy();
  });
}

export function connectByPeerId(peerId) {
  if (!peerId) {
    throw 'Undefined peer id';
  }

  conn = peerObj.connect(peerId);

  conn.on('open', function () {
    conn.on('data', function (data) {
      messageHandler(data);
    });
    const lastPlayedBy = Math.random() * 10 < 5 ? myPeerId : peerId;

    sendMessage({type: INITIATE_MESSAGE, myPeerId, lastPlayedBy});
  });
}

export function sendMyBoardToOpponent(board) {
  sendMessage({type: BOARD_READY, board});
}

export function sendSelectedNumberToOpponent(number, playerId) {
  sendMessage({type: CHOSE_NUMBER, number, playedBy: playerId});
}

function sendMessage(data) {
  conn.send(data);
}

function messageHandler(data) {
  if (
    data.type === INITIATE_MESSAGE ||
    data.type === INITIATE_MESSAGE_RECEIVED
  ) {
    opponentPeerId = data.myPeerId;
    store.dispatch(
      createGame({
        gameType: 'MULTIPLAYER',
        playerId: myPeerId,
        opponentId: opponentPeerId,
        lastPlayedBy: data.lastPlayedBy,
      }),
    );

    if (data.type === INITIATE_MESSAGE) {
      sendMessage({
        type: INITIATE_MESSAGE_RECEIVED,
        myPeerId,
        lastPlayedBy: data.lastPlayedBy,
      });
    }
  } else if (data.type === BOARD_READY) {
    store.dispatch(setOpponentGameBoardReady(data.board));
  } else if (data.type === CHOSE_NUMBER) {
    store.dispatch(
      selectNumber({number: data.number, playedBy: data.playedBy}),
    );
  }
}
