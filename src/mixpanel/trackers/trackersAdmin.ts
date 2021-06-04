import { track } from '../';

// admin creates new registration
export const newRegistrationTracker = (registrationId: string): void =>
  track({
    email: 'ADMIN',
    event: 'admin.registration.create',
    eventOptions: { timestamp: Date.now(), registrationId },
  });

export const failedNewRegistrationTracker = (
  registrationId: string,
  failReason: string,
): void =>
  track({
    email: 'ADMIN',
    event: 'admin.registration.create.FAIL',
    eventOptions: { timestamp: Date.now(), failReason, registrationId },
  });

// admin edits active registration
export const editRegistrationTracker = (registrationId: string): void =>
  track({
    email: 'ADMIN',
    event: 'admin.registration.edit',
    eventOptions: { timestamp: Date.now(), registrationId },
  });

export const failedEditRegistrationTracker = (
  registrationId: string,
  failReason: string,
): void =>
  track({
    email: 'ADMIN',
    event: 'admin.registration.edit.FAIL',
    eventOptions: { timestamp: Date.now(), failReason, registrationId },
  });

// admin closes registration
export const closeRegistrationTracker = (): void =>
  track({
    email: 'ADMIN',
    event: 'admin.registration.close',
    eventOptions: { timestamp: Date.now() },
  });

export const failedCloseRegistrationTracker = (failReason: string): void =>
  track({
    email: 'ADMIN',
    event: 'admin.registration.close.FAIL',
    eventOptions: { timestamp: Date.now(), failReason },
  });
