import React from 'react';

import {NavigationContainer} from '@react-navigation/native';
import {Provider} from 'react-redux';
import store from './redux/store';
import {StyleProvider, Root} from 'native-base';
import getTheme from '../src/native-base-theme/components';
import Router from './Router';
import {setupPeer} from './peer';

try {
  setupPeer();
} catch (err) {
  console.log(err);
}

const App = () => {
  return (
    <Provider store={store}>
      <Root>
        <StyleProvider style={getTheme()}>
          <NavigationContainer>
            <Router />
          </NavigationContainer>
        </StyleProvider>
      </Root>
    </Provider>
  );
};

export default App;
