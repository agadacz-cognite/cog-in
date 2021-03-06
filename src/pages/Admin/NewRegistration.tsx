import React, { useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import 'moment/locale/en-gb';
import { v4 as uuid } from 'uuid';
import { Typography, Button, Popconfirm, Switch, notification } from 'antd';
import { PlusOutlined, WarningOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { Flex, Header, Card } from '../../components';
import {
  AppContext,
  useBackIfNotAdmin,
  useBackIfNotLogged,
} from '../../context';
import { createActiveRegistration } from '../../firebase';
import {
  SlotData,
  RegistrationData,
  isWeekday,
  randomFarAwayDate,
  oldPaths,
} from '../../shared';
import { defaultSlot, defaultHour, defaultPlaces } from './utils';
import Slot from './Slot';
import { RegistrationOption } from './components';

const { Title } = Typography;

export default function NewRegistration(): JSX.Element {
  const history = useHistory();
  const { user, setLoading } = useContext(AppContext);
  const [moreThanOneAllowed, setMoreThanOneAllowed] = useState(true);
  const [weekStartDate, setWeekStartDate] = useState<any | undefined>();
  const [weekEndDate, setWeekEndDate] = useState<any | undefined>();
  const [registrationOpenTime, setRegistrationOpenTime] = useState<any>(
    new Date(),
  );
  const [slots, setSlots] = useState<SlotData[]>([
    {
      ...defaultSlot,
      id: uuid(),
      testHours: [
        {
          hour: defaultHour,
          places: defaultPlaces,
          id: uuid(),
        },
      ],
    },
  ]);

  useBackIfNotLogged();
  useBackIfNotAdmin();

  const onCreateNewRegistration = () => {
    if (!weekStartDate || !weekEndDate) {
      notification.warning({
        message: 'Incomplete data',
        description:
          'You must provide the starting and ending date of the week, for which this registration will be valid!',
      });
      return;
    }
    if (!registrationOpenTime) {
      notification.warning({
        message: 'Incomplete data',
        description:
          'You must provide the time when people can start registering for this event!',
      });
      return;
    }
    if (!slots?.length) {
      notification.warning({
        message: 'Incomplete data',
        description: 'You must provide at least one slot for registration!',
      });
      return;
    }
    setLoading(true);
    const week = [weekStartDate, weekEndDate];
    const registrationData: RegistrationData = {
      week,
      registrationOpenTime,
      slots,
      id: uuid(),
      openedBy: user.email,
      moreThanOneAllowed,
    };
    if (weekStartDate && weekEndDate && registrationOpenTime && slots) {
      createActiveRegistration(registrationData);
      setTimeout(() => {
        history.push(oldPaths.admin.path());
        setLoading(false);
      }, 2000);
    }
  };
  const onWeekChange = (dates: Date[]) => {
    const [weekStart, weekEnd] = dates;
    setWeekStartDate(weekStart);
    setWeekEndDate(weekEnd);
  };
  const onStartDateChange = (newStartDate: Date) => {
    setRegistrationOpenTime(newStartDate);
  };
  const onAddSlot = () => {
    const newSlot: SlotData = {
      id: uuid(),
      slotName: '',
      slotSummary: '',
      testHours: [
        {
          hour: defaultHour,
          places: defaultPlaces,
          id: uuid(),
        },
      ],
    };
    setSlots([...slots, newSlot]);
  };
  const onSlotNameChange = (id: string, value: any) => {
    const fixedSlots = slots.map(slot =>
      slot.id === id ? { ...slot, slotName: value } : slot,
    );
    setSlots(fixedSlots);
  };
  const onTestHoursChange = (id: string, value: any) => {
    const fixedSlots = slots.map(slot =>
      slot.id === id ? { ...slot, testHours: value } : slot,
    );
    setSlots(fixedSlots);
  };
  const onSlotSummaryChange = (id: string, value: any) => {
    const fixedSlots = slots.map(slot =>
      slot.id === id ? { ...slot, slotSummary: value } : slot,
    );
    setSlots(fixedSlots);
  };
  const onSlotDelete = (id: string) => {
    const fixedSlots = slots.filter(slot => slot.id !== id);
    setSlots(fixedSlots);
  };

  const onBack = () => history.push(oldPaths.admin.path());

  return (
    <Flex column style={{ maxWidth: '1024px', margin: 'auto' }}>
      <Header>
        <Title level={2} style={{ marginBottom: '4px' }}>
          Open registration for new week
        </Title>
        <Flex align justify style={{ fontSize: '0.8em' }}>
          Logged in as {user?.displayName ?? '-'} ({user?.email ?? '-'})
        </Flex>
      </Header>
      <Flex row justify style={{ flexWrap: 'wrap' }}>
        <Flex column>
          <Card
            title="Select the week of the registration"
            style={{ margin: '8px', maxWidth: '400px' }}>
            <Flex column align justify>
              <DatePicker
                selected={weekStartDate}
                // @ts-ignore
                onChange={onWeekChange}
                startDate={weekStartDate}
                endDate={weekEndDate}
                minDate={new Date()}
                maxDate={randomFarAwayDate}
                filterDate={isWeekday}
                locale="en-GB"
                selectsRange
                inline
              />
            </Flex>
          </Card>
          <Card title="Options" style={{ margin: '8px', maxWidth: '400px' }}>
            <RegistrationOption align>
              <p>Date and time of opening registration</p>
              <DatePicker
                selected={registrationOpenTime}
                onChange={onStartDateChange}
                minDate={new Date()}
                maxDate={randomFarAwayDate}
                dateFormat="MMMM d, yyyy h:mm aa"
                customInput={<CustomInput disabled />}
                locale="en-GB"
                showTimeSelect
                calendarContainer={({ children }) => (
                  <Flex
                    row
                    style={{
                      backgroundColor: 'white',
                      border: '1px solid grey',
                    }}>
                    {children}
                  </Flex>
                )}
              />
            </RegistrationOption>
            <RegistrationOption align>
              <p>Allow selecting more than one option per slot</p>
              <Switch
                checkedChildren="Yes"
                unCheckedChildren="No"
                checked={moreThanOneAllowed}
                onChange={setMoreThanOneAllowed}
              />
            </RegistrationOption>
          </Card>
        </Flex>
        <Card
          title="Add slots for testing"
          style={{ margin: '8px', maxWidth: '500px' }}>
          <Flex column>
            <p>
              Here you can choose a day when testing is carried out, hours
              during which testing happens, and the days during which employee
              is eligible to come to the office after test.
            </p>
            {slots?.map((slot: SlotData, index: number) => (
              <Slot
                slot={slot}
                key={`slot-${index}`}
                onSlotNameChange={onSlotNameChange}
                onTestHoursChange={onTestHoursChange}
                onSlotSummaryChange={onSlotSummaryChange}
                onSlotDelete={onSlotDelete}
              />
            ))}
            <Button
              type="dashed"
              icon={<PlusOutlined />}
              onClick={onAddSlot}
              style={{ width: '100%', marginTop: '8px' }}
            />
          </Flex>
        </Card>
      </Flex>
      <Header style={{ flexDirection: 'row' }}>
        <Button
          type="primary"
          size="large"
          onClick={onBack}
          style={{ marginRight: '8px' }}>
          Cancel
        </Button>
        <Popconfirm
          title={
            <div>
              <div>Are you sure you want to start a new registration?</div>
              <div style={{ fontWeight: 'bold' }}>
                <WarningOutlined style={{ marginRight: '8px', color: 'red' }} />
                This will CLOSE the old one!
              </div>
            </div>
          }
          onConfirm={onCreateNewRegistration}
          okText="Do it"
          okButtonProps={{ danger: true }}
          cancelButtonProps={{ type: 'primary' }}
          cancelText="Nope :c"
          placement="top">
          <Button type="primary" size="large" danger>
            Open new registration
          </Button>
        </Popconfirm>
      </Header>
    </Flex>
  );
}

const CustomInput = styled.input`
  border: none;
  background-color: #95abde;
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  cursor: pointer;
  user-select: none;
`;
