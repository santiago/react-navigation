/*
 * This is used to extract one children's worth of events from a stream of navigation action events
 *
 * Based on the 'action' events that get fired for this navigation state, this utility will fire
 * focus and blur events for this child
 */
export default function getChildEventSubscriber(addListener, key) {
  const actionSubscribers = new Set();
  const willFocusSubscribers = new Set();
  const didFocusSubscribers = new Set();
  const willBlurSubscribers = new Set();
  const didBlurSubscribers = new Set();

  const getChildSubscribers = evtName => {
    switch (evtName) {
      case 'action':
        return actionSubscribers;
      case 'willFocus':
        return willFocusSubscribers;
      case 'didFocus':
        return didFocusSubscribers;
      case 'willBlur':
        return willBlurSubscribers;
      case 'didBlur':
        return didBlurSubscribers;
      default:
        return null;
    }
  };

  const emit = (type, payload) => {
    const payloadWithType = { ...payload, type };
    const subscribers = getChildSubscribers(type);
    subscribers &&
      subscribers.forEach(subs => {
        subs(payloadWithType);
      });
  };

  let isParentFocused = true;
  let hasEmittedChildFocusChange = true;

  let lastEmittedEvent = 'didBlur';

  const cleanup = () => {
    upstreamSubscribers.forEach(subs => subs && subs.remove());
  };

  const upstreamEvents = [
    'willFocus',
    'didFocus',
    'willBlur',
    'didBlur',
    'action',
  ];

  const upstreamSubscribers = upstreamEvents.map(eventName =>
    addListener(eventName, payload => {
      const { state, lastState, action } = payload;
      const lastRoutes = lastState && lastState.routes;
      const routes = state && state.routes;

      const lastFocusKey =
        lastState && lastState.routes && lastState.routes[lastState.index].key;
      const focusKey = routes && routes[state.index].key;

      const isFocused = focusKey === key;
      const lastRoute =
        lastRoutes && lastRoutes.find(route => route.key === key);
      const newRoute = routes && routes.find(route => route.key === key);
      const childPayload = {
        context: `${key}:${action.type}_${payload.context || 'Root'}`,
        state: newRoute,
        lastState: lastRoute,
        action,
        type: eventName,
      };
      const isTransitioning = !!state && state.isTransitioning;

      const previouslyLastEmittedEvent = lastEmittedEvent;

      if (lastEmittedEvent === 'didBlur') {
        if (eventName === 'willFocus' && isFocused) {
          emit((lastEmittedEvent = 'willFocus'), childPayload);
        } else if (eventName === 'action' && isFocused) {
          emit((lastEmittedEvent = 'willFocus'), childPayload);
        }
      }
      if (lastEmittedEvent === 'willFocus') {
        if (eventName === 'didFocus' && isFocused && !isTransitioning) {
          emit((lastEmittedEvent = 'didFocus'), childPayload);
        } else if (!isTransitioning && isFocused && eventName === 'action') {
          emit((lastEmittedEvent = 'didFocus'), childPayload);
        }
      }

      if (lastEmittedEvent === 'didFocus') {
        if (!isFocused || eventName === 'willBlur') {
          emit((lastEmittedEvent = 'willBlur'), childPayload);
        } else if (
          eventName === 'action' &&
          previouslyLastEmittedEvent === 'didFocus'
        ) {
          emit('action', childPayload);
        }
      }

      if (lastEmittedEvent === 'willBlur') {
        if (!isTransitioning && !isFocused && eventName === 'action') {
          emit((lastEmittedEvent = 'didBlur'), childPayload);
        } else if (eventName === 'didBlur') {
          emit((lastEmittedEvent = 'didBlur'), childPayload);
        }
      }
    })
  );

  return (eventName, eventHandler) => {
    const subscribers = getChildSubscribers(eventName);
    if (!subscribers) {
      throw new Error(`Invalid event name "${eventName}"`);
    }
    subscribers.add(eventHandler);
    const remove = () => {
      subscribers.delete(eventHandler);
    };
    return { remove };
  };
}
