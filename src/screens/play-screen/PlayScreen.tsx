import React, {useCallback, useEffect} from 'react';
import {StyleSheet, BackHandler, Alert} from 'react-native';
import {Container} from 'native-base';
import {Row, Grid} from 'react-native-easy-grid';
import {useDispatch} from 'react-redux';

import CpuOpponent from '../../components/CpuOpponent/cpu-opponent';
import BingoGrid from '../../components/BingoGrid/bingoGrid';
import BingoStatus from './BingoStatus';
import PlayActions from './PlayActions';
import {BoardWidth} from '../../dimensions';
import {
  COMPLETED,
  CPU,
  NEW,
  PLAYER,
  READY,
  STARTED,
} from '../../redux/constants';
import {PlayScreenProps} from '../../Router';
import {useAppSelector} from '../../redux/reducers/hooks';
import {
  fillManualNumber,
  selectNumber,
  setGameBoardReady,
  startGame,
} from '../../redux/actions/gameActions';
import {playTick} from '../../utils/sound';
import {sendMyBoardToOpponent, sendSelectedNumberToOpponent} from '../../peer';

export default function PlayScreen(props: PlayScreenProps) {
  const {navigation} = props;
  const dispatch = useDispatch();

  const err = useAppSelector(state => state.game.err);
  const gameSound = useAppSelector(state => state.application.gameSound);
  const {gameStatus, numbersSelected, lastPlayedBy, opponentGameStatus} =
    useAppSelector(state => state.game);
  const {
    numbers: boardNumbers,
    playerId,
    sequencesFormed,
  } = useAppSelector(state => state.game.player);
  const {type: opponentType, numbers: opponentBoardNUmbers} = useAppSelector(
    state => state.game.opponent,
  );

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        if (gameStatus === STARTED) {
          Alert.alert(
            'Are you sure!',
            'You will lose the game if you go back',
            [
              {
                text: 'Cancel',
                onPress: () => null,
                style: 'cancel',
              },
              {text: 'YES', onPress: () => navigation.goBack()},
            ],
          );
        } else {
          navigation.navigate('gameType');
        }
        return true;
      },
    );

    if (gameStatus === COMPLETED) {
      navigation.navigate('result');
    }

    return () => backHandler.remove();
  }, [gameStatus, navigation]);

  // this is for multiplayer game
  useEffect(() => {
    if (gameStatus === READY && opponentGameStatus === READY) {
      dispatch(startGame());
    } else if (err) {
      navigation.navigate('gameType');
    }
  }, [gameStatus, opponentGameStatus, navigation, dispatch, err]);

  const onNumberSelect = useCallback(
    (number: number, position: number) => {
      if (gameStatus === NEW) {
        dispatch(fillManualNumber(position));
      } else {
        if (lastPlayedBy !== playerId) {
          dispatch(selectNumber({number, playedBy: playerId as string}));
          if (gameSound) {
            playTick();
          }

          if (opponentType === PLAYER) {
            sendSelectedNumberToOpponent(number, playerId);
          }
        }
      }
    },
    [gameStatus, dispatch, lastPlayedBy, playerId, opponentType, gameSound],
  );

  const startBingo = useCallback(() => {
    if (opponentType === CPU) {
      dispatch(startGame());
    } else {
      dispatch(setGameBoardReady());
      sendMyBoardToOpponent(boardNumbers);
    }
  }, [dispatch, opponentType, boardNumbers]);

  return (
    <Container style={styles.playgroundContainer}>
      {gameStatus === COMPLETED ? null : (
        <Grid style={styles.gridContainer}>
          <Row size={4} style={styles.bingoBox}>
            <BingoStatus letterCompleted={sequencesFormed.length} />
            <BingoGrid
              numbers={boardNumbers}
              numbersSelected={numbersSelected}
              onSelect={onNumberSelect}
              sequencesFormed={sequencesFormed}
            />
          </Row>
          <Row size={1} style={styles.actionRow}>
            <PlayActions
              numbers={boardNumbers}
              opponentTurn={lastPlayedBy === playerId}
              startGame={startBingo}
              isGameReady={gameStatus === READY}
            />
          </Row>
          {opponentType === CPU ? (
            <CpuOpponent
              numbers={opponentBoardNUmbers}
              numbersSelected={numbersSelected}
              lastPlayedBy={lastPlayedBy}
            />
          ) : null}
        </Grid>
      )}
    </Container>
  );
}

const styles = StyleSheet.create({
  playgroundContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  gridContainer: {
    width: BoardWidth,
    maxHeight: BoardWidth + 420,
    overflow: 'hidden',
  },
  bingoBox: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  actionRow: {
    alignItems: 'flex-start',
  },
});
