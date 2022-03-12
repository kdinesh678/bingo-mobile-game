export const SOUND_TOGGLED = 'SOUND_TOGGLED';

export function toggleSound() {
  return {
    type: SOUND_TOGGLED,
  };
}

export type ActionType = ReturnType<typeof toggleSound>;
