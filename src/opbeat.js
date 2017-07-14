import initOpbeat, { setUserContext, setExtraContext } from 'opbeat-react';
import config from 'config';

const { opbeat } = config;
initOpbeat(opbeat);
setUserContext({
  username: process.env.USER,
});

setExtraContext({
  revision: process.env.REVISION || null,
  branch: process.env.BRANCH || null,
  osType: process.env.OS_TYPE || null,
});

