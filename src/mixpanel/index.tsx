import { useEffect, useState } from 'react';
import mixpanel from 'mixpanel-browser';
import { errorHandler, isDev } from '../shared';

export const useMixpanel = (): void => {
  const [mixpanelLoaded, setMixpanelLoaded] = useState(false);
  const token = process.env.REACT_APP_MIXPANEL;
  useEffect(() => {
    if (!token || mixpanelLoaded) {
      return;
    }
    try {
      mixpanel.init(token, { api_host: 'https://api-eu.mixpanel.com' }, '');
      setMixpanelLoaded(true);
    } catch (error) {
      errorHandler(error);
      setMixpanelLoaded(false);
    }
  }, []);
};

type Track = {
  email: string;
  event: string;
  eventOptions?: { [key: string]: string | number | boolean };
};

export const track = ({ email, event, eventOptions = {} }: Track): void => {
  const prefix = 'COGIN';
  try {
    mixpanel.identify(email);
    mixpanel.track(`${prefix}.${event}`, {
      isDev,
      email,
      ...eventOptions,
    });
  } catch (error) {
    mixpanel.track(`${prefix}.mixpanel.ERROR`, {
      email: 'SYSTEM',
      timestamp: Date.now(),
      error,
    });
  }
};

export * from './trackers';
