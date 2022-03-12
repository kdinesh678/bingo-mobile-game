import React from 'react';
import {StyleSheet, View} from 'react-native';
import {getJoinLineDirection} from '../../redux/utils';
import Cell from './cell';

type props = {
  numbers: Array<number>;
  onSelect?: (number: number, position: number) => void;
  numbersSelected: number[];
  sequencesFormed: Set<number>[];
};

export default function BingoGrid(props: props) {
  const {
    numbers,
    onSelect = () => {},
    numbersSelected = [],
    sequencesFormed,
  } = props;

  const lineDirections = getJoinLineDirection(numbers, sequencesFormed);

  return (
    <View style={styles.bingoGrid}>
      {numbers.map((number, index) => (
        <Cell
          key={index}
          number={number}
          position={index}
          onPress={onSelect}
          isSelected={numbersSelected.includes(number)}
          lineDirection={lineDirections[index]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  bingoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    borderStyle: 'solid',
    borderColor: '#fff',
    justifyContent: 'center',
  },
});
