import React from "react";
import { Route, Redirect } from "react-router-dom";
import { isAuth } from "components/services/authService";
import EVIFrame from "components/common/Frame";


export default function ProtectedRoute({
  EVIComponent: Component,
  preLogin : preComponent,
  render,
  noFrame,
  ...rest
}) {
    const ProtectedRoute = !isAuth() ? (!!preComponent ? Route : Redirect) : Route;
    const {$rootURL} = {...rest};
    noFrame = (typeof noFrame == undefined ? true : (!isAuth() ? true : noFrame));
    return (<ProtectedRoute
       {...rest}
       to={ !isAuth() ? $rootURL : "/" }
      render={props => {
        const AuthRoute = !isAuth() ? preComponent : Component;
        return !isAuth() ? (<AuthRoute {...props} { ...rest} />) : (<EVIFrame 
            noFrame={noFrame}
            {...props}
            {...rest}>
            <AuthRoute />
        </EVIFrame>);
        }}
    />);
}