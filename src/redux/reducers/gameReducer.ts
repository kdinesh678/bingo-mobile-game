import {
  ActionType,
  BOARD_CLEARED,
  BOARD_FILL_NUMBER,
  BOARD_RANDOM_NUMBERS_FILLED,
  ERROR,
  GAME_BOARD_READY,
  GAME_CREATE,
  GAME_NUMBER_SELECTED,
  GAME_RESET,
  GAME_START,
  OPPONENT_GAME_BOARD_READY,
} from '../actions/gameActions';
import {
  GAME_STATUS,
  PLAYER_TYPE,
  READY,
  NEW,
  PLAYER,
  CPU,
  STARTED,
  COMPLETED,
  NULL,
} from '../constants';
import {
  generateEmptyArray,
  setNumberInArray,
  getCompleteSets,
  generateRandomArray,
} from '../utils';

type Player = {
  type: PLAYER_TYPE | null;
  numbers: number[];
  sequencesFormed: Set<number>[];
  playerId: string | null;
};

type GameState = {
  err: string;
  gameId: number;
  gameStatus: GAME_STATUS;
  opponentGameStatus: GAME_STATUS;
  player: Player;
  opponent: Player;
  numbersSelected: number[];
  gameWinner: string | null;
  lastPlayedBy: string | null;
};

const initialState: GameState = {
  err: '',
  gameId: 0,
  gameStatus: NULL,
  opponentGameStatus: NULL,
  player: {
    type: PLAYER,
    numbers: generateEmptyArray(),
    sequencesFormed: [],
    playerId: null,
  },
  opponent: {
    type: null,
    numbers: generateEmptyArray(),
    sequencesFormed: [],
    playerId: null,
  },
  numbersSelected: [],
  gameWinner: null,
  lastPlayedBy: null,
};

export default function (state = initialState, action: ActionType): GameState {
  switch (action.type) {
    case ERROR:
      return {...state, err: action.payload.message};
    case GAME_CREATE:
      return {
        ...state,
        gameId: action.payload.gameId,
        gameStatus: NEW,
        player: {
          ...state.player,
          numbers: generateEmptyArray(),
          playerId: action.payload.playerId,
        },
        opponent: {
          ...state.opponent,
          type: action.payload.gameType === 'SINGLE' ? CPU : PLAYER,
          numbers: generateEmptyArray(),
          playerId: action.payload.opponentId,
        },
        lastPlayedBy: action.payload.lastPlayedBy,
      };

    case GAME_START:
      return {
        ...state,
        gameStatus: STARTED,
        numbersSelected: [],
        opponent: {
          ...state.opponent,
          numbers:
            state.opponent.type === CPU
              ? generateRandomArray()
              : state.opponent.numbers,
        },
      };

    case GAME_NUMBER_SELECTED:
      if (state.gameStatus !== STARTED) {
        return state;
      }
      const numbersSelected = [...state.numbersSelected, action.payload.number];
      const letterCombinationCompleted = getCompleteSets(
        state.player.numbers,
        numbersSelected,
      );

      const player = {
        ...state.player,
        sequencesFormed: letterCombinationCompleted,
      };

      const opponentLetterCombinationCompleted = getCompleteSets(
        state.opponent.numbers,
        numbersSelected,
      );

      const opponent = {
        ...state.opponent,
        sequencesFormed: opponentLetterCombinationCompleted,
      };

      const gameWinner =
        letterCombinationCompleted.length > 4 &&
        opponentLetterCombinationCompleted.length > 4
          ? action.payload.playedBy
          : letterCombinationCompleted.length > 4
          ? state.player.playerId
          : opponentLetterCombinationCompleted.length > 4
          ? state.opponent.playerId
          : null;

      return {
        ...state,
        numbersSelected,
        player,
        opponent,
        lastPlayedBy: action.payload.playedBy,
        gameWinner,
        gameStatus: gameWinner ? COMPLETED : state.gameStatus,
      };

    case GAME_BOARD_READY:
      // check how to handle errors in redux and update this case
      return {...state, gameStatus: READY};

    case OPPONENT_GAME_BOARD_READY:
      // check how to handle errors in redux and update this case
      return {
        ...state,
        opponentGameStatus: READY,
        opponent: {...state.opponent, numbers: action.payload.opponentBoard},
      };

    case GAME_RESET:
      return initialState;

    case BOARD_RANDOM_NUMBERS_FILLED:
      if (state.gameStatus === NEW) {
        return {
          ...state,
          player: {
            ...state.player,
            numbers: action.payload.randomNumbers,
          },
        };
      }

      return state;

    case BOARD_FILL_NUMBER:
      if (state.gameStatus === NEW) {
        const number = Math.max(...state.player.numbers) + 1;

        return {
          ...state,
          player: {
            ...state.player,
            numbers: setNumberInArray(
              state.player.numbers,
              number,
              action.payload.position,
            ),
          },
        };
      }

      return state;

    case BOARD_CLEARED:
      return {
        ...state,
        player: {...state.player, numbers: generateEmptyArray()},
      };
    default:
      return state;
  }
}
