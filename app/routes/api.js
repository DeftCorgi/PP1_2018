/**
 * API endpoint handlers.
 *
 * @author Toan Au, Cindy Tran, Robert Jeffs, Ronald Rinaldy, Martin Balakrishnan.
 */

const express = require('express');
const matching = require('../matchingAlgorithm/match');
const Op = require('sequelize').Op;

const keys = require('../config/keys');

// file upload setup
const multer = require('multer');
const gcs = require('multer-sharp');
const storage = gcs({
  bucket: keys.gcsBucketName,
  projectId: keys.googleProjectId,
  keyFilename: './app/config/gcs_keys.json',
  size: { width: 350, height: 350 }
});
const pfpUpload = multer({ storage });

// models
const userCalls = require('../userFunctions/userCalls');
const Questions = require('../models').questions;
const Answers = require('../models').answers;
const Locale = require('../models').locale;
const Region = require('../models').region;
const User = require('../models').users;
const Responses = require('../models').responses;
const Games = require('../models').games;
const Genres = require('../models').genres;
const PrefGenres = require('../models').prefGenres;
const PrefGames = require('../models').prefGames;
const Ratings = require('../models').ratings;
const Platforms = require('../models').platforms;
const PlatformIds = require('../models').platformIds;

const router = express.Router();

// Finds all matches for a user
router.get('/match/:id', async (req, res) => {
  const matches = await matching.findMatches(req.params.id);
  res.send(matches);
});

// Return information about a user given their ID
router.get('/user/:id', async (req, res) => {
  const user = await User.findById(req.params.id, {
    include: [
      { model: Region },
      { model: Locale },
      {
        model: Responses,
        include: [{ model: Questions, include: [{ model: Answers }] }]
      },
      { model: PrefGames, include: [Games] },
      { model: PrefGenres, include: [Genres] },
      { model: PlatformIds, include: [Platforms] }
    ]
  });

  const resUser = user.toJSON();
  resUser.responses.map((response, index) => {
    const answerText = response.question.answers.find(
      answer => answer.answerKey === response.response
    ).answerText;
    response.answerText = answerText;
  });
  res.send(resUser);
});

// Updates a user with additional information after they finish
// the registration form
router.post('/user/update/:id', pfpUpload.single('pfp'), async (req, res) => {
  const user = await User.findById(req.params.id);

  // get the posted data
  const { displayName, bio, age, region, locale, playstyle } = req.body;

  // parse the nested objects
  const answers = JSON.parse(req.body.answers);
  const importances = JSON.parse(req.body.importances);
  const preferences = JSON.parse(req.body.preferences);
  const games = JSON.parse(req.body.games);
  const genres = JSON.parse(req.body.genres);
  const platforms = JSON.parse(req.body.platforms);

  const pfpUrl = req.file.path;

  // update the user
  user.updateAttributes({
    displayName,
    bio,
    region,
    age,
    locale,
    playstyle,
    pfpUrl,
    finishedRegistration: true
  });

  // convert platforms to correct format

  const platformsArr = Object.keys(platforms).map(key => ({
    [key]: platforms[key]
  }));

  const response = await userCalls.finishRegistration(
    {
      importances,
      answers,
      preferences,
      games,
      genres,
      platformIds: platformsArr
    },
    req.params.id
  );
  res.send(user);
});

//returns a user's pending matches
router.get('/matches/pending/:id', async (req, res) => {
  const id = req.params.id;
  const pendingMatches = await userCalls.getPendingMatches(id);
  res.send(pendingMatches);
});

//returns a user's successful matches
router.get('/matches/successful/:id', async (req, res) => {
  const id = req.params.id;
  const successfulMatches = await userCalls.getSuccessfulMatches();

  // get list of Ids
  const matchedIds = [];
  successfulMatches.map(match => {
    matchedIds.push(match.id);
  });

  // get ratings for list of matches
  const ratings = await Ratings.findAll({
    where: { reviewerId: id, userId: { [Op.in]: matchedIds } }
  });

  // append user's rating to matched user
  successfulMatches.map(match => {
    // set match's userRating or 0
    let userRating = ratings.find(rating => rating.userId === match.id);
    userRating
      ? (userRating = userRating.rating)
      : (userRating = match.avgRating);
    match.userRating = userRating;
  });

  res.send(successfulMatches);
});

// return a list of all the questions
router.get('/questions', async (req, res) => {
  const questions = await Questions.findAll({
    include: [{ model: Answers }]
  });
  res.send(questions);
});

// return a list of locales
router.get('/locales', async (req, res) => {
  const locales = await Locale.findAll({ attributes: ['id', 'locale'] });

  for (let i = 0; i < locales.length; i++) {
    locales[i] = locales[i].toJSON();
  }
  res.send(locales);
});

//return a list of regions
router.get('/regions', async (req, res) => {
  const regions = await Region.findAll({ attributes: ['id', 'region'] });

  for (let i = 0; i < regions.length; i++) {
    regions[i] = regions[i].toJSON();
  }
  res.send(regions);
});

//return a list of games
router.get('/games', async (req, res) => {
  const games = await Games.findAll({ attributes: ['id', 'title'] });

  for (let i = 0; i < games.length; i++) {
    games[i] = games[i].toJSON();
  }
  res.send(games);
});

//return a list of genres
router.get('/genres', async (req, res) => {
  const genres = await Genres.findAll({ attributes: ['id', 'title'] });

  for (let i = 0; i < genres.length; i++) {
    genres[i] = genres[i].toJSON();
  }
  res.send(genres);
});

//return a list of platforms
router.get('/platforms', async (req, res) => {
  const platforms = await Platforms.findAll({ attributes: ['id', 'title'] });

  for (let i = 0; i < platforms.length; i++) {
    platforms[i] = platforms[i].toJSON();
  }
  res.send(platforms);
});

//must be given an object, which contains the Id's of the user who selected like,
//and the user they liked.
//creates/updates a like relation.
router.get('/user/like/:userId/:targetId', async (req, res) => {
  const response = await userCalls.likeUser(
    req.params.userId,
    req.params.targetId
  );
  res.send(response);
});

//must be given an object, which contains the Id's of the user who selected like,
//and the user they liked.
//creates/updates a dislike relation.
router.get('/user/dislike/:userId/:targetId', async (req, res) => {
  const response = await userCalls.dislikeUser(
    req.params.userId,
    req.params.targetId
  );

  res.send(response);
});

// user A rates user B
router.patch('/user/rate/:userId/:targetId', async (req, res) => {
  await userCalls.rateUser(
    req.params.userId,
    req.params.targetId,
    req.body.rating
  );
  res.send({});
});

//must be given an object, which contains the Id's of the user who selected like,
//and the user they liked.
//creates/updates a dislike relation.
router.get('/user/loadResponses', async (req, res) => {
  //Function takes in the object holding the data for the questionnaire
  //And the user's Id as request Id
  const response = await userCalls.finishRegistration(
    req.params.registrationForm,
    req.params.requestId
  );

  res.send(response);
});

module.exports = router;
