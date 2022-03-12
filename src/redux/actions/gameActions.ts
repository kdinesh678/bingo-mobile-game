import {generateRandomArray} from '../utils';

export const BOARD_RANDOM_NUMBERS_FILLED = 'BOARD_RANDOM_NUMBERS_FILLED';
export const BOARD_CLEARED = 'BOARD_CLEARED';
export const BOARD_FILL_NUMBER = 'BOARD_NUMBER_FILL';

export const GAME_CREATE = 'GAME_CREATE';
export const GAME_START = 'GAME_START';
export const GAME_NUMBER_SELECTED = 'GAME_NUMBER_SELECTED';
export const GAME_RESET = 'GAME_RESET';
export const GAME_BOARD_READY = 'GAME_BOARD_READY';
export const OPPONENT_GAME_BOARD_READY = 'OPPONENT_GAME_BOARD_READY';

export const ERROR = 'ERROR';

export function resetGame() {
  return {type: GAME_RESET} as const;
}

export function createGame({
  gameType,
  playerId,
  opponentId,
  lastPlayedBy,
}: {
  gameType: 'SINGLE' | 'MULTIPLAYER';
  playerId: string;
  opponentId: string;
  lastPlayedBy: string;
}) {
  return {
    type: GAME_CREATE,
    payload: {
      gameType,
      playerId,
      opponentId,
      gameId: new Date().getTime(),
      lastPlayedBy,
    },
  } as const;
}

export function setGameBoardReady() {
  return {type: GAME_BOARD_READY} as const;
}

export function setOpponentGameBoardReady(opponentBoard: number[]) {
  return {type: OPPONENT_GAME_BOARD_READY, payload: {opponentBoard}} as const;
}

export function startGame() {
  return {type: GAME_START} as const;
}

export function selectNumber({
  number,
  playedBy,
}: {
  number: number;
  playedBy: string;
}) {
  return {type: GAME_NUMBER_SELECTED, payload: {number, playedBy}} as const;
}

export function fillRandomNumbers() {
  return {
    type: BOARD_RANDOM_NUMBERS_FILLED,
    payload: {randomNumbers: generateRandomArray()},
  } as const;
}

export function fillManualNumber(position: number) {
  return {
    type: BOARD_FILL_NUMBER,
    payload: {position},
  } as const;
}

export function clearBoard() {
  return {
    type: BOARD_CLEARED,
  } as const;
}

export function gameError(message: string) {
  return {
    type: ERROR,
    payload: {message},
  } as const;
}

export type ActionType = ReturnType<
  | typeof gameError
  | typeof clearBoard
  | typeof fillManualNumber
  | typeof fillRandomNumbers
  | typeof selectNumber
  | typeof startGame
  | typeof setGameBoardReady
  | typeof createGame
  | typeof resetGame
  | typeof setOpponentGameBoardReady
>;
