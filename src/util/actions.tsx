import { specials } from './specialActions';
import { Action } from './types';

export function actionToName(action: Action | null, character: number) {
  if (action == null) return null;
  if (specials[character] != null && specials[character][action.id] != null)
    return specials[character][action.id];
  return action.notes.length > 0 ? action.notes : action.state;
}
