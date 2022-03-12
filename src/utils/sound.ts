import Sound from 'react-native-sound';

Sound.setCategory('Playback');
const tik = new Sound('tik.mp3');
tik.setVolume(0.3);
const tok = new Sound('tok.mp3');
tok.setVolume(0.3);

export function playTick() {
  tik.play();
}

export function playTok() {
  tok.play();
}
