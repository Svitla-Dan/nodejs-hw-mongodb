import { initMongoConnection } from './db/initMongoConnection.js';
import { startServer } from './server.js';
import { createDirIfNotExists } from './utils/createDirIfNotExists.js';
import { TEMP_UPLOAD_DIR } from './constants/contacts.js';

const boostrap = async () => {
  await initMongoConnection();
  await createDirIfNotExists(TEMP_UPLOAD_DIR);
  startServer();
};

boostrap();
