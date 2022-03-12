import {
  ActionType,
  PLAYER_ID_SET,
  PLAYER_NAME_SET,
} from '../actions/playerActions';

const initialState: {name: string | null; id: string | null} = {
  name: null,
  id: null,
};

export default function (state = initialState, action: ActionType) {
  switch (action.type) {
    case PLAYER_NAME_SET:
      return {
        ...state,
        name: action.payload.name,
      };

    case PLAYER_ID_SET:
      return {
        ...state,
        id: action.payload.id,
      };

    default:
      return state;
  }
}
