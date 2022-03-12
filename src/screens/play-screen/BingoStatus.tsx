import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Text} from 'native-base';
import {CellSize, fontSize} from '../../dimensions';
import {primaryColor} from '../../style/color';

const bingoName = ['B', 'I', 'N', 'G', 'O'];

type props = {
  letterCompleted: number;
};

export default function BingoStatus(props: props) {
  const {letterCompleted} = props;

  return (
    <View style={styles.statusWrapper}>
      {bingoName.map((letter, index) => {
        const textWrapper =
          index < letterCompleted
            ? [styles.letter, styles.completed]
            : [styles.letter];

        return (
          <View key={index} style={styles.letterWrapper}>
            <Text style={textWrapper}>{letter}</Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  statusWrapper: {
    flexDirection: 'row',
  },
  letterWrapper: {
    width: CellSize,
    height: CellSize,
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  letter: {fontSize},
  completed: {
    width: '70%',
    height: '70%',
    textAlign: 'center',
    textAlignVertical: 'center',
    backgroundColor: primaryColor,
    borderRadius: 50,
    color: 'black',
  },
});
