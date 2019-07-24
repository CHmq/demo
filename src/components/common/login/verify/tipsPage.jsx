import React from "react";
import { Form, Button } from "antd";
import { connect } from "react-redux";
import intl from "components/utils/language";

import OtherLogin, {
  goRegister
} from "components/common/login/verify/otherLogin";

const headerPosition = "home.publicMsg.role.firstLogin";

function goParentLogin({ updateAuth }) {
  return updateAuth({ loginCode: 210 });
}

function tipsPage(props) {
  const {
    translations: { initDone }
  } = props;
  return (
    <Form
      className="login-form"
      // style={userState === "kidAccount" ? { padding: "0 50px" } : null}
    >
      <Form.Item>
        <p
          style={{
            textAlign: "center",
            color: "#bfbfbf",
            fontSize: "16px",
            marginBottom: 0
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
      </Form.Item>
      <Form.Item>
        <Button type="primary" block onClick={() => goParentLogin(props)}>
          {intl.getPlus({
            initDone,
            value: `${headerPosition}.loginIn`
          })}
        </Button>
        <OtherLogin />
        <Button type="default" block onClick={() => goRegister(props)}>
          立即註冊
        </Button>
      </Form.Item>
    </Form>
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
)(Form.create()(tipsPage));
