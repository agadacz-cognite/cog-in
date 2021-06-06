import React, { useContext, useState } from 'react';
import { useHistory } from 'react-router-dom';
import ReactPlayer from 'react-player/youtube';
import {
  Button,
  Typography,
  Spin,
  Popconfirm,
  notification,
  Tooltip,
} from 'antd';
import { InfoCircleOutlined, CalendarOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { v4 as uuid } from 'uuid';
import {
  AppContext,
  useActiveRegistration,
  useUsersRegistration,
  useIsUserAdmin,
  useBackIfNotLogged,
  useCanUserPreregister,
} from '../context';
import { removeUserRegistration } from '../firebase/utils';
import {
  clickContactLinkTracker,
  addCalendarEventTracker,
  failedAddCalendarEventTracker,
  startVideoTracker,
} from '../mixpanel';
import {
  getUserTestHours,
  oldPaths,
  sendEmail,
  translateHourIdToHour,
  ChosenHour,
  errorHandler,
  eventDetails,
  eventVideo,
  eventTitle,
  EventDetails,
} from '../shared';
import { Flex, Card, Header, InfoBar } from '../components';

dayjs.extend(relativeTime);

const { Title } = Typography;

const StyledFlex = styled(Flex)`
  & > * {
    margin: 12px 0;
  }
`;
const PanelPending = styled(Flex)`
  padding: 8px 16px;
  margin-bottom: 16px;
  background-color: #f2efda;
`;
const PanelDone = styled(Flex)`
  padding: 8px 16px;
  margin-bottom: 16px;
  background-color: #e0edd8;
`;

export default function DaysSelection(): JSX.Element {
  const history = useHistory();
  const [remainingTime, setRemainingTime] = useState<string | undefined>();
  const {
    user,
    activeRegistration,
    usersRegistration,
    canPreregister,
    isUserAdmin,
    gapiLoaded,
    setLoading,
  } = useContext(AppContext);

  useBackIfNotLogged();
  useIsUserAdmin();
  useActiveRegistration();
  useCanUserPreregister();
  useUsersRegistration(user?.email, activeRegistration?.id);

  const isUserRegistered =
    usersRegistration?.weekId &&
    usersRegistration?.weekId === activeRegistration?.id;

  const onAdminPageClick = () => history.push(oldPaths.admin.path());
  const onProceed = () => {
    history.push(oldPaths.selection.path());
  };
  const onVideoStart = () => startVideoTracker(user?.email);
  const onDelete = async () => {
    const weekId = usersRegistration?.weekId;
    const email = usersRegistration?.email;
    if (isUserRegistered && weekId && email) {
      const userHours = usersRegistration?.testHours
        .map((testHour: ChosenHour) => {
          const week = activeRegistration?.slots.find(
            slot => slot.id === testHour.slotId,
          );
          const translatedHour = translateHourIdToHour(
            week?.testHours,
            testHour,
          );
          return `${week?.slotName ?? '<unknown>'} - ${
            translatedHour ?? '<unknown>'
          }`;
        })
        .join(', ');
      const userFirstName =
        usersRegistration?.name?.split(' ')?.[0] ?? 'Unknown Person';
      const subject = `🎇 You have deleted registration for the event: ${eventTitle.text}`;
      const content = `Hello ${userFirstName}! You just removed your registration for the event: ${eventTitle.text}. Removed registration: ${userHours}.`;
      setLoading(true);
      await removeUserRegistration(weekId, email);
      sendEmail({
        email: user.email,
        subject,
        content,
      });
      setLoading(false);
    }
  };
  const onCreateCalendarEvent = () => {
    if (gapiLoaded) {
      (window as any).gapi.client.load('calendar', 'v3', () =>
        notification.info({
          message: 'Please wait...',
          description:
            'Google Calendar API properly loaded, creating events...',
        }),
      );

      const userTestHours = getUserTestHours(
        usersRegistration,
        activeRegistration,
      );

      if (userTestHours.error) {
        notification.error({
          message: 'Something went wrong.',
          description: userTestHours.error,
        });
        return;
      }

      (window as any).gapi.auth2
        .getAuthInstance()
        .signIn()
        .then(() => {
          const covidEvents = userTestHours.map((userTestHour: any) => ({
            summary: `🎇‧͙⁺˚*･༓☾ ${eventTitle.text} ☽༓･*˚⁺‧͙ 🎇`,
            location: 'Oksenøyveien 10',
            description:
              '✨EVENT DETAILS✨\n\n' +
              eventDetails.map(g => g.text).join('\n\n- '),
            start: {
              dateTime: userTestHour.start,
              timeZone: 'Europe/Oslo',
            },
            end: {
              dateTime: userTestHour.end,
              timeZone: 'Europe/Oslo',
            },
            kind: 'calendar#event',
          }));
          covidEvents.forEach((covidEvent: any) => {
            (window as any).gapi.client.calendar.events
              .insert({
                calendarId: 'primary',
                resource: covidEvent,
              })
              .then(() => {
                notification.success({
                  message: 'Success',
                  description: 'Calendar event successfully created!',
                });
                addCalendarEventTracker(user?.email);
              })
              .catch((error: any) => {
                errorHandler(error);
                failedAddCalendarEventTracker(user?.email, error);
                notification.warning({
                  message: 'Cannot create calendar event',
                  description: 'Im so sorry :c',
                });
              });
          });
        })
        .catch((error: any) => {
          errorHandler(error);
          failedAddCalendarEventTracker(user?.email, error);
        });
    }
  };

  const getUserFirstName = () => {
    if (user?.displayName) {
      const name = user.displayName.split(' ');
      return name[0];
    }
    return 'unknown entity';
  };

  const ifNoRegistration = (): JSX.Element | undefined => {
    if (!activeRegistration) {
      return (
        <Title level={5}>There is no active registration at the moment!</Title>
      );
    }
    return undefined;
  };

  const ifNotRegisteredYet = (): JSX.Element | undefined => {
    const registrationOpenTimestamp =
      (activeRegistration?.registrationOpenTime?.seconds ?? 0) * 1000;
    const registrationIsOpen = registrationOpenTimestamp <= Number(new Date());
    if (
      !isUserRegistered &&
      activeRegistration &&
      (registrationIsOpen || canPreregister)
    ) {
      return (
        <StyledFlex column justify align>
          {canPreregister && !registrationIsOpen && (
            <Flex
              row
              align
              justify
              style={{ backgroundColor: '#e6e7f7', padding: '8px 16px' }}>
              <InfoCircleOutlined />
              <Title level={5} style={{ margin: '0 0 0 8px', padding: 0 }}>
                You can preregister!
              </Title>
            </Flex>
          )}
          <Title level={5}>You didn&apos;t register for this event yet.</Title>
        </StyledFlex>
      );
    }
  };

  const ifRegistrationOpen = (): JSX.Element | undefined => {
    const registrationOpenTimestamp =
      (activeRegistration?.registrationOpenTime?.seconds ?? 0) * 1000;
    if (
      activeRegistration &&
      (registrationOpenTimestamp <= Number(new Date()) || canPreregister)
    ) {
      return (
        <StyledFlex column justify align>
          <Button type="primary" onClick={onProceed} style={{ margin: '4px' }}>
            {isUserRegistered ? 'Change your choice' : 'Register'}
          </Button>
          {isUserRegistered && (
            <Popconfirm
              title={
                <>
                  <div>Are you sure you want to delete your registration?</div>
                  <div>
                    You will be able to register again (if there are any slots
                    left).
                  </div>
                </>
              }
              onConfirm={onDelete}
              okText="Delete"
              okButtonProps={{ danger: true }}
              cancelButtonProps={{ type: 'primary' }}
              cancelText="Nope :c"
              placement="right">
              <Button type="primary" danger style={{ margin: '4px' }}>
                Delete your registration
              </Button>
            </Popconfirm>
          )}
        </StyledFlex>
      );
    }
    return undefined;
  };

  const ifRegistrationPending = (): JSX.Element | undefined => {
    setInterval(() => {
      const registrationSeconds =
        activeRegistration?.registrationOpenTime?.seconds ?? 0;
      if (!registrationSeconds) {
        return;
      }
      const dateOfRegistrationOpen = dayjs.unix(registrationSeconds);
      const remaining =
        dayjs().to(dateOfRegistrationOpen) ?? 'I dont know when';
      setRemainingTime(remaining);
    }, 1000);

    const registrationOpenTimestamp =
      (activeRegistration?.registrationOpenTime?.seconds ?? 0) * 1000;

    if (activeRegistration && registrationOpenTimestamp > Number(new Date())) {
      return (
        <PanelPending column align justify>
          <Title level={4} style={{ margin: '4px' }}>
            Registration opens:
          </Title>
          <Title level={3} style={{ margin: '4px' }}>
            {remainingTime ?? '-'}
          </Title>
          <Title level={5} style={{ margin: '4px' }}>
            ({new Date(registrationOpenTimestamp).toLocaleString()})
          </Title>
        </PanelPending>
      );
    }
    return undefined;
  };

  const ifAlreadyRegistered = (): JSX.Element | undefined => {
    if (isUserRegistered) {
      return (
        <PanelDone column align justify>
          {(usersRegistration?.testHours ?? []).map(
            (chosenHour: ChosenHour, index: number) => {
              const week = activeRegistration?.slots.find(
                slot => slot.id === chosenHour.slotId,
              );
              const userHours = translateHourIdToHour(
                week?.testHours,
                chosenHour,
              );
              return (
                <Flex column align justify key={`your-slot-${index}`}>
                  <Title level={5}>
                    {week?.slotName ?? '<unknown>'} - {userHours ?? '<unknown>'}
                  </Title>
                </Flex>
              );
            },
          )}
          <Tooltip title={'Adding events to calendar is temporarily disabled.'}>
            <Button
              icon={<CalendarOutlined />}
              onClick={onCreateCalendarEvent}
              style={{ margin: '4px' }}
              disabled>
              Add to calendar
            </Button>
          </Tooltip>
        </PanelDone>
      );
    }
  };

  if (!user) {
    return <Spin size="large" />;
  }
  return (
    <Flex column style={{ margin: 'auto' }}>
      <Header>
        <Title level={2} style={{ marginBottom: '4px' }}>
          {eventTitle.text}
        </Title>
        <p>Hello, {getUserFirstName()}!</p>
        <Flex align justify style={{ fontSize: '0.8em' }}>
          Logged in as {user?.displayName ?? '-'} ({user?.email ?? '-'})
        </Flex>
      </Header>
      <Flex row align justify style={{ flexWrap: 'wrap' }}>
        <Flex column>
          {isUserAdmin && (
            <Card style={{ width: 'auto', height: 'auto', margin: '8px' }}>
              <Flex row align justify>
                <Button type="primary" danger onClick={onAdminPageClick}>
                  Go to Admin page
                </Button>
              </Flex>
            </Card>
          )}
          <Card
            title="Your events"
            style={{ width: 'auto', height: 'auto', margin: '8px' }}>
            <Flex column align justify>
              {ifRegistrationPending()}
              {ifAlreadyRegistered()}
              {ifNotRegisteredYet()}
              {ifNoRegistration()}
              {ifRegistrationOpen()}
            </Flex>
          </Card>
        </Flex>
        <Card
          title={
            <Title level={4} style={{ margin: 0 }}>
              <a href={eventTitle.link ?? ''} target="_blank" rel="noreferrer">
                {eventTitle.text}
              </a>
            </Title>
          }
          style={{
            width: 'auto',
            height: 'auto',
            maxWidth: '600px',
            margin: '8px',
          }}>
          <StyledFlex column justify>
            {eventDetails.map((eventDetail: EventDetails) => (
              <span
                key={uuid()}
                style={{
                  margin: '2px',
                  textAlign: 'justify',
                  fontWeight: eventDetail.important ? 'bold' : 'normal',
                }}>
                ● {eventDetail.text}
              </span>
            ))}
            {eventVideo && (
              <ReactPlayer
                url={eventVideo}
                width="100%"
                onStart={onVideoStart}
              />
            )}
          </StyledFlex>
        </Card>
      </Flex>
      <InfoBar>
        Technical problems with app?{' '}
        <a
          href="mailto:anna.gadacz@cognite.com?subject=CogIN Project issue, fix fast pls"
          onClick={() => clickContactLinkTracker(user?.email, 'Anna')}>
          Click to contact Anna.
        </a>
      </InfoBar>
    </Flex>
  );
}
