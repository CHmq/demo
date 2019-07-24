import { combineReducers } from "redux";
import { user } from "components/reducers/user";
import { route } from "components/reducers/route_reducer";
import { translations } from "components/reducers/translations_reducer";
import { auth } from "components/reducers/auth_reducer";
import { merchant } from "components/reducers/merchant_reducer";

const allReducers = {
  user,
  route,
  translations,
  auth ,
  merchant
};

export const rootReducer = combineReducers(allReducers);
