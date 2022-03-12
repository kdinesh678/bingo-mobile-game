import {Dimensions} from 'react-native';

export const Size = Dimensions.get('window');

const maxWidth = 480;

export const BoardWidth = Size.width > maxWidth ? maxWidth : Size.width - 20;

export const CellSize = Math.round(BoardWidth / 5) - 1;

export const CellDiagonalSize = Math.round(CellSize * 1.414);

export const fontSize = Math.round(CellSize / 3);

export const BorderWidth = 1;
