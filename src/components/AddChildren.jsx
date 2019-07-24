import React, { Component } from "react";
import { Form, Input, Button, Radio, message } from "antd";
// import config from "components/services/config.json";
import family from "./services/familyService"
/**   
 * 添加子类
 *  */
class AddChildren extends Component {
  handleSubmit = e => {
    e.preventDefault();
    // const pathSnippets = this.props.match.url.split("/").filter(i => i); // 获取url
    // const address = pathSnippets[0]; // 地区
    // const address = this.props.$location; // 地区
    // const translate = config[address].filter(item => item === pathSnippets[1]); // 是否是存在翻译
    const translate = this.props.$language.value; // 语言
    // const language =
    //   translate.length === 1 ? `/${translate[0]}` : `/${address}`; // 语言

    this.props.form.validateFields((err, values) => {
      if (!err) {
        // 信息正確填寫處理
        this._add(values, translate);
      } else {
        // 信息錯誤填寫處理
      }
    });
  };
  async _add(values, language) {
   await family.AddChildren(values,language).then(ret=>{
     message.success("添加成功");
     console.log(ret)
   }).catch(_msg =>{
     //SHOW MESSAGE
      console.log(_msg);
   })
  }

  vaIidate = () => {
    const { getFieldsError, getFieldsValue } = this.props.form;
    const value = getFieldsValue(["first_name", "last_name", "sex"]);
    const error = getFieldsError(["first_name", "last_name", "sex"]);
    return error.last_name ||
      error.first_name ||
      error.sex ||
      !value.last_name ||
      !value.first_name ||
      !value.sex
      ? true
      : false;
  };
  render() {
    const style = {
      top: "50%",
      left: "50%",
      transform: "translate(-50%,-50%)",
      position: "absolute"
    };
    // 樣式自適應
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      }
    };
    const { getFieldDecorator } = this.props.form;
    return (
      <Form
        {...formItemLayout}
        onSubmit={this.handleSubmit}
        className="login-form"
        style={style}
      >
        <Form.Item label="姓氏">
          {getFieldDecorator("first_name", {
            rules: [{ required: true, message: "請輸入你的性氏" }]
          })(<Input placeholder="" />)}
        </Form.Item>
        <Form.Item label="名字">
          {getFieldDecorator("last_name", {
            rules: [{ required: true, message: "請輸入你的名字" }]
          })(<Input placeholder="" />)}
        </Form.Item>
        <Form.Item label="性別">
          {getFieldDecorator("sex", {
            rules: [{ required: true, message: "請選擇性別" }]
          })(
            <Radio.Group>
              <Radio value="M">男</Radio>
              <Radio value="F">女</Radio>
            </Radio.Group>
          )}
        </Form.Item>
        <div>
          <Button
            type="primary"
            style={{ width: "100%" }}
            htmlType="submit"
            disabled={this.vaIidate()}
          >
            添加
          </Button>
        </div>
      </Form>
    );
  }
}

export default Form.create()(AddChildren);
