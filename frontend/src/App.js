import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from 'react';
import React from 'react';
import { BrowserRouter as Router, Switch, Route, Link, Redirect } from 'react-router-dom';

import { LoginPage } from './pages/LoginPage';
import { TemplatePage } from './pages/TemplatePage';
import { MatchPage } from './pages/MatchPage';
import { RoomPage } from './pages/RoomPage';
import { QuestionPage } from './pages/QuestionPage';
import { RegisterPage } from './pages/RegisterPage';

import { ProfilePage } from './pages/ProfilePage' ;
import { CreateMatchPage } from './pages/CreateMatchPage';
import { LeaderBoard } from './pages/LeaderBoard';
const info = {
  api_base_url: 'http://localhost:5000/api'
}

export const UserContext = React.createContext({
  loggedIn: false,
});

function App() {
  const [userLoggedIn, setUserLoggedIn] = useState(true);
  const [userToken, setUserToken] = useState(null);

  // check user auth
  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken && accessToken.length > 0) {
      setUserToken(accessToken);
      setUserLoggedIn(true);
    } else {
      setUserLoggedIn(false);
    }
  }, [userLoggedIn]);

  return (
    <UserContext.Provider value={{ loggedIn: userLoggedIn, token: userToken }}>
      <Router>

        <Switch>
          <Route path="/login">
            {!userLoggedIn ? <LoginPage setLogin={setUserLoggedIn} setToken={setUserToken} /> : <Redirect to="/matches" />}
          </Route>

          <Route path="/register">
            <RegisterPage />
          </Route>


          <Route path="/dashboard">
            {userLoggedIn ? <TemplatePage /> : <Redirect to="/login" />}
          </Route>

          <Route exact path="/matches">
            {userLoggedIn ? <MatchPage /> : <Redirect to="/login" />}
          </Route>

          <Route exact path="/profile/:id">
            {userLoggedIn ? <ProfilePage /> : <Redirect to="/login" />}
          </Route>

          <Route path="/matches/create">
            {userLoggedIn ? <CreateMatchPage /> : <Redirect to="/login" />}
          </Route>
          <Route path="/matches/join/:id">
            {userLoggedIn ? <RoomPage /> : <Redirect to="/login" />}
          </Route>

          <Route path="/matches/problems/:id">
            {userLoggedIn ? <QuestionPage /> : <Redirect to="/login" />}
          </Route>

          <Route path="/leaderboard/">
            {userLoggedIn ? <LeaderBoard /> : <Redirect to="/login" />}
          </Route>

          <Route exact path="/logout" render={() => {
            localStorage.removeItem('accessToken');
            setUserLoggedIn(false);
            setUserToken(null);
            return (<Redirect to="/login" />)
          }} />

          <Route path="/">
            <Redirect to="/login" />
          </Route>
        </Switch>
      </Router>
    </UserContext.Provider>
  );
}

export default App;
