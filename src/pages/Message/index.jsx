import React, { Component } from 'react';
import {Button,Modal} from 'antd';
import ModelTabs from './ModelTabs';

export default class Message extends Component {

  state = { visible: false }

  showModal = () => {
    this.setState({
      visible: true,
    });
  }

    handleOk = (e) => {
    this.setState({
      visible: false,
    });
  }

  handleCancel = (e) => {
    this.setState({
      visible: false,
    });
  }

  render() {
    return (
      <div>

        <Button type="primary" onClick={this.showModal}>
          Open Modal
        </Button>
        <Modal
          title="新增课程"
          mask ={false}
          visible={this.state.visible}
          onOk={this.handleOk}
          footer={false}
        >
          <ModelTabs/>
        </Modal>
      </div>
    )
  }
}
