/**
 * Profile Card component.
 *
 * @author Toan Au, Cindy Tran, Robert Jeffs, Ronald Rinaldy, Martin Balakrishnan.
 */

import React from 'react';
import ReactStars from 'react-stars';
import defaultPfp from '../images/fortnite_drift_.png';

/** The responses of a user. */
const ProfileResponses = ({ user }) => {
  // render list of responses: questionId - response
  const responsesList = user.responses.map(response => {
    return (
      <div key={response.id}>
        {response.question.questionText} - {response.answerText}
      </div>
    );
  });
  return responsesList;
};

/** The preferred games of a user. */
const ProfileGames = ({ user }) => {
  const gamesList = user.prefGames.map(pref => {
    return <div className="games" key={pref.id}>{pref.game.title}</div>;
  });
  return gamesList;
};

/** The preferred genres of a user. */
const ProfileGenres = ({ user }) => {
  const genresList = user.prefGenres.map(pref => {
    return <div className="genre" key={pref.id}>{pref.genre.title}</div>;
  });
  return genresList;
};

/** The platform id of a user. */
const ProfilePlatformIds = ({ user }) => {
  const platformsList = user.platformIds.map(platform => (
    <div className="id">
      {platform.platform.title} - {platform.platformDisplayName}
    </div>
  ));
  return platformsList;
};

/** Profile card showing user information. */
const ProfileCard = ({ user }) => {
  
  if (user !== null) {
    return (
      <div>
        <div className="display-name">
          <h3>
            {user.displayName}
          </h3>
            <div className="reg">
            <label className={user.region.region}>{user.region.region}</label>
          </div>
          
        </div>
        <div className="star-rating">
            <ReactStars
              count={parseFloat(user.avgRating)}
              value={parseFloat(user.avgRating)}
              edit={false}
              size={40}
              color1="rgba(0,0,0,0)"
            />
          </div>
        <div className="pfp">
          <img src={user.pfpUrl || defaultPfp} alt="profile dp" />
        </div>
        <div className="user-info">
          {/* <span>
            Display Name:
            <span className="info"> {user.displayName}</span>
          </span> */}

          <div className="group">
            <div className="item">
              <label>Age:</label>
              {user.age}
            </div>
            <div className="item2">
              <label>Locale:</label>
              {user.locale.locale}
            </div>
          </div>

            <div className="group">
            <div className="item">
              <div className="info">
                <label>Type:</label>
                {user.playstyle}
              </div>
            </div>
            </div>

            <div className="group">
              <div className="info">
                <label>Biography:</label>
                {user.bio}
              </div>
            </div>

            <div className="group">
           
          {/* <span>Your Answers:</span>
          <span className="info">
            <ProfileResponses user={user} />
          </span>
          <br /> */}
              <div className="item">
                <label>Your Favourite Games:</label>
                  <div className="info">
                  <div className="content">
                    <ProfileGames user={user} />
                  </div>
                  </div>
              </div>
              <div className="item">
                <div className="info">
                <label>Social Platforms:</label>
                  <ProfilePlatformIds user={user} />
                </div>
              </div>
            </div>

            <div className="group">
            <div className="content">
            <label>Your Favourite Genres:</label>
              <div className="tag">
                  <ProfileGenres user={user} />
              </div>
            </div>
            </div>

          </div>
        </div>
    );
  }
};

export default ProfileCard;
