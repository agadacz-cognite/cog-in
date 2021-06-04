import React, { useState, useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Input, Button, notification } from 'antd';
import {
  AppContext,
  useBackIfNotLogged,
  useActiveRegistration,
  useAvailablePlacesForSlots,
} from '../../context';
import { registerUserForTest } from '../../firebase';
import { SlotData, ChosenHour, oldPaths } from '../../shared';
import { Flex, Card } from '../../components';
import MappedHours from './MappedHours';

export default function HourSelection(): JSX.Element {
  const history = useHistory();
  const {
    user,
    setLoading,
    usersRegistration,
    activeRegistration,
  } = useContext(AppContext);
  const [comment, setComment] = useState<string | undefined>();
  const [chosenDays, setChosenDays] = useState<SlotData[]>([]);
  const [testHours, setTestHours] = useState<ChosenHour[]>([]);

  useBackIfNotLogged();
  useActiveRegistration();
  useAvailablePlacesForSlots(activeRegistration?.id);

  useEffect(() => {
    if (activeRegistration?.slots) {
      const slots: SlotData[] = activeRegistration?.slots;
      setChosenDays(slots);
    } else {
      history.push(oldPaths.home.path());
    }
  }, []);

  useEffect(() => {
    if (usersRegistration?.testHours) {
      setTestHours(usersRegistration.testHours);
      setComment(usersRegistration.comment);
    }
  }, []);

  const onCommentChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    setComment(event.target.value);
  const onSubmit = async () => {
    if (!activeRegistration?.id) {
      notification.warning({
        message: 'Something went wrong',
        description: 'We could not register you. Please try again later.',
      });
      return;
    }
    if (!Object.keys(testHours)?.length) {
      notification.warning({
        message: 'Hours not specified',
        description: 'Choose at least one time slot.',
      });
      return;
    }
    const registeredUser = {
      email: user.email,
      name: user.displayName,
      weekId: activeRegistration.id,
      comment,
      registeredTimestamp: Date.now(),
      testHours,
    };
    setLoading(true);
    await registerUserForTest(
      usersRegistration,
      registeredUser,
      activeRegistration,
      history,
    );
    setLoading(false);
  };
  const onBack = () => history.push(oldPaths.home.path());

  return (
    <Flex column align style={{ margin: 'auto', maxWidth: '1250px' }}>
      <Flex row align justify style={{ flexWrap: 'wrap' }}>
        {chosenDays?.map((slot: SlotData, index: number) => (
          <Card
            key={`${slot.id}-${index}`}
            title={
              <Flex align justify style={{ fontWeight: 'bold' }}>
                {slot.slotName}
              </Flex>
            }
            style={{ margin: '8px', maxWidth: '550px' }}>
            <p>{slot.slotSummary}</p>
            <Flex row align justify style={{ flexWrap: 'wrap' }}>
              <MappedHours
                id={slot.id}
                chosenDays={chosenDays}
                testHours={testHours}
                setTestHours={setTestHours}
              />
            </Flex>
          </Card>
        ))}
      </Flex>
      <Card style={{ width: '100%' }}>
        <Flex column>
          <Input
            placeholder="Write down any diet preferences you have"
            value={comment}
            onChange={onCommentChange}
            style={{ marginBottom: '8px' }}
          />
          <Button type="primary" onClick={onSubmit}>
            Submit
          </Button>
        </Flex>
      </Card>
      <Flex row align justify style={{ padding: '8px', margin: '8px' }}>
        <Button
          type="default"
          size="large"
          style={{ boxShadow: '0 0 20px #000' }}
          onClick={onBack}>
          Back
        </Button>
      </Flex>
    </Flex>
  );
}
