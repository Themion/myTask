const RT2Email = 'RT2Email';
const pendingEmail = 'pendingEmail';
const uuidToEmail = 'uuidToEmail';
const emailToUUID = 'emailToUUID';

const CACHE_TABLE_NAME = { pendingEmail, RT2Email, emailToUUID, uuidToEmail };
Object.freeze(CACHE_TABLE_NAME);

export default CACHE_TABLE_NAME;
