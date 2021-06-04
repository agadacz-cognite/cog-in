import React, { useEffect, useContext, useState } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import 'antd/dist/antd.css';
import GeoPattern from 'geopattern';
import Home from '../Home';
import NotFound from '../NotFound';
import Admin from '../Admin';
import NewRegistration from '../Admin/NewRegistration';
import OldRegistrations from '../Admin/OldRegistrations';
import EditRegistration from '../Admin/EditRegistration';
import PreviewRegistration from '../Admin/PreviewRegistration';
import DaysSelection from '../DaysSelection';
import HourSelection from '../HourSelection';
import { AppContext } from '../../context';
import { Loader, LinksBar } from '../../components';
import { isDev, oldPaths } from '../../shared';
import { useMixpanel } from '../../mixpanel';
import { Wrapper, DevBanner } from './components';

export default function App(): JSX.Element {
  const base64Prefix = 'data:image/svg+xml;base64,';
  const [background, setBackground] = useState(base64Prefix);
  const { loading, setGapiLoaded } = useContext(AppContext);
  useMixpanel();

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://apis.google.com/js/platform.js';

    script.onload = () => {
      (window as any).gapi.load('client', () => {
        setGapiLoaded(true);
      });
    };
    document.body.appendChild(script);
  }, []);

  useEffect(() => {
    const text = String(Date.now());
    const pattern = GeoPattern.generate(text).toBase64();
    const patternWithPrefix = `${base64Prefix}${pattern}`;
    setBackground(patternWithPrefix);
  }, []);

  return (
    <Router>
      <Switch>
        <Route exact path={oldPaths.login.staticPath}>
          <Wrapper background={background}>
            {isDev && <DevBanner />}
            <LinksBar />
            <Loader $loading={loading} />
            <Home />
          </Wrapper>
        </Route>
        <Route exact path={oldPaths.home.staticPath}>
          <Wrapper background={background}>
            {isDev && <DevBanner />}
            <LinksBar />
            <Loader $loading={loading} />
            <DaysSelection />
          </Wrapper>
        </Route>
        <Route exact path={oldPaths.selection.staticPath}>
          <Wrapper background={background}>
            {isDev && <DevBanner />}
            <LinksBar />
            <Loader $loading={loading} />
            <HourSelection />
          </Wrapper>
        </Route>
        <Route exact path={oldPaths.admin.staticPath}>
          <Wrapper background={background}>
            {isDev && <DevBanner />}
            <LinksBar />
            <Loader $loading={loading} />
            <Admin />
          </Wrapper>
        </Route>
        <Route exact path={oldPaths.adminNewWeek.staticPath}>
          <Wrapper background={background}>
            {isDev && <DevBanner />}
            <LinksBar />
            <Loader $loading={loading} />
            <NewRegistration />
          </Wrapper>
        </Route>
        <Route exact path={oldPaths.adminEditWeek.staticPath}>
          <Wrapper background={background}>
            {isDev && <DevBanner />}
            <LinksBar />
            <Loader $loading={loading} />
            <EditRegistration />
          </Wrapper>
        </Route>
        <Route exact path={oldPaths.adminArchive.staticPath}>
          <Wrapper background={background}>
            {isDev && <DevBanner />}
            <LinksBar />
            <Loader $loading={loading} />
            <OldRegistrations />
          </Wrapper>
        </Route>
        <Route exact path={oldPaths.adminPreview.staticPath}>
          <Wrapper background={background}>
            {isDev && <DevBanner />}
            <LinksBar />
            <Loader $loading={loading} />
            <PreviewRegistration />
          </Wrapper>
        </Route>
        <Route>
          <Wrapper background={background}>
            {isDev && <DevBanner />}
            <LinksBar />
            <NotFound />
          </Wrapper>
        </Route>
      </Switch>
    </Router>
  );
}
