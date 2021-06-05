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
    <Wrapper background={background}>
      {isDev && <DevBanner />}
      <LinksBar />
      <Loader $loading={loading} />
      <Router>
        <Switch>
          <Route exact path={oldPaths.login.staticPath}>
            <Home />
          </Route>
          <Route exact path={oldPaths.home.staticPath}>
            <DaysSelection />
          </Route>
          <Route exact path={oldPaths.selection.staticPath}>
            <HourSelection />
          </Route>
          <Route exact path={oldPaths.admin.staticPath}>
            <Admin />
          </Route>
          <Route exact path={oldPaths.adminNewEvent.staticPath}>
            <NewRegistration />
          </Route>
          <Route exact path={oldPaths.adminEditEvent.staticPath}>
            <EditRegistration />
          </Route>
          <Route exact path={oldPaths.adminArchive.staticPath}>
            <OldRegistrations />
          </Route>
          <Route exact path={oldPaths.adminPreview.staticPath}>
            <PreviewRegistration />
          </Route>
          <Route>
            <NotFound />
          </Route>
        </Switch>
      </Router>
    </Wrapper>
  );
}
