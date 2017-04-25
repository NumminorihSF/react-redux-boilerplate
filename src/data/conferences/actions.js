import { CALL_API, CHAIN_API } from 'store/middleware/api';

export const LOADED_CONFERENCES = Symbol('LOADED_CONFERENCES');

export function loadConferences() {
  return {
    [CALL_API]: {
      method: 'get',
      path: '/api/conferences',
      successType: LOADED_CONFERENCES,
    },
  };
}

export const LOAD_CONFERENCE_DETAIL = Symbol('LOAD_CONFERENCE_DETAIL');
export const LOADED_CONFERENCE_DETAIL = Symbol('LOADED_CONFERENCE_DETAIL');
export const LOADED_CONFERENCE_USER = Symbol('LOADED_CONFERENCE_USER');

export function loadConferenceDetail({ conferenceId }) {
  return {
    [CHAIN_API]: [
      () => ({
        conferenceId,
        [CALL_API]: {
          method: 'get',
          path: `/api/conferences/${conferenceId}`,
          startType: LOAD_CONFERENCE_DETAIL,
          successType: LOADED_CONFERENCE_DETAIL,
        },
      }),
      conference => ({
        conferenceId,
        userId: conference.userId,
        [CALL_API]: {
          method: 'get',
          path: `/api/users/${conference.userId}`,
          successType: LOADED_CONFERENCE_USER,
        },
      }),
    ],
  };
}
