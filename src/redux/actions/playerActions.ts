export const PLAYER_NAME_SET = 'PLAYER_NAME_SET';
export const PLAYER_ID_SET = 'PLAYER_ID_SET';

export function setPlayerName(name: string) {
  return {type: PLAYER_NAME_SET, payload: {name}} as const;
}

export function setPlayerId(id: string) {
  return {type: PLAYER_ID_SET, payload: {id}} as const;
}

export type ActionType = ReturnType<typeof setPlayerName | typeof setPlayerId>;
