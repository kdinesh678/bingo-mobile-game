import {createStore} from 'redux';
import reducers from './reducers';

const store = createStore(reducers);

export default store;

// types
export type RootState = ReturnType<typeof store.getState>;
export type RootDispatch = typeof store.dispatch;
