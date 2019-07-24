import intl from "react-intl-universal";

function getPlus({ initDone, value }) {
  return initDone && intl.get(value);
}

export default {
  getPlus
};
