import React, {useCallback, useEffect} from 'react';
import {View, StyleSheet, BackHandler} from 'react-native';
import {Container, Button, Text} from 'native-base';
import {useDispatch} from 'react-redux';

import {fontSize, BoardWidth} from '../../dimensions';
import {ResultScreenProps} from '../../Router';
import {useAppSelector} from '../../redux/reducers/hooks';
import {resetGame} from '../../redux/actions/gameActions';
import LottieView from 'lottie-react-native';

const winnerAnimation = require('../../assets/animations/lottie/winner-trophy-animation.json');
const lostAnimation = require('../../assets/animations/lottie/lost-sad-star.json');

export default function Result(props: ResultScreenProps) {
  const {navigation} = props;
  const dispatch = useDispatch();

  const winnerId = useAppSelector(state => state.game.gameWinner);
  const userId = useAppSelector(state => state.player.id);

  const playAgain = useCallback(() => {
    dispatch(resetGame());
    navigation.navigate('gameType');
  }, [navigation, dispatch]);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        navigation.navigate('home');
        return true;
      },
    );

    return () => backHandler.remove();
  }, [navigation]);

  return (
    <Container style={styles.container}>
      <View style={{alignItems: 'center'}}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>
            {winnerId === userId ? 'You' : 'Your Opponent'} WON
          </Text>
        </View>
        {winnerId === userId ? (
          <LottieView
            source={winnerAnimation}
            autoPlay
            loop={false}
            style={{width: 250}}
          />
        ) : (
          <LottieView
            source={lostAnimation}
            autoPlay
            loop={false}
            style={{width: 250}}
          />
        )}
        <View style={styles.newGameContainer}>
          <Button rounded onPress={playAgain}>
            <Text>Play New Game</Text>
          </Button>
        </View>
      </View>
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  segmentContainer: {
    marginBottom: 12,
  },
  gridContainer: {
    width: BoardWidth,
    maxHeight: BoardWidth + 420,
    overflow: 'hidden',
  },
  headerContainer: {
    alignItems: 'center',
    margin: 12,
  },
  headerText: {
    fontSize: fontSize - 2,
    fontWeight: 'bold',
  },
  newGameContainer: {
    marginTop: 24,
  },
});
