import { track } from '../';

export const gapiLoadedTracker = (
  gapiLoaded: boolean,
  error = 'UNKNOWN ERROR',
): void =>
  track({
    email: 'UNKNOWN',
    event: gapiLoaded ? 'gapi.loaded' : 'gapi.loaded.ERROR',
    eventOptions: { timestamp: Date.now(), error },
  });

export const logInErrorTracker = (
  email = 'UNKNOWN',
  error = 'UNKNOWN ERROR',
): void =>
  track({
    email,
    event: 'login.ERROR',
    eventOptions: { timestamp: Date.now(), error },
  });

export const generalErrorTracker = (
  email = 'UNKNOWN',
  error = 'UNKNOWN ERROR',
): void =>
  track({
    email,
    event: 'general.ERROR',
    eventOptions: { timestamp: Date.now(), error },
  });
