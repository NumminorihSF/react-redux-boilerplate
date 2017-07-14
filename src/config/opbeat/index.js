/* eslint-disable no-undef */
const orgId = typeof OPBEAT_ORG_ID !== 'undefined' ? OPBEAT_ORG_ID : 'NO_OPBEAT';
const appId = typeof OPBEAT_APP_ID !== 'undefined' ? OPBEAT_APP_ID : 'NO_OPBEAT';
/* eslint-enable no-undef */

export default {
  orgId,
  appId,
};
