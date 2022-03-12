import React, {useCallback, useEffect} from 'react';
import {useDispatch} from 'react-redux';
import {StyleSheet, View, BackHandler, Alert} from 'react-native';
import {Content, Button, Text, Container, Icon} from 'native-base';

import {toggleSound} from '../../redux/actions/appActions';
import {HomeScreenProps} from '../../Router';
import {useAppSelector} from '../../redux/reducers/hooks';

const gameName = ['B', 'I', 'N', 'G', 'O'];

const backAction = () => {
  Alert.alert('Hold on!', 'Are you sure you want to exit the app?', [
    {
      text: 'Cancel',
      onPress: () => null,
      style: 'cancel',
    },
    {text: 'YES', onPress: () => BackHandler.exitApp()},
  ]);
  return true;
};

export default function HomePage(props: HomeScreenProps) {
  const {navigation} = props;

  const gameSound = useAppSelector(state => state.application.gameSound);
  const dispatch = useDispatch();

  const toggleGameSound = useCallback(() => {
    dispatch(toggleSound());
  }, [dispatch]);

  const goToOpponentSelectionScreen = useCallback(() => {
    navigation.navigate('gameType');
  }, [navigation]);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);

  return (
    <Container>
      <Content contentContainerStyle={styles.content}>
        <View style={styles.gameName}>
          {gameName.map((letter, index) => {
            const wrapperStyle =
              index === 1 || index === 4
                ? [styles.letterWrapper, styles.whiteLetterWrapper]
                : styles.letterWrapper;

            const letterStyle =
              index === 1 || index === 4
                ? [styles.letter, styles.blackLetter]
                : styles.letter;

            return (
              <View key={index} style={wrapperStyle}>
                <Text style={letterStyle}>{letter}</Text>
              </View>
            );
          })}
        </View>
        <Button
          style={styles.button}
          iconLeft
          rounded
          bordered
          block
          onPress={goToOpponentSelectionScreen}>
          <Icon name="game-controller" />
          <Text>PLAY</Text>
        </Button>

        <Button
          style={styles.button}
          iconLeft
          rounded
          bordered
          block
          onPress={toggleGameSound}>
          <Icon type="Entypo" name={gameSound ? 'sound' : 'sound-mute'} />
          <Text>SOUND</Text>
        </Button>

        <Button
          style={styles.button}
          iconLeft
          rounded
          bordered
          block
          onPress={backAction}>
          <Icon type="MaterialIcons" name="exit-to-app" />
          <Text>EXIT</Text>
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
  gameName: {
    flexDirection: 'row',
    marginBottom: 40,
    width: '100%',
    justifyContent: 'center',
  },
  letterWrapper: {
    margin: 4,
    borderRadius: 50,
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  whiteLetterWrapper: {
    backgroundColor: '#fff',
  },
  letter: {
    fontSize: 34,
  },
  blackLetter: {
    color: '#000',
  },
});
