import React from 'react';
import { notification } from 'antd';
import {
  RegisteredUser,
  RegistrationData,
  SendEmailProps,
  ChosenHour,
  TestHourInSlot,
} from './types';
import { eventTitle } from '../shared';

export const randomFarAwayDate = new Date(1934832714000);

/**
 * Handles an error
 * @param error
 */
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const errorHandler = (error: any): void => {
  notification.error({
    message: 'Something went wrong.',
    description: (
      <div>
        <p>Don&apos;t worry, you probably just need to refresh the page!</p>
        <p>
          Click{' '}
          <a
            href={`mailto:anna.gadacz@cognite.com?subject=CogIN! Project issue, fix fast pls&body=${String(
              error,
            )}`}>
            HERE{' '}
          </a>
          to send an email to Anna.
        </p>
        <span></span>
      </div>
    ),
  });
};

/**
 * Compares string a with string b
 * @param a
 * @param b
 * @returns
 */
export const stringCompare = (a = '', b = ''): any => {
  const al = a.replace(/\s+/g, '');
  const bl = b.replace(/\s+/g, '');
  return al.localeCompare(bl, 'nb');
};

/**
 * Returns false for Saturday/Sunday and true for other days.
 * @param date
 * @returns
 */
export const isWeekday = (date: Date): boolean => {
  const weekdays = [1, 2, 3, 4, 5];
  return weekdays.includes(date.getDay());
};

/**
 *
 * @param param0
 */
export const sendEmail = ({
  email,
  subject,
  content,
}: SendEmailProps): void => {
  (window as any).Email.send({
    SecureToken: process.env.REACT_APP_EMAIL_API_KEY,
    Username: 'CogIN! Registration bot',
    To: email,
    From: 'cogcovidtest@gmail.com',
    Subject: subject,
    Body: content,
  });
};

/**
 * This sends email to uer but entire logic is here
 * @param registeredUser
 */
export const sendEmailToUser = (
  registeredUser: RegisteredUser,
  activeRegistration: RegistrationData,
): void => {
  const week = `${new Date(
    (activeRegistration?.week[0]?.seconds ?? 0) * 1000,
  ).toLocaleDateString()} - ${new Date(
    (activeRegistration?.week[1]?.seconds ?? 0) * 1000,
  ).toLocaleDateString()}`;
  const userHours = registeredUser?.testHours
    .map((testHour: ChosenHour) => {
      const week = activeRegistration?.slots.find(
        slot => slot.id === testHour.slotId,
      );
      const translatedHour = translateHourIdToHour(week?.testHours, testHour);
      return `${week?.slotName ?? '<unknown>'} - ${
        translatedHour ?? '<unknown>'
      }`;
    })
    .join(', ');
  const userFirstName =
    registeredUser.name?.split(' ')?.[0] ?? 'Unknown Person';
  const subject = `🎇 You have registered to an event! Week ${week}`;
  const content = `Hello ${userFirstName}! You just registered for an event: ${eventTitle}. Details: ${userHours}.`;

  sendEmail({
    email: registeredUser.email,
    subject,
    content,
  });
};

/** Extracts the hour id from the ChosenHour[] object, and returns the actual hour (r undefined if ID does not map to anything) */
export const translateHourIdToHour = (
  testHours: TestHourInSlot[] | undefined,
  chosenHour: ChosenHour,
): string | undefined => {
  const { hourId } = chosenHour;
  if (!testHours || !chosenHour) {
    return undefined;
  }
  const hourObj = testHours.find(
    (testHour: TestHourInSlot) => testHour.id === hourId,
  );
  return hourObj?.hour;
};

export const translateSlotsToHuman = (
  userTestHours: ChosenHour[] = [],
  activeRegistration: RegistrationData,
): { [key: string]: string } => {
  const mappedSlots: any = {};
  userTestHours.forEach((chosenHour: ChosenHour, index: number) => {
    const week = activeRegistration?.slots.find(
      slot => slot.id === chosenHour.slotId,
    );
    const userHours = translateHourIdToHour(week?.testHours, chosenHour);
    mappedSlots[`slot-${index}`] = `${week?.slotName ?? 'UNKNOWN'} - ${
      userHours ?? 'UNKNOWN'
    }`;
  });
  return mappedSlots;
};

/**
 * Does something
 * @param weekStart
 * @param dayName
 * @param hour
 * @returns
 */
export const translateTestDateToTimestamp = (
  weekStart: number,
  dayName: string,
  hour: string,
): Date => {
  const newDate = new Date();
  const startDate = new Date(weekStart);
  const dayOfTheWeek = [
    'sunday',
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
  ];
  const dayIndex = dayOfTheWeek.findIndex(
    (day: string) => day === dayName.toLowerCase(),
  );
  const firstDay = startDate.getDay();
  const hourPartOfDate = hour
    .split(':')
    .map((splitHour: string) => Number(splitHour));
  const newDateTimestamp =
    startDate.getDate() + ((7 + dayIndex - firstDay) % 7);
  newDate.setDate(newDateTimestamp);
  newDate.setHours(hourPartOfDate[0]);
  newDate.setMinutes(hourPartOfDate[1]);

  return newDate;
};

/**
 * Gets users registration and active regstration data, then does some magic and returns accurate dates of user's testing appointments.
 * @param usersRegistration
 * @param activeRegistration
 * @returns
 */
export const getUserTestHours = (
  usersRegistration: RegisteredUser | undefined,
  activeRegistration: RegistrationData | undefined,
): any => {
  if (!usersRegistration || !activeRegistration) {
    return { error: 'Necessary data does not exist.' };
  }
  const userTestHours = (usersRegistration?.testHours ?? []).map(
    (chosenHour: ChosenHour) => {
      const week = activeRegistration?.slots.find(
        slot => slot.id === chosenHour.slotId,
      );
      const userHours = translateHourIdToHour(week?.testHours, chosenHour);
      return { slotName: week?.slotName, hours: userHours };
    },
  );
  const testDates = userTestHours.map((userTestHour: any) => {
    const startDate = translateTestDateToTimestamp(
      (activeRegistration?.week[0]?.seconds ?? 0) * 1000,
      userTestHour.slotName,
      userTestHour.hours,
    );
    const endDate = translateTestDateToTimestamp(
      (activeRegistration?.week[0]?.seconds ?? 0) * 1000,
      userTestHour.slotName,
      userTestHour.hours,
    );
    endDate.setMinutes(endDate.getMinutes() + 20);
    return {
      start: startDate,
      end: endDate,
    };
  });
  return testDates;
};
