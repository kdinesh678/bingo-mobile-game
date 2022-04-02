import {
  ActionType,
  PLAYER_ID_SET,
  PLAYER_NAME_SET,
} from '../actions/playerActions';

const initialState: {
  name: string | null;
  id: string | null;
  remoteIdSet: boolean;
} = {
  name: null,
  id: null,
  remoteIdSet: false,
};

export default function (state = initialState, action: ActionType) {
  switch (action.type) {
    case PLAYER_NAME_SET:
      return {
        ...state,
        name: action.payload.name,
        id: action.payload.name?.trim(),
      };

    case PLAYER_ID_SET:
      return {
        ...state,
        remoteIdSet: true,
        id: action.payload.id,
      };

    default:
      return state;
  }
}
