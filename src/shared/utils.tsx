import { db } from '../firebase';
import { notification } from 'antd';
import { RegisteredUser, RegistrationData, SlotData, errorHandler } from '.';
import { TestHourInSlot, ChosenHour } from './types';

export const isDev = window.location.hostname === 'localhost';
export const activeRegistrationDevOrProd = isDev
  ? 'activeRegistrationDev'
  : 'activeRegistration';

/**
 * Function preparing the registration data to be displayed in a table
 * @param activeRegistration
 * @returns
 */
export const getRegistrationsForThisWeek = async (
  weekId: string | undefined,
): Promise<any> => {
  if (!weekId) {
    return;
  }

  const registrationsRef = db
    .collection('registrations')
    .where('weekId', '==', weekId);
  const registrationsDoc = await registrationsRef.get();
  const registrations: RegisteredUser[] = [];
  registrationsDoc.forEach((registrationDoc: any) => {
    registrations.push({
      id: registrationDoc.id,
      ...registrationDoc.data(),
    });
  });

  const weeksRef = db.collection('weeks').where('id', '==', weekId);
  const weeksDoc = await weeksRef.get();
  const weeks: RegistrationData[] = [];
  weeksDoc.forEach((weekDoc: any) => {
    weeks.push({
      ...weekDoc.data(),
    });
  });
  const week = weeks[0];

  if (week.legacy) {
    return { legacy: true };
  }

  const weekDate = week.week
    .map(w => new Date(w.seconds * 1000).toLocaleDateString())
    .flat()
    .join(' - ');
  const allSlots = week.slots.map((slot: SlotData) => ({
    slotId: slot.id,
    slotName: slot.slotName,
    testHours: slot.testHours,
  }));

  const usersMappedToSlots = allSlots.map(
    ({
      slotId,
      testHours,
    }: {
      slotId: string;
      testHours: TestHourInSlot[];
    }) => {
      const registeredUsers = registrations.filter(
        (registeredUser: RegisteredUser) => {
          const userRegistrationTimeForSlot = registeredUser.testHours.find(
            (testHour: ChosenHour) => testHour.slotId === slotId,
          );
          return userRegistrationTimeForSlot;
        },
      );
      const users = registeredUsers.map((registeredUser: RegisteredUser) => {
        const userRegistrationForSlot = registeredUser.testHours.find(
          (userTestHour: ChosenHour) => userTestHour.slotId === slotId,
        );
        const userRegistrationHour =
          testHours.find(
            (slotTestHour: TestHourInSlot) =>
              slotTestHour.id === userRegistrationForSlot?.hourId,
          )?.hour ?? '-';
        const allUsersRegisteredForSlot = registrations
          .filter(
            (rU: RegisteredUser) =>
              rU.weekId === weekId &&
              rU.testHours.find(
                (userTestHour: ChosenHour) => userTestHour.slotId === slotId,
              ) === userRegistrationForSlot,
          )
          .sort((a, b) => a.registeredTimestamp - b.registeredTimestamp);
        const placesTaken = allUsersRegisteredForSlot.length;
        const slotPlacesLimit =
          testHours.find(
            (slotTestHour: TestHourInSlot) =>
              slotTestHour.id === userRegistrationForSlot?.hourId,
          )?.places ?? 0;
        const placesLeft = slotPlacesLimit - placesTaken;
        const registeredTooLate =
          placesLeft < 0 &&
          allUsersRegisteredForSlot.findIndex(
            u => u.email === registeredUser.email,
          ) >= slotPlacesLimit;
        const usersRegisteredHourFixed =
          !userRegistrationHour.startsWith('0') &&
          userRegistrationHour?.length === 4
            ? `0${userRegistrationHour}`
            : userRegistrationHour;
        const userRegistrationData: any = {
          registeredAt: registeredUser?.registeredTimestamp ?? 0,
          name: registeredUser?.name ?? registeredUser?.email ?? '<unknown>',
          hour: usersRegisteredHourFixed,
          email: registeredUser?.email ?? 'cog.in.bot@gmail.com',
          registeredTooLate,
          comment: registeredUser?.comment,
        };
        return userRegistrationData;
      });
      return users;
    },
  );

  const finalData = {
    weekDate,
    usersRegistrationData: usersMappedToSlots,
    weeks: week.slots.map((slot: SlotData) => slot.slotName),
  };
  return finalData;
};

/**
 * Function preparing data specifically for Excel export
 * @param activeRegistration
 * @param preparedForExcel
 * @returns
 */
export const getRegistrationsForExcel = async (
  weekId: string | undefined,
): Promise<any> => {
  if (!weekId) {
    return;
  }

  const registrationsRef = db
    .collection('registrations')
    .where('weekId', '==', weekId);
  const registrationsDoc = await registrationsRef.get();
  const registrations: RegisteredUser[] = [];
  registrationsDoc.forEach((registrationDoc: any) => {
    registrations.push({
      id: registrationDoc.id,
      ...registrationDoc.data(),
    });
  });

  const weeksRef = db.collection('weeks').where('id', '==', weekId);
  const weeksDoc = await weeksRef.get();
  const weeks: RegistrationData[] = [];
  weeksDoc.forEach((weekDoc: any) => {
    weeks.push({
      ...weekDoc.data(),
    });
  });
  const week = weeks[0];

  if (week.legacy) {
    return { legacy: true };
  }

  const weekDate = week.week
    .map((w: any) => new Date(w.seconds * 1000).toLocaleDateString())
    .flat()
    .join(' - ');
  const allSlots = week.slots.map((slot: SlotData) => ({
    slotId: slot.id,
    slotTestHours: slot.testHours,
  }));

  const usersMappedToSlots = allSlots.map(
    ({
      slotId,
      slotTestHours,
    }: {
      slotId: string;
      slotTestHours: TestHourInSlot[];
    }) => {
      const users = registrations.map((registeredUser: RegisteredUser) => {
        const userInThisSlot = registeredUser.testHours.find(
          (userTestHour: ChosenHour) => userTestHour.slotId === slotId,
        );
        if (!userInThisSlot) {
          return ['', '', '', '', '', ''];
        }
        const registeredHour = slotTestHours.find(
          (slotTestHour: TestHourInSlot) =>
            slotTestHour.id === userInThisSlot.hourId,
        )?.hour;
        const usersRegisteredHour =
          !registeredHour?.startsWith('0') && registeredHour?.length === 4
            ? `0${registeredHour}`
            : registeredHour;
        const field = [
          '',
          '',
          registeredUser.name ?? registeredUser.email,
          registeredUser.email,
          usersRegisteredHour,
          registeredUser.comment,
        ];
        return field;
      });
      return users;
    },
  );

  const mergedUsers: any[] = [];
  usersMappedToSlots[0].forEach((_: any, i: number) => {
    const otherSlotsForUser = usersMappedToSlots.map((user: any) => user[i]);
    mergedUsers.push(otherSlotsForUser.flat());
  });

  const headers = [
    weekDate,
    ...week.slots.map((slot: SlotData) => [
      slot.slotName.toUpperCase(),
      'Name',
      'Email',
      'Hour',
      'Comment',
      '',
    ]),
  ];

  const final = [headers.flat(), ...mergedUsers];
  return { final, weekDate };
};

/**
 * Saves the email of people allowed to preregistration to database.
 * @param emails string[]
 * @returns void
 */
export const savePreregistrationEmails = (emails: string[]): Promise<void> => {
  return new Promise(resolve => {
    if (!db) {
      resolve();
      return;
    }
    db.collection('options')
      .doc('preregistration')
      .set({
        emails,
      })
      .then(() => {
        notification.success({
          message: 'Yay!',
          description: 'You successfully changed preregistration list!',
        });
        resolve();
      })
      .catch((error: any) => {
        errorHandler(error);
        resolve();
      });
  });
};
