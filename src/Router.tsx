import React, {useEffect} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NativeStackScreenProps} from '@react-navigation/native-stack';

import HomeScreen from './screens/home-screen/HomeScreen';
import GameTypeScreen from './screens/game-type-screen/GameTypeScreen';
import PlayScreen from './screens/play-screen/PlayScreen';
import ResultScreen from './screens/result-screen/ResultScreen';
import FindOpponentScreen from './screens/find-opponent-screen/FindOpponentScreen';
import StartRemoteGameScreen from './screens/start-remote-game/StartRemoteGameScreen';
import PlayerInfoScreen from './screens/player-info-screen/PlayerInfoScreen';
import BootScreen from './screens/boot-screen/BootScreen';
import {useAppSelector} from './redux/reducers/hooks';
import {Toast} from 'native-base';
import {useDispatch} from 'react-redux';
import {gameError} from './redux/actions/gameActions';

type RouteParamsType = {
  home: undefined;
  gameType: undefined;
  playerInfo: undefined;
  play: undefined;
  result: undefined;
  findOpponent: undefined;
  startRemoteGame: {opponentPeerId: string};
  bootScreen: undefined;
};

export type HomeScreenProps = NativeStackScreenProps<RouteParamsType, 'home'>;
export type GameTypeScreenProps = NativeStackScreenProps<
  RouteParamsType,
  'gameType'
>;
export type PlayerInfoScreenProps = NativeStackScreenProps<
  RouteParamsType,
  'playerInfo'
>;
export type PlayScreenProps = NativeStackScreenProps<RouteParamsType, 'play'>;
export type ResultScreenProps = NativeStackScreenProps<
  RouteParamsType,
  'result'
>;
export type FindOpponentScreenProps = NativeStackScreenProps<
  RouteParamsType,
  'findOpponent'
>;
export type StartRemoteGameScreenProps = NativeStackScreenProps<
  RouteParamsType,
  'startRemoteGame'
>;
export type BootScreenProps = NativeStackScreenProps<
  RouteParamsType,
  'bootScreen'
>;

const Stack = createNativeStackNavigator<RouteParamsType>();

export default function Router() {
  const err = useAppSelector(state => state.game.err);
  const dispatch = useDispatch();

  useEffect(() => {
    if (err) {
      Toast.show({
        text: err,
        duration: 2000,
        position: 'bottom',
        type: 'danger',
      });

      setTimeout(() => {
        dispatch(gameError(''));
      });
    }
  }, [dispatch, err]);

  return (
    <Stack.Navigator
      initialRouteName="bootScreen"
      screenOptions={{headerShown: false}}>
      <Stack.Screen name="bootScreen" component={BootScreen} />
      <Stack.Screen name="home" component={HomeScreen} />
      <Stack.Screen name="gameType" component={GameTypeScreen} />
      <Stack.Screen name="playerInfo" component={PlayerInfoScreen} />
      <Stack.Screen name="play" component={PlayScreen} />
      <Stack.Screen name="result" component={ResultScreen} />
      <Stack.Screen name="findOpponent" component={FindOpponentScreen} />
      <Stack.Screen name="startRemoteGame" component={StartRemoteGameScreen} />
    </Stack.Navigator>
  );
}
