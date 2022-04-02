import React, {useCallback, useMemo} from 'react';
import {StyleSheet, View} from 'react-native';
import {Text, Button} from 'native-base';
import {COMPLETED, NEW, READY, STARTED} from '../../redux/constants';
import {CellSize, fontSize} from '../../dimensions';
import {useAppSelector} from '../../redux/reducers/hooks';
import {useDispatch} from 'react-redux';
import {clearBoard, fillRandomNumbers} from '../../redux/actions/gameActions';

type props = {
  numbers: number[];
  opponentTurn: boolean;
  startGame: () => void;
  isGameReady: boolean;
};

export default function PlayActions(props: props) {
  const {numbers, opponentTurn, isGameReady, startGame} = props;
  const dispatch = useDispatch();

  const clearAll = useCallback(() => {
    dispatch(clearBoard());
  }, [dispatch]);

  const fillRandom = useCallback(() => {
    dispatch(fillRandomNumbers());
  }, [dispatch]);

  const isAllFilled = useMemo(() => {
    return numbers.filter(n => n).length === 25;
  }, [numbers]);

  const {gameStatus} = useAppSelector(state => state.game);

  return (
    <View style={styles.actionWrapper}>
      {gameStatus === NEW ? (
        <>
          <Button
            rounded
            success
            bordered
            onPress={clearAll}
            style={styles.buttonStyle}
            disabled={isGameReady}>
            <Text>Clear</Text>
          </Button>
          {isAllFilled ? (
            <Button
              rounded
              success
              onPress={startGame}
              disabled={isGameReady}
              style={styles.buttonStyle}>
              <Text>Start game</Text>
            </Button>
          ) : (
            <Button
              rounded
              success
              onPress={fillRandom}
              disabled={isGameReady}
              style={styles.buttonStyle}>
              <Text>random numbers</Text>
            </Button>
          )}
        </>
      ) : null}
      {gameStatus === STARTED ? (
        <Text style={styles.gameStatus}>
          {opponentTurn ? 'Opponent Turn' : 'Your Turn'}
        </Text>
      ) : null}
      {gameStatus === READY ? (
        <Text style={styles.gameStatus}>READY</Text>
      ) : null}
      {gameStatus === COMPLETED ? (
        <Text style={styles.gameStatus}>Game Over</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  actionWrapper: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: CellSize,
  },
  buttonStyle: {
    flex: 1,
    marginRight: 16,
  },
  gameStatus: {
    fontSize: fontSize - 5,
  },
});
