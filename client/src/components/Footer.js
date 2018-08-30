import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="Footer container">
      <div className="left-footer">
        <p>© The Terror Wrists 2018</p>
      </div>
      <div className="right-footer">
        <nav>
          <Link to="/">Home</Link>
          <Link to="/aboutus">About Us</Link>
          <Link to="/privacy">Privacy</Link>
          <Link to="/contact">Contact</Link>
        </nav>
      </div>
    </footer>
  );
};

export default Footer;
