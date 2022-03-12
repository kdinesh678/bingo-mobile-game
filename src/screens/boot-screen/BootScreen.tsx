import {Container, Content} from 'native-base';
import React, {useEffect} from 'react';
import {StyleSheet} from 'react-native';
import {useDispatch} from 'react-redux';
import {setPlayerName} from '../../redux/actions/playerActions';
import {PlayerInfoScreenProps} from '../../Router';
import {getData} from '../../utils/storage';

export default function PlayerInfoScreen(props: PlayerInfoScreenProps) {
  const {navigation} = props;
  const dispatch = useDispatch();

  useEffect(() => {
    (async function () {
      const playerName = await getData('playerName');
      if (playerName) {
        dispatch(setPlayerName(playerName));
        navigation.navigate('home');
      } else {
        navigation.navigate('playerInfo');
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Container>
      <Content contentContainerStyle={styles.content} />
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
});
