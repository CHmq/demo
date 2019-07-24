//新增课程页面
import React, { Component } from "react";
import { Tabs, Row, Col , Drawer } from "antd";
import { connect } from "react-redux";
import intl from "react-intl-universal";
import ManagePopup from "components/common/ManagePopup";
import Memulist from "components/common/Memulist";
import SubClass from "components/SubClass";
import CourseData from "components/CourseData";
import CourseSort from "components/CourseSort";
import course from "components/services/courseService";
// import img from "assets/image/addCourseBorder.png"

const TabPane = Tabs.TabPane;

const styles = {
  // background: `url(${img}) no-repeat`,
  // padding: '21px 6px 6px 8px',
  border: "8px solid #e1ecff",
  borderRadius: 6,
  backgroundSize: "100%, 100%",
  marginBottom: 10
};

class CourseEditor extends Component {
  state = {
    visible: false, //彈框狀態
    title: "新增课程", // 标题
    category: [],
    data: [], //新增课程数据
    subPic: "", //子分类图片
    render: 1, //决定渲染父页面还是子页面
    resource : [],
    formData: {}, //课程资料页面传过来的表单数据
    sortData: {}, //排序页面数据
    activeKey: "1", //tab的key
    disabled: true
  };
  
  init = async() => {
    const { updateFileName } = this.props;
    updateFileName("home");
    let list = await course.getCourseList().then(ret => {
      return ret.rows.map((menu) => {
        if(!!menu.parent_id) {
          menu.parent_name = (ret.rows.filter(_menu => _menu.id === menu.parent_id) || [{'name' : menu.parent_id}])[0].name;
          }
          return menu;
        });
    }).catch(_msg => {
        console.log(_msg);
      });
    this.setState({
      data: list.filter(menu => {
        return !!menu && !!menu.parent_id;
      }),
      category: list.filter(menu => {
        return !menu.parent_id;
      })
    });
    console.log(this.state.category);
  }

  //獲取頁面數據
  async componentDidMount() {
    this.props.onRef(this);
    if(!this.state.visible) {
        return;
    }
    this.init();
  }
  //显示弹框
  showModal = () => {
    this.setState({
      visible: true,
      data : [],
      category : []
    });
    this.init();
  }
  //隐藏弹框
  onCancel = () => {
    this.setState({
      visible: false,
      render: 1,
      activeKey: "1",
      disabled: true
    });
  };

  refresh = () => {
    this.props.refresh();
  };
  
  _prevStep = () => {
      this.setState({render : this.state.render - 1});
  }
  
  _nextStep = () => {
      this.setState({render : this.state.render + 1});
  }

  //渲染子分類頁面
  async handleMemulist(item) {
    let { id, file, name, tag } = item;
    console.log(id , file , name , tag);
      this._nextStep();
    this.setState({
      selectedTitle : name,
      title: name,
      tag : tag,
      tagID : id,
      subPic: file
    } , () => {
    });
  }
  
  //子分類頁面返回
  backSubClass() {
    this.setState({
      render: 1
    });
  }
  //获取表单数据
  getFormData(item, data) {
    console.log(item.id);
    this.setState({
      formData: item,
      sortData: data
    });
  }
  //課程資料頁面下一步
  
  prevStep = () => {
      this.setState({render : (this.state.render - 1)});
  }
  
  nextStep() {
    this.setState({
      activeKey: "2",
      disabled: false
    });
  }
  //課程排序頁面上一步
  sortCancel() {
    this.setState({
      activeKey: "1",
      disabled: true
    });
  }

  _alert(render) {
    const { translations } = this.props;
    switch (render) {
      case 1:
        return (
          <div className="card-container" style={!(this.state.category.length > 0) ? {minHeight:"400px" , backgroundColor:"white"} : {}}>
            <Tabs
              type="card"
              defaultActiveKey={
                (this.state.category[0] || [{ alias: 1 }]).alias
              }
              tabBarStyle={{ padding: "0 20px" }}
            >
              {this.state.category.map(menu => {
                return (
                  <TabPane tab={menu.name} key={menu.alias}>
                    <Row style={{ minHeight: 400 }} gutter={10}>
                      {this.state.data.map(item => {
                        if (item.parent_id == menu.id)
                          return (
                            <Col key={item.id} lg={4} md={6} sm={8} xs={12}>
                              <div style={styles}>
                                <Memulist
                                  onClick={() => {
                                    this.handleMemulist(item);
                                  }}
                                  picUrl={item.file}
                                  title={item.name}
                                  titleBgcolor={"rgba(0, 110, 255, 0.5)"}
                                  height={109}
                                />
                              </div>
                            </Col>
                          );
                      })}
                    </Row>
                  </TabPane>
                );
              })}
            </Tabs>
          </div>
        );
      case 2:
        return (
          <SubClass
            picUrl={this.state.subPic}
            tag={this.state.tag}
            tagID={this.state.tagID}
            data={this.state.subData}
            prevStep={this._prevStep}
            callback={({tag , resource , tagList}) => {
                this.setState({
                  resource,
                  courseTitle : `${this.state.selectedTitle}${(tag.length === tagList.length || tagList.length === 0) ? "" :( "(" + tag.map((_select) => _select.name).join(',') + ")")}`,
                  title: translations.initDone && intl.get("course_1.courseData.addTitle"),
                } , () => {
                    this._nextStep();
                });
            }}
          />
        );
      default:
        return (
          <div className="card-container">
            <Tabs
              type="card"
              activeKey={this.state.activeKey}
              tabBarStyle={{ padding: "0 20px" }}
            >
              <TabPane tab={translations.initDone && intl.get("course_1.courseData.editTitle")} key="1" disabled={!this.state.disabled} style={{padding: 0}}>
                <CourseData 
                courseTitle={this.state.courseTitle}
                data={this.state.resource} 
                URLid={this.props.URLid}
                sendFormData={(item, data)=>{this.getFormData(item, data)}}
                prevStep={()=>{this.prevStep()}}
                nextStep={()=>{this.nextStep()}}
                />
              </TabPane>
              <TabPane
                tab={translations.initDone && intl.get("course_1.tabs.sort")}
                key="2"
                disabled={this.state.disabled}
              >
                <CourseSort
                  data={this.state.sortData}
                  formData={this.state.formData}
                  onCancel={() => {
                    this.sortCancel();
                  }}
                  closePopup={() => {
                    this.onCancel();
                  }}
                  refresh={() => {
                    this.props.refresh();
                  }}
                />
              </TabPane>
            </Tabs>
          </div>
        );
    }
  }

  render() {
    return (
      <ManagePopup
        title={this.state.title}
        width={930}
        visible={this.state.visible}
        onCancel={this.onCancel}
      >
        {this._alert(this.state.render)}
      </ManagePopup>
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
)(CourseEditor);
