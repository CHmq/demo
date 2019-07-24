import React, { Component } from "react";
import { Button, Modal, Form, Input, Icon } from "antd";

import toast from "components/utils/toast";
import user_API from "components/services/userService";

export class parentPwd extends Component {
  /** state
   * switchLoding 切换状态
   */
  state = {
    viewState: {
      switchLoding: false
    }
  };

  /** 切换loding state */
  switchState = () => {
    const { switchLoding } = this.state.viewState;
    this.setState({ viewState: { switchLoding: !switchLoding } });
  };

  /** 家長轉移角色切換 errors 處理
   * params 異常狀態碼
   */
  parentRoleError = code => {
    const {
      props: {
        form: { setFields }
      },
      switchState
    } = this;
    setFields({ pwd: "" });
    switch (code) {
      case 200:
        return toast.createToast({
          type: "error",
          msg: "家長密碼輸入錯誤,請重試",
          onClose: () => switchState()
        });
      default:
        return toast.createToast({
          type: "error",
          msg: "未知的錯誤,請聯繫客服",
          onClose: () => switchState()
        });
    }
  };

  /** parent 验证密码 */
  changeParentRole = async () => {
    const {
      props: {
        form: { getFieldValue },
        user_id
      },
      switchState
    } = this;
    switchState();
    try {
      await user_API.swap({ user_id, password: getFieldValue("pwd") });
      toast.createToast({
        type: "success",
        msg: `即將為您切換家长到賬號下`,
        onClose: () => {
          switchState();
          window.location.reload();
        }
      });
    } catch (error) {
      console.log(error);
      this.parentRoleError(error.result);
    }
  };

  render() {
    const {
      state: {
        viewState: { switchLoding }
      },
      props: {
        parentModalCancel,
        form: { getFieldDecorator, getFieldError, getFieldValue }
      }
    } = this;
    return (
      <Modal
        title="請輸入家長賬號密碼"
        visible={true}
        bodyStyle={{ backgroundColor: "#fff" }}
        onCancel={() => parentModalCancel(false)}
        centered
        footer={[
          <Button
            key="submit"
            type="primary"
            loading={switchLoding}
            onClick={this.changeParentRole}
            disabled={getFieldError("pwd") || !getFieldValue("pwd")}
          >
            Switch
          </Button>
        ]}
        maskClosable={false}
      >
        <Form layout="inline" onSubmit={this.handleSubmit}>
          <Form.Item>
            {getFieldDecorator("pwd", {
              rules: [
                { required: true, message: "Please input your Password!" }
              ]
            })(
              <Input
                prefix={
                  <Icon type="lock" style={{ color: "rgba(0,0,0,.25)" }} />
                }
                type="password"
                placeholder="Password"
                autoFocus
                onPressEnter={this.changeParentRole}
              />
            )}
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

export default Form.create()(parentPwd);
