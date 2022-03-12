import {Container, Content, Toast} from 'native-base';
import React, {useEffect} from 'react';
import {StyleSheet} from 'react-native';
import {connectByPeerId} from '../../peer';
import {NEW} from '../../redux/constants';
import {useAppSelector} from '../../redux/reducers/hooks';
import {StartRemoteGameScreenProps} from '../../Router';
import LottieView from 'lottie-react-native';

const gamepadAnimation = require('../../assets/animations/lottie/gamepad.json');

export default function StartRemoteGameScreen(
  props: StartRemoteGameScreenProps,
) {
  const {route, navigation} = props;
  const {
    params: {opponentPeerId},
  } = route;

  const gameStatus = useAppSelector(state => state.game.gameStatus);
  const err = useAppSelector(state => state.game.err);

  useEffect(() => {
    if (gameStatus === NEW) {
      setTimeout(() => {
        navigation.navigate('play');
      }, 3000);
    } else if (err) {
      navigation.navigate('gameType');
    }
  }, [gameStatus, navigation, err]);

  useEffect(() => {
    try {
      connectByPeerId(opponentPeerId);
    } catch (error) {
      if (typeof error === 'string') {
        Toast.show({
          text: error as string,
          duration: 1000,
          type: 'warning',
          position: 'bottom',
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Container>
      <Content contentContainerStyle={styles.content}>
        <LottieView
          source={gamepadAnimation}
          autoPlay
          style={{width: 350}}
          colorFilters={[{keypath: 'primary', color: '#ffffff'}]}
        />
      </Content>
    </Container>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textMessage: {
    fontWeight: 'bold',
    marginTop: 16,
  },
});
