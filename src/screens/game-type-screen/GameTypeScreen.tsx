import React, {useCallback, useEffect} from 'react';
import {StyleSheet, BackHandler} from 'react-native';
import {Content, Text, Container, Icon, Button} from 'native-base';
import {useDispatch} from 'react-redux';

import {GameTypeScreenProps} from '../../Router';
import {resetGame, createGame} from '../../redux/actions/gameActions';
import {CPU} from '../../redux/constants';
import {useAppSelector} from '../../redux/reducers/hooks';

export default function GameTypeScreen(props: GameTypeScreenProps) {
  const {navigation} = props;

  const playerId = useAppSelector(state => state.player.id) as string;

  const dispatch = useDispatch();

  const startSinglePlayerGame = useCallback(() => {
    dispatch(resetGame());
    const lastPlayedBy = Math.random() * 10 < 5 ? playerId : CPU;

    dispatch(
      createGame({gameType: 'SINGLE', playerId, opponentId: CPU, lastPlayedBy}),
    );

    navigation.navigate('play');
  }, [navigation, dispatch, playerId]);

  const startMultiPlayerGame = useCallback(() => {
    dispatch(resetGame());
    navigation.navigate('findOpponent');
  }, [navigation, dispatch]);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        navigation.goBack();
        return true;
      },
    );

    return () => backHandler.remove();
  }, [navigation]);

  return (
    <Container>
      <Content contentContainerStyle={styles.content}>
        <Icon style={styles.gameIcon} name="game-controller" />
        <Button
          style={styles.button}
          rounded
          bordered
          block
          onPress={startSinglePlayerGame}>
          <Text>Play with CPU</Text>
        </Button>

        <Button
          style={styles.button}
          rounded
          bordered
          block
          disabled={!playerId}
          onPress={startMultiPlayerGame}>
          <Text>Play with friends</Text>
        </Button>
      </Content>
    </Container>
  );
}

const styles = StyleSheet.create({
  content: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  button: {
    width: '60%',
    maxWidth: 280,
    alignSelf: 'center',
    marginBottom: 18,
  },
  gameIcon: {
    fontSize: 88,
    marginBottom: 34,
  },
  opponentWrapper: {
    flexDirection: 'row',
    marginBottom: 24,
    alignItems: 'flex-start',
  },
  numberWrapper: {
    backgroundColor: '#fff',
    borderRadius: 50,
    width: 42,
    height: 42,
    justifyContent: 'center',
    alignItems: 'center',
  },
  number: {
    fontSize: 20,
    color: '#000',
  },
  playerWrapper: {
    fontSize: 30,
    marginLeft: 16,
  },
});
