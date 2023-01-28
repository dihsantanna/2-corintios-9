import { memberEvents } from './memberEvents';
import { titheEvents } from './tithesEvents';

export const createPreloadEvents = () => {
  memberEvents();
  titheEvents();
};
