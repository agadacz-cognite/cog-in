import React, { useState, useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import 'moment/locale/en-gb';
import { v4 as uuid } from 'uuid';
import {
  Typography,
  Button,
  Popconfirm,
  Spin,
  Switch,
  notification,
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { Flex, Header, Card } from '../../components';
import {
  AppContext,
  useBackIfNotAdmin,
  useBackIfNotLogged,
} from '../../context';
import { editActiveRegistration } from '../../firebase';
import { SlotData, isWeekday, randomFarAwayDate, oldPaths } from '../../shared';
import { defaultNewHour } from './utils';
import Slot from './Slot';
import { RegistrationOption } from './components';

const { Title } = Typography;

export default function EditRegistration(): JSX.Element {
  const history = useHistory();
  const { user, setLoading, activeRegistration } = useContext(AppContext);
  const [initLoaded, setInitLoaded] = useState(false);
  const [moreThanOneAllowed, setMoreThanOneAllowed] = useState(
    activeRegistration?.moreThanOneAllowed ?? true,
  );
  const [weekStartDate, setWeekStartDate] = useState<any>(new Date());
  const [weekEndDate, setWeekEndDate] = useState<any>(new Date());
  const [registrationOpenTime, setRegistrationOpenTime] = useState<any>(
    new Date(),
  );
  const [slots, setSlots] = useState<SlotData[]>([]);

  useEffect(() => {
    if (activeRegistration && !initLoaded) {
      const startDate: Date = new Date(
        (activeRegistration?.week[0]?.seconds ?? 0) * 1000,
      );
      const endDate = new Date(
        (activeRegistration?.week[1]?.seconds ?? 0) * 1000,
      );
      const openTime = new Date(
        (activeRegistration?.registrationOpenTime?.seconds ?? 0) * 1000,
      );
      setWeekStartDate(startDate);
      setWeekEndDate(endDate);
      setRegistrationOpenTime(openTime);
      setSlots(activeRegistration?.slots ?? []);
      setInitLoaded(true);
    }
  }, [initLoaded, activeRegistration]);

  useBackIfNotLogged();
  useBackIfNotAdmin();

  const onEditActiveRegistration = () => {
    if (!weekStartDate || !weekEndDate) {
      notification.warning({
        message: 'Incomplete data',
        description:
          'You must provide the starting and ending date of the week, for which this event will be valid!',
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
        description: 'You must provide at least one slot for the event!',
      });
      return;
    }
    setLoading(true);
    const week = [weekStartDate, weekEndDate];
    const activeRegistrationId = activeRegistration?.id;
    const registrationData = {
      week,
      registrationOpenTime,
      slots,
      id: activeRegistrationId ?? uuid(),
      moreThanOneAllowed,
    };
    const canEditRegistration =
      activeRegistrationId &&
      weekStartDate &&
      weekEndDate &&
      registrationOpenTime &&
      slots;
    if (canEditRegistration) {
      editActiveRegistration(activeRegistrationId, registrationData);
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
      testHours: [defaultNewHour],
      slotSummary: '',
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
          Edit active event
        </Title>
        <p>
          Logged in as {user?.displayName ?? '-'} ({user?.email ?? '-'})
        </p>
      </Header>
      {!initLoaded && <Spin size="large" />}
      {initLoaded && (
        <Flex row justify style={{ flexWrap: 'wrap' }}>
          <Flex column>
            <Card
              title="Select the week of the event"
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
          <Card title="Add slots" style={{ margin: '8px', maxWidth: '500px' }}>
            <Flex column>
              <p>
                Here you can customize slots for people to choose when
                registering.
              </p>
              {slots?.map((slot: SlotData, index: number) => {
                return (
                  <Slot
                    slot={slot}
                    key={`slot-${index}`}
                    onSlotNameChange={onSlotNameChange}
                    onTestHoursChange={onTestHoursChange}
                    onSlotSummaryChange={onSlotSummaryChange}
                    onSlotDelete={onSlotDelete}
                  />
                );
              })}
              <Button
                type="dashed"
                icon={<PlusOutlined />}
                onClick={onAddSlot}
                style={{ width: '100%', marginTop: '8px' }}
              />
            </Flex>
          </Card>
        </Flex>
      )}
      <Header style={{ flexDirection: 'row' }}>
        <Button
          type="primary"
          size="large"
          onClick={onBack}
          style={{ marginRight: '8px' }}>
          Cancel
        </Button>
        <Popconfirm
          title="Are you sure you want to save your changes to active event?"
          onConfirm={onEditActiveRegistration}
          okText="Do it"
          okButtonProps={{ danger: true }}
          cancelButtonProps={{ type: 'primary' }}
          cancelText="Nope :c"
          placement="top">
          <Button type="primary" size="large" danger>
            Save changes to active event
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
