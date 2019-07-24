/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from "react";
import { Form, Input, Button, Icon, Checkbox } from "antd";
import { connect } from "react-redux";
// import intl from "react-intl-universal";
import intl from "components/utils/language";

import toast from "components/utils/toast";

import OtherLogin from "components/common/login/verify/otherLogin";

import auth_API from "components/services/authService";
import family_API from "components/services/familyService";
import user_API from "components/services/userService";

import loginBasics from "assets/css/login/basics.module.scss";

/**
 * 初次登錄 可登錄並回到首頁 or result210 go bindkid
 *
 * @export
 * @class fristLogin
 * @extends {Component}
 */
export class fristLogin extends Component {
  /**
   * state
   *  viewState 視圖state Object
   *      submitLoading 登錄狀態 bool
   */
  state = {
    viewState: {
      submitLoading: false
    }
  };

  /** 按鈕加载状态切换 */
  switchSubLoding = () => {
    const { submitLoading } = this.state.viewState;
    this.setState({ viewState: { submitLoading: !submitLoading } });
  };

  /** 綁定子女 410 error
   * params
   *    code 狀態碼
   */
  bindKid_401_Erros = code => {
    const { switchSubLoding } = this;
    const errors = new Map().set(203, () =>
      toast.createToast({
        type: "error",
        msg: "該賬號已經綁定了kid賬戶!",
        onClose: () => {
          switchSubLoding();
          window.location = "/";
        }
      })
    );
    return errors.get(code)
      ? errors.get(code)()
      : toast.createToast({
          type: "error",
          msg: "發現了未知的錯誤",
          onClose: () => switchSubLoding()
        });
  };

  /** 當不存在 kid_token 選擇綁定時 登錄 result 210 來進行綁定 */
  bindKid_401 = async () => {
    const {
      props: {
        auth: {
          kid_token,
          AddKidMsg: { family_id }
        },
        user: { language }
      },
      switchSubLoding,
      bindKid_401_Erros
    } = this;
    try {
      const user_id = await family_API.addChildren({
        kid_token,
        family_id,
        language
      });
      await user_API.swap({ user_id });
      toast.createToast({
        type: "success",
        msg: `綁定成功!將以子女登入身份瀏覽`,
        onClose: () => {
          switchSubLoding();
          window.location = "/";
        }
      });
    } catch (error) {
      console.log(error);
      bindKid_401_Erros(error.result);
    }
  };

  /** 登录 Errors 处理 */
  loginErrors = error => {
    const {
      switchSubLoding,
      bindKid_401,
      props: {
        updateAuth,
        auth: { loginCode }
      }
    } = this;
    const errors = new Map()
      .set(0, () =>
        toast.createToast({
          msg: "登錄失敗,工程師正在排查錯誤,請稍後再試!",
          type: "error",
          onClose: () => switchSubLoding()
        })
      )
      .set(21, () =>
        toast.createToast({
          msg: "登錄失敗,無權登錄!",
          type: "error",
          onClose: () => switchSubLoding()
        })
      )
      .set(200, () =>
        toast.createToast({
          msg: "賬戶或者密碼錯誤,請重試!",
          type: "error",
          onClose: () => switchSubLoding()
        })
      )
      .set(203, () =>
        toast.createToast({
          msg: "該用戶不存在!",
          type: "error",
          onClose: () => switchSubLoding()
        })
      )
      .set(204, () =>
        toast.createToast({
          msg: "密碼不能為空!",
          type: "error",
          onClose: () => switchSubLoding()
        })
      )
      .set(210, () => {
        updateAuth({ kid_token: error.data });
        if (loginCode === 401) return bindKid_401();
        toast.createToast({
          msg: "請登錄家長賬號進行綁定",
          onClose: () => {
            switchSubLoding();
            updateAuth({ userState: "tipsPage" });
          }
        });
      });
    return errors.get(error.result)
      ? errors.get(error.result)()
      : toast.createToast({
          msg:
            "發生了我們未知錯誤!請稍後重試...或者您可以提供給客服錯誤原因來告知我們.",
          type: "error",
          onClose: () => switchSubLoding()
        });
  };

  /**
   * 登陆事件
   * 分别处理 用户登录/家长登录
   * params
   *    e   事件對象
   *
   * @memberof fristLogin
   */
  handleSubmitLogin = async e => {
    e.preventDefault();
    const { switchSubLoding } = this;
    switchSubLoding();

    const { username, password, remember } = this.props.form.getFieldsValue([
      "username",
      "password",
      "remember"
    ]);

    try {
      await auth_API.login(username, password, remember);
      return toast.createToast({
        msg: "登陸成功! 馬上帶您回到首頁...",
        type: "success",
        onClose: () => {
          switchSubLoding();
          window.location = "/";
        }
      });
    } catch (error) {
      console.log(error);
      this.loginErrors(error);
    }
  };

  /** 表單驗證
   * return bool
   */
  vaIidate = () => {
    const { getFieldsError, getFieldsValue } = this.props.form;
    const value = Object.values(getFieldsValue(["username", "password"])).every(
      item => item !== undefined && item !== ""
    );
    const error = Object.values(getFieldsError(["username", "password"])).every(
      item => item === "" || item === undefined
    );
    return value === true && error === true ? false : true;
  };

  forgetPwd = () => {
    const { updateAuth } = this.props;
    updateAuth({ userState: "forgetPwd" });
  };

  /** 创建登录表单
   *  params
   *      defaultUser,defaultPwd 測試使用的賬戶密碼
   */
  createLoginFrom = ({ defaultUser, defaultPwd }) => {
    const {
      props: {
        form: { getFieldDecorator },
        translations: { initDone },
        auth: { userState },
        updateAuth
      },
      state: {
        viewState: { submitLoading }
      },
      vaIidate,
      forgetPwd
    } = this;

    const headerPosition = "home.publicMsg.role.firstLogin";

    return (
      <React.Fragment>
        {userState === "kidAccount" && (
          <h2 className={loginBasics.title}>
            {intl.getPlus({
              initDone,
              value: `${headerPosition}.title`
            })}
          </h2>
        )}
        <div className={loginBasics.titleImg}>
          <img
            src={require("assets/image/logo.png")}
            alt="EVI Garten"
            style={userState === "kidAccount" ? { width: "80%" } : null}
          />
        </div>
        <Form
          onSubmit={this.handleSubmitLogin}
          className="login-form"
          style={userState === "kidAccount" ? { padding: "0 50px" } : null}
        >
          <Form.Item>
            {getFieldDecorator("username", {
              rules: [
                {
                  required: true,
                  message: intl.getPlus({
                    initDone,
                    value: `${headerPosition}.form.username`
                  })
                }
              ],
              initialValue: defaultUser
            })(
              <Input
                prefix={<Icon type="user" className={loginBasics.inputIcon} />}
                placeholder={intl.getPlus({
                  initDone,
                  value: `${headerPosition}.form.username`
                })}
              />
            )}
          </Form.Item>
          <Form.Item>
            {getFieldDecorator("password", {
              rules: [
                {
                  required: true,
                  message: intl.getPlus({
                    initDone,
                    value: `${headerPosition}.form.pwd`
                  })
                }
              ],
              initialValue: defaultPwd
            })(
              <Input
                prefix={<Icon type="lock" className={loginBasics.inputIcon} />}
                type="password"
                placeholder={intl.getPlus({
                  initDone,
                  value: `${headerPosition}.form.pwd`
                })}
              />
            )}
          </Form.Item>
          <Form.Item>
            {userState !== "kidAccount" && (
              <React.Fragment>
                {getFieldDecorator("remember", {
                  valuePropName: "checked",
                  initialValue: true
                })(
                  <Checkbox>
                    {intl.getPlus({
                      initDone,
                      value: `${headerPosition}.rememberMe`
                    })}
                  </Checkbox>
                )}
                <a style={{ float: "right" }} onClick={forgetPwd}>
                  {intl.getPlus({
                    initDone,
                    value: `${headerPosition}.forgetPwd`
                  })}
                </a>
              </React.Fragment>
            )}
            <Button
              type="primary"
              htmlType="submit"
              block
              disabled={vaIidate()}
              loading={submitLoading}
            >
              {intl.getPlus({
                initDone,
                value: `${headerPosition}.loginIn`
              })}
            </Button>
            {userState === "kidAccount" && (
              <p style={{ textAlign: "center" }}>
                <a onClick={() => updateAuth({ userState: "" })}>返回</a>
              </p>
            )}
            {userState !== "kidAccount" && <OtherLogin />}
          </Form.Item>
        </Form>
      </React.Fragment>
    );
  };

  render() {
    return this.createLoginFrom({
      defaultUser: "6524374810@evo",
      defaultPwd: "666666"
    });
  }
}

/** redux 數據獲取
 * auth 登錄信息
 */
function mapStateToProps({ user, auth, translations }) {
  return { user, auth, translations };
}

/**
 * redux 更新數據
 * updateAuth 更新 modal_view
 */
function mapDispatchToProps(dispatch) {
  return {
    updateAuth: payload => dispatch({ type: "updateAuth", payload })
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Form.create()(fristLogin));
