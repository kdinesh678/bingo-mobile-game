import {combineReducers} from 'redux';
import appReducer from './appReducer';
import gameReducer from './gameReducer';
import playerReducer from './playerReducer';

export default combineReducers({
  application: appReducer,
  game: gameReducer,
  player: playerReducer,
});
