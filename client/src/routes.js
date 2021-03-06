/**
 * Contains all client-side routing logic of the app.
 *
 * @author Toan Au, Cindy Tran, Robert Jeffs, Ronald Rinaldy, Martin Balakrishnan.
 */

import React from 'react';
import { Switch, Redirect, Route, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import Home from './pages/Home';
import Landing from './pages/Landing';
import Registration from './pages/Registration';
import AboutUs from './pages/AboutUs';
import Privacy from './pages/Privacy';
import Contact from './pages/Contact';
import Matches from './pages/Matches';
import Profile from './pages/Profile';
import MemberProfile from './pages/MemberProfile';
import NotFound from './pages/NotFound';

/** AppSwitch component handles routing. */
const AppSwitch = ({ user }) => {
  if (user === null) {
    return <PublicRoutes />;
  }
  return <ProtectedRoutes />;
};

/** PublicRoutes component routes available to an unauthenticated user. */
const PublicRoutes = () => {
  return (
    <Switch>
      <Route exact path="/" component={Landing} />

      {/* Common Routes */}
      <Route exact path="/aboutus" component={AboutUs} />
      <Route exact path="/privacy" component={Privacy} />
      <Route exact path="/contact" component={Contact} />
      <Redirect to="/" />
    </Switch>
  );
};

/**
 * ProtectedRoutes component routes for authenticated users, redirect
 * user's if they try to access register page to the Home page, and
 * redirects any other route not listed to the not found page.
 */
const ProtectedRoutes = () => {
  return (
    <Switch>
      <Route exact path="/" component={Home} />
      <Route exact path="/register" component={Registration} />
      <Route exact path="/matches" component={Matches} />
      <Route exact path="/profile" component={Profile} />
      <Route exact path="/profile/:id" component={MemberProfile} />

      {/* Common Routes */}
      <Route exact path="/aboutus" component={AboutUs} />
      <Route exact path="/privacy" component={Privacy} />
      <Route exact path="/contact" component={Contact} />
      <Route path="*" component={NotFound} />
    </Switch>
  );
};

const mapStateToProps = state => ({ user: state.user });

export default withRouter(connect(mapStateToProps)(AppSwitch));
