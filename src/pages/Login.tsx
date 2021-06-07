import React, { useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Typography, Modal, Button, Spin } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { Flex, Panel, InfoBar } from '../components';
import { AppContext } from '../context';
import { oldPaths } from '../shared';
import ErrorPage from './ErrorPage';

const { Title } = Typography;

export default function Login(): JSX.Element {
  const history = useHistory();
  const { user, setUser, gapiLoaded } = useContext(AppContext);

  const GOOGLE_BUTTON_ID = 'google-sign-in-button';

  useEffect(() => {
    if (user) {
      history.push(oldPaths.home.path());
    }
  }, [user]);

  useEffect(() => {
    if (gapiLoaded) {
      (window as any).gapi.signin2.render(GOOGLE_BUTTON_ID, {
        scope: 'https://www.googleapis.com/auth/plus.login',
        width: 220,
        height: 50,
        longtitle: true,
        theme: 'dark',
        onsuccess: onSignIn,
      });
    }
  }, [gapiLoaded]);

  const onSignIn = (googleUser: any) => {
    const profile = googleUser.getBasicProfile();
    const loggedInUser = {
      displayName: profile.getName(),
      email: profile.getEmail(),
    };
    setUser(loggedInUser);
  };

  const onCantLogInClick = () => {
    Modal.info({
      title: 'Why cannot I log in?',
      content: (
        <ul style={{ margin: 0, padding: 0 }}>
          <li>you might be using Incognito mode</li>
          <li>you might have 3rd party cookies disabled</li>
          <li>
            your adblocker might&apos;ve blocked the Google button from
            appearing/working
          </li>
          <li>you might need to hard refresh the app (CTRL+Shift+R)</li>
        </ul>
      ),
    });
  };

  if (gapiLoaded === undefined) {
    return (
      <Flex>
        <Spin size="large" />
      </Flex>
    );
  }
  if (gapiLoaded === false) {
    return <ErrorPage />;
  }
  return (
    <Flex column>
      <Panel style={{ maxWidth: '500px' }}>
        <Title level={2}>Cog IN! Registration app</Title>
        <Title level={5}>Please log in with your Cognite account.</Title>
        <div id={GOOGLE_BUTTON_ID}></div>
      </Panel>
      <InfoBar>
        <Flex column>
          <Button
            icon={<QuestionCircleOutlined />}
            type="primary"
            danger
            onClick={onCantLogInClick}
            style={{ margin: '4px' }}>
            Why can&apos;t I log in?
          </Button>
          <span>
            Still not working?{' '}
            <a href="mailto:anna.gadacz@cognite.com?subject=CogIN issue, fix fast pls">
              Poke Anna
            </a>
            !
          </span>
        </Flex>
      </InfoBar>
    </Flex>
  );
}
