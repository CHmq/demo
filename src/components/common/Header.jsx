import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Layout, Icon, Button, Avatar, Row, Col, Typography } from "antd";
import { connect } from "react-redux";
import intl from "react-intl-universal";
import MyDrawer from "components/common/Drawer";
import LanguageSwitch from "components/common/LanguageSwitch";
import user from "components/services/userService";

import img1 from "assets/image/achievement_01.png";
import img2 from "assets/image/achievement_02.png";
import img3 from "assets/image/achievement_03.png";

import style from "assets/css/layout.module.scss";

const { Header } = Layout;
const { Text } = Typography;

//用户抽屉虚拟数据
const drawerData = {
  school: "Evi幼稚園",
  //成就数据
  list: [
    { id: 1, picUrl: img1, finished: 80, sum: 100 },
    { id: 2, picUrl: img2, finished: 17, sum: 50 },
    { id: 3, picUrl: img3, finished: 5, sum: 20 },
    { id: 4, picUrl: img1, finished: 80, sum: 100 },
    { id: 5, picUrl: img2, finished: 17, sum: 50 },
    { id: 6, picUrl: img3, finished: 5, sum: 20 }
  ]
};

/**
 * 头部组件
 *    动态渲染 用户名 如果登陆了 就会显示 name
 *    如果没有登录 渲染 登录按钮
 *
 * @export 头部组件
 * @class Header
 * @extends {Component}
 */
class MyHeader extends Component {
  //用户抽屉状态
  state = {
    visible: false,
    data: drawerData,
    visiblePopupCoursware: false // 搜尋課件
  };

  componentDidMount() {
    // console.log(user.getType());
  }

  //显示用户抽屉
  showDrawer = () => {
    this.setState({
      visible: true
    });
  };
  //关闭用户抽屉
  onClose = () => {
    this.setState({
      visible: false
    });
  };
  // 搜尋課件
  _getClassData = () => {
    console.log("获取课程");
  };
  handleAddCourse = async e => {
    this.refs.PopupCoursware.getList();
    this.setState({
      visiblePopupCoursware: true
    });
  };
  onCancel = () => {
    this.setState({
      visiblePopupCoursware: false
    });
  };

  render() {
    const { locationUrl, translations } = this.props;
    const { img: userAvatar, full_name } = this.props.user;
    return (
      <Header className={style.header}>
        <Row type="flex" align="middle" justify="space-between">
            <Col xs={0} md={5} lg={3} xl={3} style={{marginRight: "auto"}}>
                <Link to={locationUrl}>
                    <img
                        src={require("assets/image/logo.png")}
                        alt=""
                        style={{width: "100%", cursor: "pointer"}}
                        />
                </Link>
            </Col>    
            <Col xs={3} sm={2} md={0} style={{marginRight: "auto"}}>     
                <Link to={locationUrl}>
                    <img
                        src={require("assets/image/logo_s.png")}
                        alt=""
                        style={{width: "100%", cursor: "pointer"}}
                        />
                </Link>
            </Col>
          <Col style={{ textAlign: "center" }}>
            <Button
              type="primary"
              shape="round"
              style={{ backgroundColor: "#ffd088", borderColor: "#fff" }}
            >
              {user.getType() ||
                (translations && intl.get(`home.publicMsg.header.parents`))}
            </Button>
          </Col>
          <Col>
            <LanguageSwitch />
          </Col>
          <Col
            style={{ cursor: "pointer", textAlign: "right" }}
            onClick={this.showDrawer}
          >
            <Avatar
              size="large"
              src={userAvatar || require("assets/image/user.png")}
              style={{backgroundColor:"white"}}
            />
            <div className={"d-inline-flex hidden visible-sm"}>
              <Text className={style["avatar-text"]}>{full_name}</Text>
            </div>
            <Icon
              className={"d-inline-flex hidden visible-sm"}
              type="caret-right"
            />
          </Col>
        </Row>

        {/* 用户抽屉 */}
        <MyDrawer
          visible={this.state.visible}
          onClose={this.onClose.bind(this)}
          data={this.state.data}
          locationUrl={locationUrl}
        />
      </Header>
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

export default connect(mapStateToProps)(MyHeader);
