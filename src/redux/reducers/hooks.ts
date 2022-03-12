import {useEffect, useRef} from 'react';
import {useSelector, TypedUseSelectorHook} from 'react-redux';
import {RootState} from '../store';

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export function usePrevious(value: any) {
  const ref = useRef();

  useEffect(() => {
    ref.current = value;
  });

  return ref.current;
}
