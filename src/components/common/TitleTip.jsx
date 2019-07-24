/*
 * @使用方法:创建组件<TitleTip tip={''} width='默认100%'>
 */
import React, { Component } from "react";
import { Row, Skeleton, Icon, Modal, Form, Input, Button, message } from "antd";
import BraftEditor from 'braft-editor'
import style from "assets/css/TitleTip.module.scss";
import course from "components/services/courseService";

class TitleTip extends Component {
  static defaultProps = {
    width: "100%",
    color: "",
    title: "",
    URLid: ''
  };
  state = { visible: false };

  //提交
  handleSubmit = async (event) => {
    event.preventDefault()
    const value = this.props.form.getFieldsValue();
    const id = this.props.URLid;
    const obj = {
      id,
      name: value.title, 
      description: value.content.toHTML()
    }
    await course.titleTipUpdate(obj).then(ret => {
      console.log(ret);
      message.success('更改成功');
      this.setState({visible: false});
      this.props.updateData();
    }).catch(_msg => {
      console.log(_msg);
    })
  }

  showModal = () => {
    this.setState({
      visible: true,
    });
    console.log(this.props);
    this.props.form.setFieldsValue({
      "title": this.props.title,
      "content": BraftEditor.createEditorState(this.props.tip)
    })
  };

  handleOk = e => {
    this.setState({
      visible: false,
    });
  };

  handleCancel = e => {
    this.setState({
      visible: false,
    });
  };

    
  render() {
    const { width, color, title, tip } = this.props;
    const { getFieldDecorator } = this.props.form
    const styleCss = {
      TitleTipWarp: {
        width: width,
        color: color,
        height: "100%",
        flexDirection : "column",
        justifyContent: "center"
      },
      content: {
        maxHeight: "100%",
        overflowY: "auto",
        width:"100%",
        padding:"0 5px"
      }
    };
    const controls = ['bold', 'list-ul', 'separator', 'link']
    return (
      <Row type="flex" align="middle" justify="start" style={styleCss.TitleTipWarp}>
        <div className={style.TitleTipTitle} style={{width:"100%"}}>{title}</div>
        {!!this.props.manage || !(!!title && !tip) ? (
        <div className={style.TitleTipText} style={{height: "40%", width:"100%"}}>
          <Skeleton active loading={tip ? false : true}>
            <div style={styleCss.content} dangerouslySetInnerHTML={{ __html: tip }} />
          </Skeleton>
          {this.props.manage && (
            <div className={style.set} onClick={this.showModal}><Icon type="form" /></div>
          )}
          <Modal
            title="編輯"
            visible={this.state.visible}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
            centered
            footer={null}
          >
            <Row className={style.form_container}>
              <Form onSubmit={this.handleSubmit}>
                <Form.Item label="標題">
                  {getFieldDecorator('title', {
                    rules: [{
                      required: true,
                      message: 'Title',
                    }],
                  })(
                    <Input size="large" placeholder="Title"/>
                  )}
                </Form.Item>
                <Form.Item label="正文">
                  {getFieldDecorator('content', {
                    validateTrigger: 'onBlur',
                    rules: [{
                      required: true,
                      validator: (_, value, callback) => {
                        if (value.isEmpty()) {
                          callback('Write down something')
                        } else {
                          callback()
                        }
                      }
                    }],
                  })(
                    <BraftEditor
                      className={style.editor}
                      controls={controls}
                      placeholder="..."
                      style={{maxHeight: 300, overflowX: 'hidden', border: '1px solid #d9d9d9', borderRadius: 4}}
                    />
                  )}
                </Form.Item>
                <Form.Item style={{textAlign: 'center'}}>
                  <Button size="large" type="primary" htmlType="submit">提交</Button>
                </Form.Item>
              </Form>
            </Row>
          </Modal>
        </div>) : ("") }
      </Row>
    );
  }
}
export default Form.create()(TitleTip)
