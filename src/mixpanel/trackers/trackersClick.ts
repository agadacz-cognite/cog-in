import { track } from '../';

export const clickContactLinkTracker = (email: string, contact: string): void =>
  track({
    email: email ?? 'UNKNOWN ENTITY',
    event: 'link.contact.click',
    eventOptions: { timestamp: Date.now(), contact },
  });

export const clickGithubLinkTracker = (email: string): void =>
  track({
    email: email ?? 'UNKNOWN ENTITY',
    event: 'link.github.click',
    eventOptions: { timestamp: Date.now() },
  });

export const clickMixpanelLinkTracker = (email: string): void =>
  track({
    email: email ?? 'UNKNOWN ENTITY',
    event: 'link.mixpanel.click',
    eventOptions: { timestamp: Date.now() },
  });

// calendar event
export const addCalendarEventTracker = (email: string): void =>
  track({
    email: email ?? 'UNKNOWN ENTITY',
    event: 'event.calendar.add',
    eventOptions: { timestamp: Date.now() },
  });

export const failedAddCalendarEventTracker = (
  email: string,
  failReason: string,
): void =>
  track({
    email: email ?? 'UNKNOWN ENTITY',
    event: 'event.calendar.add.FAIL',
    eventOptions: { timestamp: Date.now(), failReason },
  });

// video
export const startVideoTracker = (email: string): void =>
  track({
    email: email ?? 'UNKNOWN ENTITY',
    event: 'video.watch',
    eventOptions: { timestamp: Date.now() },
  });
