/**
 * Redux reducers for genres.
 *
 * @author Toan Au, Cindy Tran, Robert Jeffs, Ronald Rinaldy, Martin Balakrishnan.
 */

import { GET_GENRES } from '../actions/types';

/** Reducer containing all genres. */
export default (state = [], action) => {
  switch (action.type) {
    case GET_GENRES:
      return action.genres;
    default:
      return state;
  }
};
