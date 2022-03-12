import React, {useCallback, useRef, useLayoutEffect} from 'react';
import {StyleSheet, TouchableHighlight} from 'react-native';
import {
  CellSize,
  fontSize,
  BorderWidth,
  CellDiagonalSize,
} from '../../dimensions';

import {Text, View} from 'react-native-animatable';

type props = {
  number: number;
  position: number;
  isSelected: boolean;
  onPress: (number: number, position: number) => void;
  lineDirection: string[];
};

const styleValue: Record<string, any> = {
  bottomRight: {
    transform: [{rotate: '135deg'}],
    color: ['white', 'transparent'],
  },
  bottomLeft: {transform: [{rotate: '45deg'}], color: ['transparent', 'white']},
  topRight: {transform: [{rotate: '45deg'}], color: ['white', 'transparent']},
  topLeft: {transform: [{rotate: '135deg'}], color: ['transparent', 'white']},
  top: {transform: [{rotate: '0deg'}], color: ['white', 'transparent']},
  bottom: {transform: [{rotate: '0deg'}], color: ['transparent', 'white']},
  left: {transform: [{rotate: '90deg'}], color: ['transparent', 'white']},
  right: {transform: [{rotate: '90deg'}], color: ['white', 'transparent']},
};

export default function Cell(props: props) {
  const {number, onPress, position, isSelected, lineDirection = []} = props;

  const textRefEl = useRef(null);

  let cellWrapperStyle: object = styles.cellWrapper;
  let textStyle: object = styles.cellValue;

  if (isSelected) {
    textStyle = {
      ...textStyle,
      color: 'black',
      backgroundColor: 'white',
      fontSize: fontSize - 5,
      width: '50%',
      height: '50%',
    };
  }

  if (position < 5) {
    cellWrapperStyle = {...cellWrapperStyle, borderTopWidth: BorderWidth};
  }
  if (position % 5 === 0) {
    cellWrapperStyle = {...cellWrapperStyle, borderLeftWidth: BorderWidth};
  }

  useLayoutEffect(() => {
    if (textRefEl.current && isSelected) {
      (textRefEl.current as any).bounceIn(2500);
    }
  }, [isSelected]);

  const onPressCallback = useCallback(() => {
    onPress(number, position);
  }, [onPress, number, position]);

  return (
    <TouchableHighlight onPress={onPressCallback} style={cellWrapperStyle}>
      <>
        <Text useNativeDriver={true} style={textStyle} ref={textRefEl}>
          {number || ''}
        </Text>
        {lineDirection.map((line, index) => {
          return (
            <View
              key={index}
              style={[
                styles.joinLine,
                {transform: styleValue[line].transform},
              ]}>
              <View
                style={[
                  styles.joinLineSegment,
                  {backgroundColor: styleValue[line].color[0]},
                ]}
              />
              <View
                style={[
                  styles.joinLineSegment,
                  {backgroundColor: styleValue[line].color[1]},
                ]}
              />
            </View>
          );
        })}
      </>
    </TouchableHighlight>
  );
}

const styles = StyleSheet.create({
  cellWrapper: {
    width: CellSize,
    height: CellSize,
    borderRightWidth: BorderWidth,
    borderBottomWidth: BorderWidth,
    borderStyle: 'solid',
    borderColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  joinLine: {
    width: 3,
    height: CellDiagonalSize,
    top: ((CellDiagonalSize - CellSize) / 2) * -1,
    left: CellSize / 2,
    position: 'absolute',
    zIndex: 0,
    transform: [{rotate: '135deg'}],
  },
  joinLineSegment: {
    flex: 1,
  },
  cellValue: {
    width: '60%',
    height: '60%',
    color: 'white',
    fontSize,
    textAlign: 'center',
    textAlignVertical: 'center',
    borderRadius: 50,
    zIndex: 1,
  },
});
