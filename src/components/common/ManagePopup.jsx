import React, { Component } from "react";
import { Modal, Row, Col } from "antd";
import "assets/css/ManagePopup.module.scss";


//管理彈出框
class managePopup extends Component {

  handleCancel = () => {
    this.props.onCancel();
  };

  render() {
    // width 是最大值
    const { width, visible, title } = this.props;
    return (
      <div>
        <Modal
          className="manageModal"
          width={'95%'}
          visible={visible}
          onCancel={this.handleCancel}
          footer={null}
          style={{maxWidth:`${width}px`}}
          destroyOnClose={true}
          centered={true}
          zIndex={5}
        >
          <Row className="manage-container">
            <Col>
              <h3 className="title">{title}</h3>
            </Col>
            <Col>
              {this.props.children}
            </Col>
          </Row>
        </Modal>
      </div>
    );
  }
}

export default managePopup;
