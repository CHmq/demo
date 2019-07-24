//新增课程的课程资料页面
import React, { Component } from "react";
import {
  Row,
  Col,
  Form,
  Input,
  Button,
  DatePicker,
  Radio,
  Empty,
  TreeSelect
} from "antd";
import { connect } from "react-redux";
import intl from "react-intl-universal";
import BraftEditor from "braft-editor";
import moment from "moment";
import Memulist from "components/common/Memulist";
import PopupCoursware from "components/PopupCoursware";
import school from "components/services/school";
import $style from "assets/css/CourseData.module.scss";

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const { SHOW_PARENT } = TreeSelect;

class CourseData extends Component {
  constructor(props) {
    super(props);
    console.log(props);
    this.state = {
      data: !this.isUpdate()
        ? this.props.data
        : this.props.data.map(_res => {
            _res.id = _res.ref_id;
            return _res;
          }), //数据
      details: this.props.data[0], //右边栏显示课件详情
      status: "VALID", //Group选框
      startValue: null, // 開始時間
      endValue: null, // 結束時間
      visiblePopupCoursware: false, // 搜尋課件
      treeData: [], //treeSelect 数据
      description : "",
      editor : BraftEditor.createEditorState(null)
    };
  }

  isUpdate = () => {
    return !!this.props.updateData;
  };

  async componentDidMount() {
    this.$$isMount = true;
    this.props.updateFileName("home");
console.log("mount");
    if (typeof this.props.treeData !== "undefined") {
      this.setState({ treeData: this.props.treeData });
    } else {
      this.treeSelectData();
    }

    if (!!this.isUpdate()) {
      const data = this.props.updateData;
      this.setState( { description : data.description , editor : BraftEditor.createEditorState(data.description)});
      this.props.form.setFieldsValue({
        name: data.name,
        pubDate: data.publish_time && moment(data.publish_time, "YYYY-MM-DD HH:mm"),
        endTime: data.end_time && moment(data.end_time, "YYYY-MM-DD HH:mm"),
        grade: data.grade
      });
    } else {
      this.props.form.setFieldsValue({ name: this.props.courseTitle });
    }
  }

  componentWillUnmount = () => {
    this.$$isMount = false;
  };

  //treeSelect数据处理
  treeSelectData = async () => {
    let data = await school.getClassTree();
    if (!!this.$$isMount) {
      this.setState({ treeData: data });
    }
  };

  //表單提交
  handleSubmit = async e => {
    e.preventDefault();
    const value = this.props.form.getFieldsValue();
    const start = value.pubDate.format("YYYY-MM-DD HH:mm"); //发布日期字符串
    const end = value.endTime ? value.endTime.format("YYYY-MM-DD HH:mm") : ""; //结束日期字符串
    let obj = {
      course_id: this.props.URLid,
      name: value.name,
      des: this.state.editor && this.state.editor.toHTML() || this.state.description,
      start,
      end,
      status: this.state.status,
      grade: value.grade && value.grade.join()
    };
    if (this.props.updateData) obj.id = this.props.updateData.id;
    this.props.sendFormData(obj, this.state.data);
    this.props.nextStep();
  };

  //禁用按鈕
  vaIidate = () => {
    const { getFieldsError, getFieldsValue } = this.props.form;
    const grade = getFieldsValue(["grade"]).grade;
    let isTrue = false;
    if (grade && grade.length > 0) {
      isTrue = true;
    }
    const value = Object.values(
      getFieldsValue(["name", "pubDate", "grade"])
    ).every(item => item !== undefined && item !== "" && item !== null);
    const error = Object.values(
      getFieldsError(["name", "pubDate", "grade"])
    ).every(item => item === "" || item === undefined || item !== null);
    return value === true && error === true && isTrue === true ? false : true;
  };

  // 日期 选择（发布日期、结束日期 start）
  disabledStartDate = startValue => {
    const endValue = this.state.endValue;
    if (!startValue || !endValue) {
      return startValue && startValue < moment().startOf("day");
    }
    return (
      startValue.valueOf() > endValue.valueOf() ||
      startValue < moment().startOf("day")
    );
  };

  onChange = (field, value) => {
    this.setState({
      [field]: value
    });
  };

  onStartChange = current => {
    this.onChange("startValue", current);
  };

  onEndChange = current => {
    this.onChange("endValue", current);
  };

  disabledEndDate = endValue => {
    const startValue = this.state.startValue;
    if (!endValue || !startValue) {
      return endValue && endValue < moment().startOf("day");
    }
    return (
      endValue.valueOf() <= startValue.valueOf() ||
      endValue < moment().startOf("day")
    );
  };
  // 日期 选择（发布日期、结束日期 end）

  //点击右边栏显示课件详情
  handleCourseClick(item) {
    this.setState({
      details: item
    });
  }
  //删除课件
  handleCloseClick(index, e) {
    e.stopPropagation();
    let data = this.state.data;
    data.splice(index, 1);
    this.setState({
      data
    });
  }
  //下一步
  nextStep() {
    this.props.nextStep();
  }
  //编辑
  handleClickCompile = () => {
    this.setState({
      visiblePopupCoursware: true
    });

    this.child.getSearch(""); // 调用组件 PopupCoursware 里面的方法
  };
  onCancel = () => {
    this.setState({
      visiblePopupCoursware: false
    });
  };

  compileDone = data => {
    this.setState({ data });
    this.onCancel();
  };

  //Group選框
  handleGroupChange(item) {
    let value = item.target.value;
    if (value === "2") this.setState({ status: "DATE " });
    if (value === "3") this.setState({ status: "DATE_HIDDEN" });
  }
  // 调用子组件
  onRef = ref => {
    this.child = ref;
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { translations } = this.props;
    const controls = ["bold", "list-ul", "separator", "link"];
    return (
      <Row type="flex" justify="start">
        <Col lg={18} md={24} sm={24} xs={24} style={{ padding: 20 }}>
          <Form
            labelCol={{ lg: { span: 7 }, sm: { span: 4 } }}
            wrapperCol={{ lg: { span: 16 }, sm: { span: 19 } }}
            onSubmit={this.handleSubmit}
          >
            <Row type="flex" justify="center" className="form_container">
              <Col lg={12} md={12} sm={24} xs={24}>
                <Form.Item
                  label={
                    translations.initDone &&
                    intl.get("course_1.courseData.form.name")
                  }
                  hasFeedback
                >
                  {getFieldDecorator("name", {
                    rules: [
                      { required: true, message: "請輸入課程名稱" },
                      { whitespace: true, message: "課程名稱不能為空" }
                    ]
                  })(<Input placeholder="請輸入課程名稱" />)}
                </Form.Item>
                <Form.Item
                  label={
                    translations.initDone &&
                    intl.get("course_1.courseData.form.grade")
                  }
                  hasFeedback
                >
                  {getFieldDecorator("grade", {
                    rules: [{ required: true, message: "請選擇年級" }]
                  })(
                    <TreeSelect
                      treeData={this.state.treeData}
                      treeCheckable={true}
                      placeholder="請選擇年級"
                      allowClear={true}
                      showCheckedStrategy={SHOW_PARENT}
                    />
                  )}
                </Form.Item>
              </Col>
              <Col lg={12} md={12} sm={24} xs={24}>
                <Form.Item
                  label={
                    translations.initDone &&
                    intl.get("course_1.courseData.form.publish_time")
                  }
                  hasFeedback
                >
                  {getFieldDecorator("pubDate", {
                    rules: [
                      {
                        type: "object",
                        required: true,
                        message: "請選擇發佈時間"
                      }
                    ]
                  })(
                    <DatePicker
                      disabledDate={this.disabledStartDate}
                      onChange={this.onStartChange}
                      showTime
                      style={{ width: "100%" }}
                      format="YYYY-MM-DD HH:mm"
                      placeholder="開始日期"
                    />
                  )}
                </Form.Item>
                <Form.Item
                  label={
                    translations.initDone &&
                    intl.get("course_1.courseData.form.end_time")
                  }
                >
                  {getFieldDecorator("endTime", {
                    rules: [{ type: "object" }]
                  })(
                    <DatePicker
                      onChange={this.onEndChange}
                      disabledDate={this.disabledEndDate}
                      showTime
                      format="YYYY-MM-DD HH:mm"
                      style={{ width: "100%" }}
                      placeholder="結束日期"
                    />
                  )}
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  label={
                    translations.initDone &&
                    intl.get("course_1.courseData.form.description")
                  }
                  labelCol={{
                    xl: { span: 4 },
                    sm: { span: 4 },
                    lg: { span: 4 },
                    md: { span: 3 }
                  }}
                  wrapperCol={{
                    xl: { span: 19 },
                    sm: { span: 19 },
                    lg: { span: 19 },
                    md: { span: 20 }
                  }}
                >
                 
                <BraftEditor
                  value={this.state.editor}
                  controls={controls}
                  placeholder="請在這裡輸入文字"
                  className={$style.bfEditor}
                  onChange={(editor) => {
                      this.setState({editor} , () => {
                          console.log(this.state.editor);
                      });
                      console.log(editor);
                  }}
                />
                </Form.Item>
              </Col>
              <Col lg={16} md={16} sm={16} xs={24}>
                <Row type="flex" justify="center">
                  <Col lg={18} md={18} sm={20} xs={20}>
                    <RadioGroup
                      defaultValue="1"
                      onChange={this.handleGroupChange.bind(this)}
                      style={{ width: "100%" }}
                    >
                      <RadioButton value="1">
                        {translations.initDone &&
                          intl.get("course_1.courseData.RadioGroup.all")}
                      </RadioButton>
                      <RadioButton value="2">
                        {translations.initDone &&
                          intl.get("course_1.courseData.RadioGroup.schedule")}
                      </RadioButton>
                      <RadioButton value="3">
                        {translations.initDone &&
                          intl.get("course_1.courseData.RadioGroup.arrange")}
                      </RadioButton>
                    </RadioGroup>
                  </Col>
                  <Col span={24} gutter={10} className="publish_container">
                    {this.state.data.length ? (
                      <Row className="courseList_container">
                        {this.state.data.map((item, index) => {
                          return (
                            <Col
                              sm={8}
                              xs={12}
                              key={item.id}
                              onClick={this.handleCourseClick.bind(this, item)}
                            >
                              <div
                                className="close"
                                onClick={this.handleCloseClick.bind(
                                  this,
                                  index
                                )}
                              />
                              <Memulist
                                picUrl={item.file}
                                title={item.name}
                                titleFontSize={"12px"}
                              />
                            </Col>
                          );
                        })}
                      </Row>
                    ) : (
                      <Empty style={{ padding: "50px 0" }} />
                    )}
                  </Col>
                  <Col span={24}>
                    <Row gutter={30} className="button_container">
                      <Col span={8}>
                        <Button
                          type="primary"
                          block
                          onClick={this.handleClickCompile}
                        >
                          {translations.initDone &&
                            intl.get("course_1.courseData.button.compile")}
                        </Button>
                        <PopupCoursware
                          keyword={this.props.keyword}
                          tag={this.props.courseTitle}
                          onRef={this.onRef}
                          selected={this.state.data}
                          compile={data => {
                            this.compileDone(data);
                          }}
                          visible={this.state.visiblePopupCoursware}
                          onCancel={this.onCancel}
                        />
                      </Col>
                      {!!this.props.prevStep ? (
                        <Col span={8}>
                          <Button
                            type="primary"
                            block
                            onClick={this.props.prevStep || void 0}
                          >
                            {translations.initDone &&
                              intl.get("course_1.courseData.button.cancel")}
                          </Button>
                        </Col>
                      ) : (
                        ""
                      )}
                      <Col span={8}>
                        <Button
                          type="primary"
                          block
                          htmlType="submit"
                          disabled={this.vaIidate()}
                        >
                          {translations.initDone &&
                            intl.get("course_1.courseData.button.nextStep")}
                        </Button>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Form>
        </Col>
        <Col lg={6} md={0} sm={0} xs={0} className="details_container">
          {this.state.details ? (
            <>
              <h3>{this.state.details.name}</h3>
              {this.state.details.file ? (
                <Memulist picUrl={this.state.details.file} />
              ) : (
                <p style={{ color: "#ccc" }}>暫無圖片...</p>
              )}
              <div>
                <h4>教學重點</h4>
                {this.state.details.description ||
                this.state.details.teaching_point ? (
                  <p>
                    {this.state.details.description
                      ? this.state.details.description
                      : this.state.details.teaching_point}
                  </p>
                ) : (
                  <p style={{ color: "#ccc" }}>暫無内容...</p>
                )}
              </div>
            </>
          ) : (
            <Empty />
          )}
        </Col>
      </Row>
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
function mapDispatchToProps(dispatch) {
  return {
    updateFileName: payload => dispatch({ type: "updateFileName", payload })
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Form.create()(CourseData));
