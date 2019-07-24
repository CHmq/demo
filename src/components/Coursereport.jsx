//新增课程页面
import React, { Component } from "react";
import { Table, Form, Select, Button, Input } from "antd";
import { connect } from "react-redux";
import Memulist from "./common/Memulist";
// import intl from "react-intl-universal";

import "../assets/css/studentedit.module.scss";
import img1 from "../assets/image/exploration3.png";

const FormItem = Form.Item;
const Option = Select.Option;
const { Search } = Input;

const list = [
  {
    id: "0",
    userName: "陳曉明",
    class1: "1",
    class2: "0",
    class3: "1",
    class4: "0",
    class5: "1",
    class6: "0",
    class7: "1"
  },
  {
    id: "1",
    userName: "陳大明",
    class1: "0",
    class2: "0",
    class3: "1",
    class4: "0",
    class5: "1",
    class6: "0",
    class7: "1"
  },
  {
    id: "2",
    userName: "陳小明",
    class1: "1",
    class2: "1",
    class3: "0",
    class4: "1",
    class5: "1",
    class6: "0",
    class7: "1"
  }
];

class Coursereport extends Component {
  state = {
    list: list
  };

  //獲取頁面數據
  async componentDidMount() {}

  render() {
    const { getFieldDecorator } = this.props.form;
    const contenttitle = (
      <Memulist
        multi={true}
        index={"1"}
        picUrl={img1}
        title={"課程名稱"}
        titlePadding={"0 0 0 20px"}
        height={"80px"}
        width={"105px"}
      />
    );
    const columns = [
      {
        title: "學生姓名",
        className:"bg2",
        dataIndex: "userName",
      },
      {
        title: contenttitle,
        className:"bg",
        dataIndex: "class1",
        render(class1) {
          return class1 === "1" ? "✔" : "×";
        }
      },
      {
        title: contenttitle,
        className:"bg2",
        dataIndex: "class2",
        render(class2) {
          return class2 === "1" ? "✔" : "×";
        }
      },
      {
        title: contenttitle,
        className:"bg",
        dataIndex: "class3",
        render(class3) {
          return class3 === "1" ? "✔" : "×";
        }
      },
      {
        title: contenttitle,
        className:"bg2",
        dataIndex: "class4",
        render(class4) {
          return class4 === "1" ? "✔" : "×";
        }
      },
      {
        title: contenttitle,
        className:"bg",
        dataIndex: "class5",
        render(class5) {
          return class5 === "1" ? "✔" : "×";
        }
      },
      {
        title: contenttitle,
        className:"bg2",
        dataIndex: "class6",
        render(class6) {
          return class6 === "1" ? "✔" : "×";
        }
      },
      {
        title: contenttitle,
        className:"bg",
        dataIndex: "class7",
        render(class7) {
          return class7 === "1" ? "✔" : "×";
        }
      },
      {
        title: "操作",
        render: (text, item) => {
          return <Button>提醒</Button>;
        }
      }
    ];
    return (
      <div className="card-container">
        <div className="table-operations">
          <Form layout="inline">
            <FormItem>
              {getFieldDecorator("Year")(
                <Select style={{ width: 140 }} placeholder="2018-2019">
                  <Option value="1">2017-2018</Option>
                  <Option value="2">2016-2017</Option>
                </Select>
              )}
            </FormItem>
            <FormItem>
              {getFieldDecorator("Curriculum")(
                <Select style={{ width: 140 }} placeholder="選擇課程">
                  <Option value="1">校本課程</Option>
                  <Option value="2">文字變變變</Option>
                </Select>
              )}
            </FormItem>
            <FormItem>
              {getFieldDecorator("Grade")(
                <Select style={{ width: 140 }} placeholder="選擇年級">
                  <Option value="1">一年級</Option>
                  <Option value="2">二年級</Option>
                </Select>
              )}
            </FormItem>
            <FormItem>
              {getFieldDecorator("Classnum")(
                <Select style={{ width: 140 }} placeholder="選擇班別">
                  <Option value="1">1班</Option>
                  <Option value="2">2班</Option>
                </Select>
              )}
            </FormItem>
            <FormItem>
              {getFieldDecorator("Studentname")(
                <Search
                  placeholder="搜尋學生姓名"
                  onSearch={value => console.log(value)}
                  style={{ width: 200 }}
                />
              )}
            </FormItem>
          </Form>
          <div className="studentEdit">
            <Table
              columns={columns}
              dataSource={this.state.list}
              pagination={false}
            />
          </div>
        </div>
      </div>
    );
  }
}

/** redux 獲得全局數據
 * route  route data (url, language) --暫時沒有用到
 * user  user data (用戶數據)
 */
function mapStateToProps({ route, user, translations }) {
  return {
    route,
    user,
    translations
  };
}

/** redux 數據更新
 * initLanguageState  初始化 language  bool
 * updateTranslations 更新language 以渲染多语言
 */


export default connect(mapStateToProps)(Form.create()(Coursereport));
