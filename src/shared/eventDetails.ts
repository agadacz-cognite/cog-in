export type EventTitle = { text: string; link?: string };
export type EventDetails = { text: string; important?: boolean };

export const eventVideo: string | undefined = undefined;
export const eventTitle: EventTitle = {
  text: '🌞 Summer Socials',
  link: 'https://cog.link/summer',
};
export const eventDetails: EventDetails[] = [
  {
    text:
      'Please sign up to the event you would like to participate in for our summer socials in Oslo in 2021. You can only choose one',
  },
  {
    text: 'Each event is limited to 35 guests due to the current guidelines',
  },
  {
    text:
      'The location of the event is Grünerhaven, an outdoor restaurant where Cognite will serve snacks and drinks',
  },
  {
    text:
      'After signing up, you will receive a calendar event with more details about your chosen event',
  },
  {
    text: 'For more information, head to cog.link/summer',
  },
];
