import React from 'react';
import { Typography } from 'antd';
import { WarningOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { Flex, Panel } from '../components';

const { Title } = Typography;

export default function ErrorPage(): JSX.Element {
  return (
    <Panel>
      <Flex column>
        <Title level={2}>Cog IN! Registration app</Title>
        <Title level={5} style={{ color: 'red' }}>
          <WarningOutlined /> The application couldn&apos;t load
        </Title>
        <p style={{ fontWeight: 'bold' }}>
          This can happen for a number of reasons:
        </p>
        <ul>
          <li>
            page refresh might fix the issue (
            <a
              href="https://docs.cognite.com/cdf/access/troubleshooting/login.html"
              target="_blank"
              rel="noreferrer">
              CTRL+Shift+R for hard reload
            </a>
            )
          </li>
          <li>you are using Incognito mode</li>
          <li>you have third party cookies disabled</li>
          <li>your adblock blocks the application</li>
        </ul>
        <Title level={5}>
          <InfoCircleOutlined /> Why?
        </Title>
        <ul>
          <li>
            third party cookies are (unfortunately) necessary for the Google
            Login (will be changed in the future)
          </li>
          <li>
            this app uses Mixpanel to track traffic - some adblocks might find
            this problematic and block the app
          </li>
        </ul>
        <p style={{ fontWeight: 'bold', margin: 0 }}>
          Still not working?{' '}
          <a href="mailto:anna.gadacz@cognite.com?subject=CogIN issue, fix fast pls">
            Poke Anna
          </a>
          !
        </p>
      </Flex>
    </Panel>
  );
}
