const uuidv5 = require('uuid/v5');

export default function generateUUID() {
    const uuid = "web-" + uuidv5(((Date.now() % 1000) / 1000).toString() + 'KID_WEB' , uuidv5('kid.family.evi.com', uuidv5.DNS));
    console.log(uuid);
    return uuid;
}
