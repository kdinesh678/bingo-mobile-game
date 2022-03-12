import {
  Button,
  Container,
  Content,
  Icon,
  Input,
  Item,
  Text,
  View,
  Toast,
} from 'native-base';
import React, {useCallback, useEffect, useState} from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import Clipboard from '@react-native-clipboard/clipboard';

import {useAppSelector} from '../../redux/reducers/hooks';
import {FindOpponentScreenProps} from '../../Router';
import QRCodeScanner from 'react-native-qrcode-scanner';
import {NEW} from '../../redux/constants';

export default function FindOpponentScreen(props: FindOpponentScreenProps) {
  const {navigation} = props;
  const playerId = useAppSelector(state => state.player.id) as string;
  const [opponentId, setOpponentId] = useState('');
  const [qrCodeScannerOpened, openQRCodeScanner] = useState(false);
  const [playerIdVisible, showPlayerId] = useState(false);
  const gameStatus = useAppSelector(state => state.game.gameStatus);

  useEffect(() => {
    if (gameStatus === NEW) {
      navigation.navigate('play');
    }
  }, [gameStatus, navigation]);

  const handleScanResult = useCallback(
    evt => {
      setOpponentId(evt.data);
      openQRCodeScanner(false);
      navigation.navigate('startRemoteGame', {opponentPeerId: evt.data});
    },
    [navigation],
  );

  const handleOpponentId = useCallback(() => {
    if (opponentId) {
      navigation.navigate('startRemoteGame', {opponentPeerId: opponentId});
    }
  }, [navigation, opponentId]);

  const openQRCodeScannerCallback = useCallback(() => {
    openQRCodeScanner(true);
  }, []);

  const goBack = useCallback(() => {
    if (qrCodeScannerOpened) {
      openQRCodeScanner(false);
    } else if (playerIdVisible) {
      showPlayerId(false);
    } else {
      navigation.goBack();
    }
  }, [navigation, qrCodeScannerOpened, playerIdVisible]);

  const copyIdToClipboard = () => {
    Clipboard.setString(playerId);
    Toast.show({
      text: 'Your Id is copied',
      duration: 1000,
      position: 'bottom',
      type: 'success',
    });
  };

  return (
    <Container>
      <Content contentContainerStyle={styles.content}>
        <Button
          style={styles.backButton}
          icon
          rounded
          block
          transparent
          onPress={goBack}>
          <Icon type="Ionicons" name="arrow-back" />
        </Button>
        <View style={styles.centerContainer}>
          {!qrCodeScannerOpened && !playerIdVisible && (
            <>
              <Text>Type your friend's Id</Text>
              <Item>
                <Input value={opponentId} onChangeText={setOpponentId} />
                <Button
                  icon
                  small
                  transparent
                  disabled={!opponentId}
                  onPress={handleOpponentId}>
                  <Icon type="Ionicons" name="arrow-forward" />
                </Button>
              </Item>
              <View style={styles.orContainer}>
                <Text style={styles.orText}>OR</Text>
              </View>
              <Button
                style={styles.button}
                rounded
                bordered
                block
                onPress={openQRCodeScannerCallback}>
                <Text>Scan your friend's Id</Text>
              </Button>
              <View style={styles.jointButton}>
                <TouchableOpacity
                  style={[styles.jointButtonPart, styles.joinButtonDivider]}
                  onPress={copyIdToClipboard}>
                  <Text>Copy your Id</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.jointButtonPart}
                  onPress={() => showPlayerId(true)}>
                  <Text>Show QR code</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
          {playerIdVisible && (
            <>
              <View style={styles.playerContainer}>
                <Text>Your Id</Text>
                <Text>{playerId}</Text>
                <View style={styles.qrCodeContainer}>
                  <QRCode size={200} value={playerId} />
                </View>
              </View>
            </>
          )}
          {qrCodeScannerOpened && (
            <QRCodeScanner
              onRead={handleScanResult}
              bottomContent={
                <Text style={styles.qrCodeInstruction}>
                  Scan your opoonent QR code to start the game
                </Text>
              }
            />
          )}
        </View>
      </Content>
    </Container>
  );
}

const styles = StyleSheet.create({
  content: {
    alignItems: 'center',
    flex: 1,
    padding: 16,
  },
  backButton: {
    position: 'absolute',
    width: 60,
    height: 60,
    top: 8,
    left: 8,
    zIndex: 1,
  },
  orContainer: {
    marginTop: 30,
    marginBottom: 30,
    borderRadius: 50,
    width: 50,
    height: 50,
    alignItems: 'center',
    backgroundColor: '#ffffff',
    display: 'flex',
    justifyContent: 'center',
  },
  centerContainer: {
    flex: 1,
    paddingTop: '30%',
    alignItems: 'center',
  },
  orText: {
    color: '#000',
    fontSize: 20,
  },
  playerContainer: {
    marginTop: 60,
    display: 'flex',
    alignItems: 'center',
  },
  idContainer: {
    padding: 12,
    marginTop: 16,
    marginBottom: 16,
    display: 'flex',
    flexDirection: 'row',
  },
  idText: {
    maxWidth: 250,
    marginRight: 8,
    textAlign: 'center',
  },
  qrCodeContainer: {
    marginTop: 32,
    padding: 32,
    backgroundColor: 'white',
  },
  button: {
    alignSelf: 'center',
    marginTop: 18,
  },
  jointButton: {
    borderColor: '#fff',
    borderWidth: 1,
    borderStyle: 'solid',
    borderRadius: 50,
    flexDirection: 'row',
    marginTop: 210,
  },
  joinButtonDivider: {
    borderRightWidth: 1,
    borderRightColor: '#fff',
    borderStyle: 'solid',
  },
  jointButtonPart: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
  },
  closeButton: {
    width: 100,
    alignSelf: 'center',
    marginTop: 54,
  },
  qrCodeInstruction: {
    flex: 1,
    fontSize: 18,
    padding: 32,
    color: '#fff',
    fontWeight: '500',
    textAlign: 'center',
  },
});
