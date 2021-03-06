'use strict';

module.exports = (sequelize, DataTypes) => {
  const genres = sequelize.define(
    'genres',
    {
      title: DataTypes.STRING
    },
    {}
  );
  genres.associate = function(models) {
    genres.hasMany(models.prefGenres, { foriegnKey: 'genreId' });
  };
  return genres;
};
