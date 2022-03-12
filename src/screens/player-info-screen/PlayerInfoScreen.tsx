import {Button, Container, Content, Input, Item, Text, View} from 'native-base';
import React, {useCallback, useState} from 'react';
import {StyleSheet} from 'react-native';
import {useDispatch} from 'react-redux';
import {setPlayerName} from '../../redux/actions/playerActions';
import {PlayerInfoScreenProps} from '../../Router';
import {storeData} from '../../utils/storage';

export default function PlayerInfoScreen(props: PlayerInfoScreenProps) {
  const {navigation} = props;
  const dispatch = useDispatch();

  const [playerName, updatePlayerName] = useState('');

  const next = useCallback(() => {
    try {
      storeData('playerName', playerName);
      dispatch(setPlayerName(playerName));
      navigation.navigate('home');
    } catch (err) {
      console.log(err);
    }
  }, [navigation, dispatch, playerName]);

  const updateName = useCallback(value => {
    updatePlayerName(value);
  }, []);

  return (
    <Container>
      <Content contentContainerStyle={styles.content}>
        <View style={styles.playerInfoForm}>
          <Text style={styles.playerInfoText}>Your name</Text>
          <Item>
            <Input
              style={styles.playerInfoInput}
              value={playerName}
              onChangeText={updateName}
              autoFocus={true}
            />
          </Item>
        </View>
        <Button
          style={styles.button}
          iconLeft
          rounded
          bordered
          block
          onPress={next}
          disabled={!playerName.length}>
          <Text>Start Playing</Text>
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
    marginTop: 32,
  },
  button: {
    width: '60%',
    maxWidth: 280,
    alignSelf: 'center',
    marginBottom: 18,
  },
  playerInfoForm: {
    flex: 1,
    alignItems: 'flex-start',
    padding: 16,
  },
  playerInfoText: {
    fontSize: 32,
  },
  playerInfoInput: {
    fontSize: 24,
    height: 60,
  },
});
