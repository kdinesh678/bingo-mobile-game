import {ActionType, SOUND_TOGGLED} from '../actions/appActions';

const initialState: {gameSound: boolean} = {
  gameSound: true,
};

export default function (state = initialState, action: ActionType) {
  switch (action.type) {
    case SOUND_TOGGLED:
      return {
        ...state,
        gameSound: !state.gameSound,
      };

    default:
      return state;
  }
}
