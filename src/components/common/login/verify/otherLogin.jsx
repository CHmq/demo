import React from "react";
import intl from "components/utils/language";
import { Button, Icon } from "antd";
import { connect } from "react-redux";

import loginBasics from "assets/css/login/basics.module.scss";
import otherLoginScss from "assets/css/login/otherLogin.module.scss";

export function goRegister({ updateAuth }) {
  return updateAuth({ userState: "register" });
}

function otherLogin(props) {
  const {
    translations: { initDone },
    auth: { userState }
  } = props;

  const headerPosition = "home.publicMsg.role.firstLogin";

  return (
    <React.Fragment>
      {/* {userState === "tipsParent" && (
        <React.Fragment>
          <p
            style={{
              textAlign: "center",
              color: "#bfbfbf",
              fontSize: "16px"
              // marginBottom: 0
            }}
          >
            <span>
              {intl.getPlus({
                initDone,
                value: "loading.login.parentLogin.welcomeTips.oneLine"
              })}
            </span>
            <br />
            <span>
              {intl.getPlus({
                initDone,
                value: "loading.login.parentLogin.welcomeTips.towLine"
              })}
            </span>
          </p>
          <Button type="primary" block onClick={() => goParentLogin(props)}>
            登录
          </Button>
        </React.Fragment>
      )} */}
      <Button
        className={`${otherLoginScss.button} ${otherLoginScss.fb}`}
        type="link"
        block
        href=""
      >
        <Icon type="facebook" theme="filled" className={otherLoginScss.icon} />
        {intl.getPlus({
          initDone,
          value: `${headerPosition}.fbLoginIn`
        })}
      </Button>
      <Button
        className={`${otherLoginScss.button} ${otherLoginScss.wechat}`}
        type="link"
        block
        href=""
      >
        <Icon type="wechat" theme="filled" className={otherLoginScss.icon} />
        {intl.getPlus({
          initDone,
          value: `${headerPosition}.wxLoginIn`
        })}
      </Button>
      {userState !== "tipsPage" && (
        <p className={loginBasics.tipsTextLine}>
          <span>
            {intl.getPlus({
              initDone,
              value: `${headerPosition}.LoginTipsRegister.or`
            })}
          </span>
          <br />
          <span>
            {intl.getPlus({
              initDone,
              value: `${headerPosition}.LoginTipsRegister.tips`
            })}
          </span>
          <a onClick={() => goRegister(props)}>
            {intl.getPlus({
              initDone,
              value: `${headerPosition}.LoginTipsRegister.goParent`
            })}
          </a>
        </p>
      )}
    </React.Fragment>
  );
}

function mapStateToProps({ auth, translations }) {
  return { auth, translations };
}

function mapDispatchToProps(dispatch) {
  return {
    updateAuth: payload => dispatch({ type: "updateAuth", payload })
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(otherLogin);
