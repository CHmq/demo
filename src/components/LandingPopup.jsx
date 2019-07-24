/*
 * @使用方法:创建组件<Banner img={'图片路径'} height={'默认为400px'} heightauto={默认为false }>
 */

import React, { Component } from "react";
import { Button, Modal } from "antd";
import Login from "components/common/login";
import Register from "components/Register";
import StudentEdit from "components/StudentEdit";
import "assets/css/ManagePopup.module.scss";
import { connect } from "react-redux";

class LandingPopup extends Component {
  state = { visible: false, familyToken: null };

  componentDidMount() {
    this.setState({
      visible: !!this.props.familyToken,
      familyToken: this.props.familyToken
    });
  }

  //彈出框
  showModal = () => {
    this.setState({
      visible: true
    });
  };

  handleOk = e => {
    this.setState({
      visible: false
    });
  };

  handleCancel = e => {
    this.setState({
      visible: false
    });
  };

  /** 还原 login 默认 view */
  onClose = e => {
    return this.props.updateAuth({ userState: "" });
  };

  _alert(type) {
    switch (type) {
      case "login":
        return <Login />;
      case "register":
        return <Register familyToken={this.state.familyToken} />;
      case "studentedit":
        return <StudentEdit title={this.props.title} />;
      default:
        return <div className="card-container" />;
    }
  }

  render() {
    const {
      title,
      type,
      style,
      width,
      closable,
      Modalstyle,
      className,
      auth: { userState }
    } = this.props;

    return (
      <div style={{ display: "inline-block" }}>
        <Button
          onClick={this.showModal}
          style={{ ...style, ...this.props.style }}
        >
          {title}
        </Button>
        <Modal
          className={className}
          width={width || (userState === "register" ? 600 : 400)}
          visible={this.state.visible}
          footer={null}
          onOk={this.handleOk}
          closable={closable}
          onCancel={this.handleCancel}
          style={Modalstyle}
          afterClose={this.onClose}
          centered={type === "login" && true}
        >
          {this._alert(type)}
        </Modal>
      </div>
    );
  }
}

/** redux 數據獲取
 * auth 登錄信息
 */
function mapStateToProps({ auth }) {
  return { auth };
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
  mapDispatchToProps,
  null,
  { forwardRef: true }
)(LandingPopup);
