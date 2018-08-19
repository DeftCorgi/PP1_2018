import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import { connect } from 'react-redux';

// pages
import Home from '../pages/Home';
import Contact from '../pages/Contact';
import Registration from '../pages/Registration';
import FormOne from '../pages/FormOne';
import FormTwo from '../pages/FormTwo';
import FormThree from '../pages/FormThree';
import FormFour from '../pages/FormFour';

class Content extends Component {
  render() {
    return (
      <main className="Content container">
        <Switch>
          <Route exact path="/FormOne" component={FormOne} />
          <Route exact path="/FormTwo" component={FormTwo} />
          <Route exact path="/FormThree" component={FormThree} />
          <Route exact path="/FormFour" component={FormFour} />
          {this.props.user && <Route path="/" component={Home} />}
          <Route path="/register" component={Registration} />
          <Route path="/" component={Contact} />
        </Switch>
      </main>
    );
  }
}

const mapStateToProps = state => ({ user: state.user });

export default connect(mapStateToProps)(Content);
