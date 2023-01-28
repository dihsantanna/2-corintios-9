import { memberEvents } from './memberEvents';
import { offerEvents } from './offerEvents';
import { titheEvents } from './titheEvents';

export const createPreloadHandlers = () => {
  memberEvents();
  titheEvents();
  offerEvents();
};
