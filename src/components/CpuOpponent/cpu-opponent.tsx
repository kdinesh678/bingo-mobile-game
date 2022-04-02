import {useEffect} from 'react';
import {useDispatch} from 'react-redux';
import {selectNumber} from '../../redux/actions/gameActions';
import {CPU, GAME_STATUS, STARTED} from '../../redux/constants';
import {useAppSelector} from '../../redux/reducers/hooks';
import {nextGoodNumber} from '../../redux/utils';
import {playTok} from '../../utils/sound';

type props = {
  numbers: Array<number>;
  numbersSelected: number[];
  lastPlayedBy: string | null;
  gameStatus: GAME_STATUS;
};

export default function CpuOpponent(props: props) {
  const {numbersSelected, numbers, lastPlayedBy, gameStatus} = props;
  const dispatch = useDispatch();

  const gameSound = useAppSelector(state => state.application.gameSound);
  const opponentPlayerId = useAppSelector(
    state => state.game.opponent.playerId,
  );

  useEffect(() => {
    if (lastPlayedBy !== opponentPlayerId && gameStatus === STARTED) {
      const number = nextGoodNumber(numbers, numbersSelected);
      setTimeout(() => {
        dispatch(selectNumber({number, playedBy: CPU as string}));
        if (gameSound) {
          playTok();
        }
      }, 2000);
    }
  }, [
    gameStatus,
    gameSound,
    dispatch,
    lastPlayedBy,
    numbers,
    numbersSelected,
    opponentPlayerId,
  ]);

  return null;
}
