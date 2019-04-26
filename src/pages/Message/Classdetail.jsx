import React, { Component } from 'react'
import {Card,Form,Button,Input,Checkbox,Radio,Select,Switch,DatePicker,TimePicker,Upload,Icon,message, InputNumber} from 'antd'
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const Option = Select.Option;
const TextArea = Input.TextArea;

class Classdetail extends Component {

  state={


      //成就数据
      getField: [
        {
          'className':"课程1",
          'teach':"文字女子文字女子文字女子文字女子文字女子文字女子",
          'startdate':"2019-4-15",
          'enddate':"2019-7-26"
        }
      ]
  }

  render() {
    const item =this.state.getField
    console.log(item[0].className)
    const formItemLayout = {
        labelCol:{
            xs:24,
            sm:8
        },
        wrapperCol:{
            xs:24,
            sm:10
        }
    }
    const offsetLayout = {
        wrapperCol:{
            xs:24,
            sm:{
                span:12,
                offset:4
            }
        }
    }
    const rowObject = {
        minRows: 4, maxRows: 6
    }
    return (
      <div>
          <Form layout="horizontal">
          
            {/* 文本框 */}
            <FormItem label="课程名称" {...formItemLayout}>
            {/* {
                  getField('className', {
                      initialValue: '',
                      rules: [
                          {
                              required: true,
                              message: '用户名不能为空'
                          }
                      ]
                  })(
                      <Input placeholder="请输入用户名" />
                  )
              } */}
              <Input placeholder="请输课程名" value={item[0].className}/>
            </FormItem>
            
            {/* 多行文本框 */}
            <FormItem label="教学重点" {...formItemLayout}>              
              <TextArea
                  autosize={rowObject} value={item[0].teach}
              />
            </FormItem>

            {/* 日期选择器 */}
            <FormItem label="发布日期" {...formItemLayout}>
                {(
                        <DatePicker
                            showTime
                            format="YYYY-MM-DD"
                        />
                    )
                }
            </FormItem>

            {/* 日期选择器 */}
            <FormItem label="结束日期" {...formItemLayout}>
                {(
                        <DatePicker
                            showTime
                            format="YYYY-MM-DD"
                        />
                    )
                }
            </FormItem>

            

            
            {/* 单选按钮 */}
            {/* <FormItem label="性别" {...formItemLayout}>
                {(
                        <RadioGroup>
                            <Radio value="1">男</Radio>
                            <Radio value="2">女</Radio>
                        </RadioGroup>
                    )
                }
            </FormItem> */}

            
            {/* 数值选择器 */}
            {/* <FormItem label="年龄" {...formItemLayout}>
                {(
                        <InputNumber  />
                    )
                }
            </FormItem> */}

            {/* 下拉选框 */}
            {/* <FormItem label="当前状态" {...formItemLayout}>
                {(
                        <Select>
                            <Option value="1">咸鱼一条</Option>
                            <Option value="2">风华浪子</Option>
                            <Option value="3">北大才子一枚</Option>
                            <Option value="4">百度FE</Option>
                            <Option value="5">创业者</Option>
                        </Select>
                    )
                }
            </FormItem> */}


            {/* 开关 */}
            {/* <FormItem label="是否已婚" {...formItemLayout}>
                {(
                        <Switch/>
                    )
                }
            </FormItem> */}





            {/* 时间选择器 */}
            {/* <FormItem label="早起时间" {...formItemLayout}>
                {
                        <TimePicker/>
                }
            </FormItem> */}



            {/* 上传图片 */}
            {/* <FormItem label="头像" {...formItemLayout}>
                {
                        <Upload
                            listType="picture-card"
                            showUploadList={false}
                            action="//jsonplaceholder.typicode.com/posts/"
                            onChange={this.handleChange}
                        >
                        {this.state.userImg?<img src={this.state.userImg}/>:<Icon type="plus"/>}
                        </Upload>
                }
            </FormItem> */}
            {/* <FormItem {...offsetLayout}>
                {
                        <Checkbox>我已阅读过<a href="#">慕课协议</a></Checkbox>
                }
            </FormItem> */}
            <FormItem {...offsetLayout}>
                <Button type="primary" onClick={this.handleSubmit}>编辑</Button>
            </FormItem>
        </Form>
      </div>
    )
  }
}
export default Form.create()(Classdetail);