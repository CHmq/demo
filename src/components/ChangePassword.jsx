/*
 * @使用方法:创建组件<Banner img={'图片路径'} height={'默认为400px'} heightauto={默认为false }>
 */

import React, { Component } from "react";
import { Button, Form , Input, message } from "antd";
import auth from "./services/userService";
import { PASSWORD } from "config/app.json";

class ChangePassword extends Component {

  //確認修改按鈕
  HandleSubmit = async e => {
    e.preventDefault();
    const value = this.props.form.getFieldsValue();
    console.log(value);
    await auth
      .changePwd(value)
      .then(ret => {
        message.success("修改成功");
        console.log(ret);
        return ret;
      })
      .catch(_msg => {
        console.log(_msg);
        message.warning("密碼錯誤");
      });
  };

  //判斷新舊密碼是否一致
  validateToNextPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && value === form.getFieldValue("oldpassword")) {
      callback("不能舊密碼相同");
    }
    callback();
  };

  //判斷兩次輸入的密碼是否一致
  compareToFirstPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && value !== form.getFieldValue("password")) {
      callback("兩次輸入的密碼不一致");
    } else {
      callback();
    }
  };

  //提交按钮是否禁用判断
  vaIidate = () => {
    const { getFieldsError, getFieldsValue } = this.props.form;
    const value = Object.values(
      getFieldsValue(["password", "confirm", "oldpassword"])
    ).every(item => item !== undefined && item !== "");
    const error = Object.values(
      getFieldsError(["password", "confirm", "oldpassword"])
    ).every(item => item === "" || item === undefined);
    return value === true && error === true ? false : true;
  };

  render() {
    const { getFieldDecorator } = this.props.form;

    const formItemLayout = {
      labelCol: {
        md: { span: 8 },
        sm: { span: 24 },
        xs: { span: 24 }
      },
      wrapperCol: {
        md: { span: 16 },
        sm: { span: 24 },
        xs: { span: 24 }
      }
    };
    const tailFormItemLayout = {
      wrapperCol: {
        md: {
          span: 16,
          offset: 8
        },
        sm: {
          span: 24
        },
        xs: {
          span: 24
        }
      }
    };

    return (
      <Form {...formItemLayout} onSubmit={this.HandleSubmit}>
        <Form.Item label="Old password" hasFeedback>
          {getFieldDecorator("oldpassword", {
            rules: [
              {
                required: true,
                message: "請輸入現在的密碼"
              },
              {
                pattern: PASSWORD,
                message: "請輸入6~30位包含大小寫字母及數字的密碼"
              }
            ]
          })(<Input.Password />)}
        </Form.Item>
        <Form.Item label="Password" hasFeedback>
          {getFieldDecorator("password", {
            rules: [
              {
                required: true,
                message: "請輸入密碼"
              },
              {
                pattern: PASSWORD,
                message: "請輸入6~30位包含大小寫字母及數字的密碼"
              },
              {
                validator: this.validateToNextPassword
              }
            ]
          })(<Input.Password />)}
        </Form.Item>
        <Form.Item label="Confirm Password" hasFeedback>
          {getFieldDecorator("confirm", {
            rules: [
              {
                required: true,
                message: "請再次輸入密碼"
              },
              {
                validator: this.compareToFirstPassword
              }
            ]
          })(<Input.Password onBlur={this.handleConfirmBlur} />)}
        </Form.Item>

        <Form.Item {...tailFormItemLayout}>
          <Button type="primary" htmlType="submit" disabled={this.vaIidate()}>
            確認修改
          </Button>        
        </Form.Item>
      </Form>
    );
  }
}
export default Form.create()(ChangePassword);
