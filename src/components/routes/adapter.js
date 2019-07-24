import React from "react";
import { Route, Redirect } from "react-router-dom";
import ProtectedRoute from "components/routes/ProtectedRoute.jsx";

const components = {
    "redirect" : Redirect,
    "auth" : ProtectedRoute ,
    "default" : Route
};

export function RouteAdapter({
  path,
  action,
  key,
  component: Component,
  exact,
  from,
  to,
  auth,
  noFrame,
  ...rest
}) {
    let RouteAdapter = components[action || (auth===true ? 'auth' : false) || 'default'];
    return <RouteAdapter 
            {...rest}
            key={key}
            exact={exact}
            render={props => {
                return (<Component {...props} {...rest}/>);
            }}
            EVIComponent={Component}
            from={from}
            to={to}
            path={path}
            locationUrl={{...rest}.$rootURL}
            noFrame={noFrame}
        />;
}
