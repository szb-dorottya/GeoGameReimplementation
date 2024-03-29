import {
  readDataFromLocal,
  saveDataLocally,
} from '~/savedata/SaveDataAsyncStorage';

export const GET_PLAYED_GAMES_DATA = 'GET_PLAYED_GAMES_DATA';
export const SAVE_PLAYED_GAME_DATA = 'SAVE_PLAYED_GAME_DATA';

/**
 * @returns {(dispatch: (data: {type: GET_PLAYED_GAMES_DATA, data: StatisticsDataWithQuestions[]}) => void) => Promise<void>}
 */
export const getPlayedGamesData = () => {
  return async dispatch => {
    const playedGamesData = await readDataFromLocal();

    if (playedGamesData.success === true) {
      dispatch({
        type: GET_PLAYED_GAMES_DATA,
        data: [...playedGamesData.data.reverse()],
      });
    }
  };
};

/**
 * @param {StatisticsDataWithQuestions} data
 * @returns {(dispatch: (data: {type: SAVE_PLAYED_GAME_DATA, data: StatisticsDataWithQuestions}) => void) => Promise<void>}
 */
export const savePlayedGameData = data => {
  return async dispatch => {
    const addedNewGameDataResponse = await saveDataLocally(data);
    if (addedNewGameDataResponse.success === true) {
      dispatch({
        type: SAVE_PLAYED_GAME_DATA,
        data: addedNewGameDataResponse.data,
      });
    }
  };
};
