import { track } from '../';

// new user registration
export const newUserRegistrationTracker = (
  email: string,
  slots: { [key: string]: string },
): void =>
  track({
    email,
    event: 'registration.new',
    eventOptions: { timestamp: Date.now(), ...slots },
  });

export const failedNewUserRegistrationTracker = (
  email: string,
  failReason: string,
): void =>
  track({
    email,
    event: 'registration.new.FAIL',
    eventOptions: { timestamp: Date.now(), failReason },
  });

// user edit registration
export const editUserRegistrationTracker = (
  email: string,
  slots: { [key: string]: string },
): void =>
  track({
    email,
    event: 'registration.edit',
    eventOptions: { timestamp: Date.now(), ...slots },
  });

export const failedEditUserRegistrationTracker = (
  email: string,
  failReason: string,
): void =>
  track({
    email,
    event: 'registration.edit.FAIL',
    eventOptions: { timestamp: Date.now(), failReason },
  });

// user delete registration
export const deleteUserRegistrationTracker = (email: string): void =>
  track({
    email,
    event: 'registration.delete',
    eventOptions: { timestamp: Date.now() },
  });

export const failedDeleteUserRegistrationTracker = (
  email: string,
  failReason: string,
): void =>
  track({
    email,
    event: 'registration.delete.FAIL',
    eventOptions: { timestamp: Date.now(), failReason },
  });
