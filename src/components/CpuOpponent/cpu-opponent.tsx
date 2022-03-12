import {useEffect} from 'react';
import {useDispatch} from 'react-redux';
import {selectNumber} from '../../redux/actions/gameActions';
import {CPU} from '../../redux/constants';
import {useAppSelector} from '../../redux/reducers/hooks';
import {nextGoodNumber} from '../../redux/utils';
import {playTok} from '../../utils/sound';

type props = {
  numbers: Array<number>;
  numbersSelected: number[];
  lastPlayedBy: string | null;
};

export default function CpuOpponent(props: props) {
  const {numbersSelected, numbers, lastPlayedBy} = props;
  const dispatch = useDispatch();

  const gameSound = useAppSelector(state => state.application.gameSound);
  const opponentPlayerId = useAppSelector(
    state => state.game.opponent.playerId,
  );

  useEffect(() => {
    if (lastPlayedBy !== opponentPlayerId) {
      const number = nextGoodNumber(numbers, numbersSelected);
      setTimeout(() => {
        dispatch(selectNumber({number, playedBy: CPU as string}));
        if (gameSound) {
          playTok();
        }
      }, 2000);
    }
  }, [
    gameSound,
    dispatch,
    lastPlayedBy,
    numbers,
    numbersSelected,
    opponentPlayerId,
  ]);

  return null;
}
