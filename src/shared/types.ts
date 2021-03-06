export type Day = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday';

export type Time = {
  seconds: number;
  nanoseconds: number;
};

export type TestHourInSlot = {
  hour: string;
  places: number;
  id: string;
};
export type SlotData = {
  id: string;
  slotName: string;
  slotSummary: string;
  testHours: TestHourInSlot[];
};

export type TestHour = {
  hourId: string;
  time: string;
  totalPlaces: number;
  takenPlaces: number;
};

export type ChosenHour = {
  slotId: string;
  hourId: string;
};

export type FixedSlotData = {
  id: string;
  testHours: TestHour[];
};

export type RegistrationData = {
  id: string;
  slots: SlotData[];
  registrationOpenTime: Time;
  week: Time[];
  legacy?: boolean;
  isDev?: boolean;
  openedBy?: string;
  moreThanOneAllowed: boolean;
};

export type RegisteredUser = {
  id?: string;
  email: string;
  name: string;
  weekId: string;
  comment?: string;
  registeredTimestamp: number;
  testHours: ChosenHour[];
};

export type SendEmailProps = {
  email: string;
  subject: string;
  content: string;
};
