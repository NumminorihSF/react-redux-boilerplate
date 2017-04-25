import initOpbeat from 'opbeat-react';
import config from 'config';

const { opbeat } = config;
initOpbeat(opbeat);
