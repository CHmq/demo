import React, { Component } from "react";
import { Form, Input, Radio, Button, Select, message } from "antd";
import { connect } from "react-redux";
import intl from "react-intl-universal";

import { SUPPORT_LOCALES } from "config/locale.json";
import { PASSWORD } from "config/app.json";

import auth from "components/services/authService";
import user from "components/services/userService";

class Registration extends Component {
  state = {
    numSelect: "", // phone input 的 placeholder
    confirmDirty: false,
    family_token: ""
  };

  componentDidMount() {
    this.setState({ family_token: this.props.familyToken });
  }

  //注冊按鈕
  HandleSubmit = async e => {
    e.preventDefault();
    const {
      state: { family_token },
      props: {
        auth: { kid_token }
      }
    } = this;
    const value = this.props.form.getFieldsValue();
    const type = this.props.type;
    const inputValue = {
      pre: value.prefix,
      tel: value.tel,
      email: value.email,
      pwd: value.password,
      sex: value.Sex,
      fsn: value.Firstname,
      lsn: value.Lastname,
      family_token,
      kid_token
    };
    await auth
      .register(type, inputValue)
      .then(ret => {
        return user.get(ret).then(_user => {
          if (_user.status === "VALID") {
            message.success("注册成功");
            setTimeout(function() {
              window.location.href = "/";
            }, 1000);
          } else {
            this.props.data(1);
          }
          this.props.change(_user.status === "VERIFY" ? 1 : 3); //改变步骤条状态
        });
      })
      .catch(_msg => {
        message.warning(
          this.props.translations &&
            intl.get("loading.publicMsg.register.form.occupied")
        );
      });
  };

  compareToFirstPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && value !== form.getFieldValue("password")) {
      callback(
        this.props.translations &&
          intl.get("loading.publicMsg.register.form.verifyMsg.confirmWarnMsg")
      );
    } else {
      callback();
    }
  };

  validateToNextPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && this.state.confirmDirty) {
      form.validateFields(["confirm"], { force: true });
    }
    callback();
  };
  //提交按钮是否禁用判断
  vaIidate = () => {
    const { getFieldsError, getFieldsValue } = this.props.form;
    const type = this.props.type === "tel" ? "tel" : "email";
    const value = Object.values(
      getFieldsValue([type, "password", "Sex", "Firstname", "Lastname"])
    ).every(item => item !== undefined && item !== "");
    const error = Object.values(
      getFieldsError([type, "password", "Sex", "Firstname", "Lastname"])
    ).every(item => item === "" || item === undefined);
    return value === true && error === true ? false : true;
  };

  //設置phone input框的placeholder值
  handleSelect = value => {
    switch (value) {
      case "852":
        this.setState({ numSelect: "+852 61234567" });
        break;
      case "853":
        this.setState({ numSelect: "+853 66123456" });
        break;
      case "60":
        this.setState({ numSelect: "+60 123456789" });
        break;
      default:
        this.setState({ numSelect: "+86 13123456789" });
    }
  };

  render() {
    const { getFieldDecorator } = this.props.form;

    const formItemLayout = {
      labelCol: {
        lg: { span: 8 },
        md: { span: 24 },
        sm: { span: 24 },
        xs: { span: 24 }
      },
      wrapperCol: {
        lg: { span: 16 },
        md: { span: 24 },
        sm: { span: 24 },
        xs: { span: 24 }
      }
    };
    const tailFormItemLayout = {
      wrapperCol: {
        md: {
          span: 19,
          offset: 5
        },
        sm: {
          span: 24
        },
        xs: {
          span: 24
        }
      }
    };
    const prefixSelector = getFieldDecorator("prefix", {
      initialValue: SUPPORT_LOCALES[this.props.route.currentLocation].tel
    })(
      <Select onChange={this.handleSelect} style={{ width: 100 }}>
        {Object.keys(SUPPORT_LOCALES).map(_locale => {
          return _locale !== this.props.route.currentLocation ? null : (
            <Select.Option
              key={_locale}
              value={SUPPORT_LOCALES[_locale].tel}
            >{`${_locale.toUpperCase()}(+${
              SUPPORT_LOCALES[_locale].tel
            })`}</Select.Option>
          );
        })}
      </Select>
    );
    const { type, translations } = this.props;
    // 多语言
    const _fn = function(value) {
      return (
        translations.initDone &&
        intl.get("loading.publicMsg.register.form." + value)
      );
    };
    const Language = {
      phone: _fn("phone"),
      verifyphoneMsg: _fn("verifyMsg.phoneMsg"),
      verifyphone: _fn("verifyMsg.phone"),
      phoneWarnMsg: _fn("verifyMsg.phoneWarnMsg"),

      email: _fn("email"),
      verifyemailMsg: _fn("verifyMsg.emailMsg"),

      pwd: _fn("pwd"),
      pwdMsg: _fn("verifyMsg.pwdMsg"),
      pwdWarnMsg: _fn("verifyMsg.pwdWarnMsg"),

      confirmpwd: _fn("confirmpwd"),
      confirmMsg: _fn("verifyMsg.confirmMsg"),

      sex: _fn("sex"),
      man: _fn("man"),
      lady: _fn("lady"),

      name: _fn("name"),
      verifyname: _fn("verifyMsg.name"),
      nameMsg: _fn("verifyMsg.nameMsg"),
      nameMsg: _fn("verifyMsg.nameMsg"),

      surname: _fn("surname"),
      verifysurname: _fn("verifyMsg.surname"),
      surnameMsg: _fn("verifyMsg.surnameMsg"),

      btn: _fn("btn")
    };

    return (
      <Form {...formItemLayout} onSubmit={this.HandleSubmit}>
        {type === "tel" ? (
          <Form.Item
            label={Language.phone}
            hasFeedback
            help={Language.verifyphoneMsg}
          >
            {getFieldDecorator("tel", {
              rules: [
                {
                  required: true,
                  message: Language.verifyphone
                },
                {
                  pattern: /^[1][3-8]\d{9}$|^([6|9])\d{7}$|^[6]([8|6])\d{5}$|\d{9}/,
                  message: Language.phoneWarnMsg
                }
              ]
            })(
              <Input
                addonBefore={prefixSelector}
                placeholder={this.state.select}
              />
            )}
          </Form.Item>
        ) : (
          <Form.Item label={Language.email} hasFeedback>
            {getFieldDecorator("email", {
              rules: [
                {
                  type: "email",
                  message: Language.emailWarnMsg
                },
                {
                  required: true,
                  message: Language.emailMsg
                }
              ]
            })(<Input />)}
          </Form.Item>
        )}
        <Form.Item label={Language.pwd} hasFeedback>
          {getFieldDecorator("password", {
            rules: [
              {
                required: true,
                message: Language.pwdMsg
              },
              {
                pattern: PASSWORD,
                message: Language.pwdWarnMsg
              },
              {
                validator: this.validateToNextPassword
              }
            ]
          })(<Input.Password />)}
        </Form.Item>
        <Form.Item label={Language.sex}>
          {getFieldDecorator("Sex", {
            rules: [
              {
                required: true
              }
            ]
          })(
            <Radio.Group>
              <Radio value="M">{Language.man}</Radio>
              <Radio value="F">{Language.lady}</Radio>
            </Radio.Group>
          )}
        </Form.Item>
        <Form.Item label={Language.name} hasFeedback>
          {getFieldDecorator("Firstname", {
            rules: [
              {
                required: true,
                message: Language.nameMsg
              },
              {
                whitespace: true,
                message: Language.verifyname
              }
            ]
          })(<Input placeholder={Language.nameMsg} />)}
        </Form.Item>
        <Form.Item label={Language.surname} hasFeedback>
          {getFieldDecorator("Lastname", {
            rules: [
              {
                required: true,
                message: Language.surnameMsg
              },
              {
                whitespace: true,
                message: Language.verifysurname
              }
            ]
          })(<Input placeholder={Language.surnameMsg} />)}
        </Form.Item>
        <Form.Item {...tailFormItemLayout}>
          <Button type="primary" htmlType="submit" disabled={this.vaIidate()}>
            {Language.btn}
          </Button>
          <br />
        </Form.Item>
      </Form>
    );
  }
}
function mapStateToProps({ auth, route, user, translations }) {
  return {
    auth,
    route,
    user,
    translations
  };
}

/** redux 數據更新
 * initLanguageState  初始化 language  bool
 * updateTranslations 更新language 以渲染多语言
 */
function mapDispatchToProps(dispatch) {
  return {
    initRoute: payload => dispatch({ type: "initRoute", payload }),
    initUserData: payload => dispatch({ type: "INIT", payload }),
    updateFileName: payload => dispatch({ type: "updateFileName", payload })
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Form.create()(Registration));
