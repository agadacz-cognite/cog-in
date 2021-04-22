import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import AppContextProvider from '../../context';
import WeekSelection from '../WeekSelection';
import HourSelection from '../HourSelection';
import { MainWrapper } from '../../components';
import firebase from 'firebase';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';

import 'antd/dist/antd.css';

const firebaseConfig = {
  apiKey: 'AIzaSyArHLsiOxDy3Mgtr012VlBLKQ8dcaKtRmo',
  authDomain: 'covid-project-a32a4.firebaseapp.com',
  databaseURL:
    'https://covid-project-a32a4-default-rtdb.europe-west1.firebasedatabase.app',
  projectId: 'covid-project-a32a4',
  storageBucket: 'covid-project-a32a4.appspot.com',
  messagingSenderId: '1044325618990',
  appId: '1:1044325618990:web:a44eaedcc2ae1a12fd56bf',
};

const uiConfig = {
  signInFlow: 'popup',
  signInSuccessUrl: '/start',
  signInOptions: [firebase.auth.GoogleAuthProvider.PROVIDER_ID],
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
} else {
  firebase.app();
}

export default function App(): JSX.Element {
  return (
    <AppContextProvider>
      <MainWrapper>
        <Router>
          <Switch>
            <Route exact path="/">
              <StyledFirebaseAuth
                uiConfig={uiConfig}
                firebaseAuth={firebase.auth()}
              />
            </Route>
            <Route exact path="/start">
              <WeekSelection />
            </Route>
            <Route exact path="/choose">
              <HourSelection />
            </Route>
          </Switch>
        </Router>
      </MainWrapper>
    </AppContextProvider>
  );
}
