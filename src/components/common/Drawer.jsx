import React, { Component } from "react";
import { Drawer, Card, Avatar, Icon, Button, Row, Col, Modal } from "antd";
import { withRouter, Link } from "react-router-dom";
import { connect } from "react-redux";
import intl from "react-intl-universal";

import toast from "components/utils/toast";

import user_API from "components/services/userService";

import Achieve from "../Achieve";
import Weekchart from "../Weekchart";
import ChangePassword from "../ChangePassword";
import authService from "components/services/authService";

import FristLogin from "components/common/login/verify/fristLogin";
import ParentEdit from "components/common/login/role/parentEdit";
import TipsAddKid from "components/common/login/account/tipsAddKid";
import AddKid from "components/common/login/account/addKid";
import AddParent from "components/common/login/account/addParent";
import Register from "components/Register";

import "assets/css/drawer.module.scss";
// import loginBasics from "assets/css/login/basics.module.scss";
import parentLoginScss from "assets/css/login/parentLogin.module.scss";
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";

import icon1 from "assets/image/pageIcon1.png";
import icon2 from "assets/image/pageIcon2.png";
import icon3 from "assets/image/pageIcon3.png";
import icon4 from "assets/image/pageIcon4.png";
import icon5 from "assets/image/pageIcon5.png";
import icon6 from "assets/image/pageIcon6.png";
// import { url } from "inspector";
// import { url } from "inspector";

const { Meta } = Card;
const confirm = Modal.confirm;

/**
 * 抽屉组件
 * @使用方法:创建组件 <MyDrawer visible={} onClose={} data={} />
 * @param visible 抽屉显示状态 Boolean
 * @param onClose 关闭抽屉函数 Function 把visible设置为false
 * @param data 数据 Object
 * data={
    userAvatar: '用户头像路径',
    userName: '用户名',
    school: '学习名称',
    list: [{id: 1, picUrl: '成就徽章路径', finished: '已完成数', sum: '总数'}]
  }
 */

class MyDrawer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      routerLink: "",
      locationUrl: props.locationUrl,
      visible: false,
      viewState: {
        switchRole: false,
        switchClose: true
      },
      icon: [
        // {
        //   src: icon1,
        //   link: ""
        // },
        {
          // 龙虎榜
          src: icon2,
          link: "ranking"
        },
        {
          // 历史
          src: icon3,
          link: "history"
        },
        {
          src: icon4,
          link: ""
        },
        {
          src: icon5,
          link: ""
        },
        {
          // 我的最爱
          src: icon6,
          link: "favorite"
        }
      ]
    };
  }

  componentDidUpdate(prevProps, prevState) {
    const { user: prevUser } = prevProps;
    const {
      viewState: { switchRole: prevSwitchRole }
    } = prevState;
    const {
      props: {
        user,
        user: { type , status },
        updateAuth
      },
      state: {
        viewState: { switchRole }
      }
    } = this;
        
    
    if (prevUser !== user) {
      if (type === "PARENT") {
        updateAuth({ isParent: true , userState : (status==="VERIFY" ? "verify" : "") });
      }
    }
    if (prevSwitchRole !== switchRole && switchRole === true)
      updateAuth({ isParent: true });
  }

  //彈出框
  showModal = () => {
    this.setState({
      visible: true
    });
  };

  handleOk = e => {
    console.log(e);
    this.setState({
      visible: false
    });
  };

  handleCancel = e => {
    console.log(e);
    this.setState({
      visible: false
    });
  };

  //关闭用户抽屉
  onClose = () => {
    this.props.onClose();
  };

  _Logout(title = "", okText = "", cancelText = "") {
    // let host = window.origin;
    confirm({
      title: title, //"你確定要登出嗎？",
      okText: okText, //"確認",
      cancelText: cancelText, //"取消",
      // content: 'Some descriptions',
      async onOk() {
        authService.logout().then(ret => {
          window.location.href = "/";
        });
      },
      onCancel() {
        // console.log('Cancel');
      }
    });
  }

  /** 点击切换 展示 切换模态框 */
  showSlickModal = () => {
    // const { switchRole } = this.state;
    const {
      // props: { updateAuth },
      state: {
        viewState,
        viewState: { switchRole }
      }
    } = this;
    this.setState(
      { viewState: { ...viewState, switchRole: !switchRole } }
      // () => updateAuth({ isLogin: true })
    );
  };

  /** 点击关闭 关闭模态框 */
  setSwitchRole = switchRole => {
    const {
      props: { updateAuth },
      state: {
        viewState,
        viewState: { switchClose }
      }
    } = this;
    if (user_API.getType() === "PARENT" && switchClose)
      return toast.createToast({
        msg: "請選擇子女賬號後再瀏覽",
        position: "top-left",
        onOpen: () =>
          this.setState({
            viewState: { ...viewState, switchClose: !switchClose }
          }),
        onClose: () =>
          this.setState({ viewState: { ...viewState, switchClose } })
      });

    this.setState({ viewState: { ...viewState, switchRole } }, () =>
      updateAuth({ userState: "" })
    );
  };

  /** 渲染 modal el */
  modalElRender = () => {
    const {
      props: {
        auth: { userState }
      }
    } = this;

    const view = new Map()
      .set("tips", <TipsAddKid />)
      .set("addKid", <AddKid />)
      .set("addParent", <AddParent />)
      .set("kidAccount", <FristLogin />)
      .set("verify" , <Register result="1" />);
    return view.get(userState) || <ParentEdit />;
  };

  render() {
    const {
      modalElRender,
      props: {
        visible,
        data,
        locationUrl,
        user,
        auth: { userState },
        translations,
        route: {currentLanguage: $language},
        user: { img: userAvatar }
        // updateAuth
      },
      state: {
        viewState: { switchRole }
      }
    } = this;

    const intranet = !!user.intranet ? user.intranet : null;
    const _fn = function(value) {
      return translations.initDone && intl.get("home.publicMsg.drawer." + value);
    };
    const Language = {
      ChangePword: _fn("ChangePword"),
      LogoutWord: _fn("LogoutWord"),
      charttitle: _fn("charttitle"),
      chartmin: _fn("chartmin"),
      chartweek: _fn("chartweek"),
      awardtitle: _fn("awardtitle"),
      more: _fn("more"),
      LogoutTitle: _fn("LogoutTitle"),
      Btncancel: _fn("Btncancel"),
      Btnconfirm: _fn("Btnconfirm"),
      titleTransfer: _fn("titleTransfer")
    };

    return (
      //抽屉
      <Drawer
        width={320}
        className="drawer_container"
        placement="right"
        closable={true}
        onClose={this.onClose}
        visible={user_API.getType() === "PARENT" || visible}
        bodyStyle={{ padding: 0 }}
      >
        <Card
          className="drawer_header"
          bordered={false}
          bodyStyle={{ backgroundColor: "#41c6e3" }}
        >
          <Meta
            className="meta"
                        avatar={ <Avatar size = {100} src = {userAvatar || require("assets/image/user.png")} style={{backgroundColor:"white"}} /> }
                        title={user.full_name}
                        description={
                                    <React.Fragment>
                                        <p>{!!intranet && (intranet.school['name_' + $language.value])}</p>
                                        <p>{user.type === "STUDENT" && !!intranet && (<Button type="primary" size="small" shape="round">{`${intranet.grade['name_' + $language.value]}${intranet.class['name_' + $language.value]}`}</Button>)}</p>
                                    </React.Fragment>
            }
          />
          <Button className="SlickModal" onClick={this.showSlickModal}>
            <Icon type="sync" />
          </Button>
          <Modal
            centered
            width={600}
            visible={user_API.getType() === "PARENT" || switchRole}
                        bodyStyle={{
                padding: "0 0 20px 0",
                borderRadius: "15px",
                minHeight: `${userState === "addParent" ? "auto" : 600}`
                                            }}
            onCancel={() => this.setSwitchRole(false)}
            footer={null}
            maskClosable={false}
            className={parentLoginScss.parentEditModal}
          >
            {modalElRender()}
          </Modal>

          <br />

          <Button
            className="log_out"
            ghost="true"
            size="small"
            onClick={this._Logout.bind(
              this,
              Language.LogoutTitle,
              Language.Btnconfirm,
              Language.Btncancel
            )}
          >
            <Link
              to={{
                pathname: `${this.state.routerLink}`
              }}
            >
              {Language.LogoutWord}
              <Icon type="rollback" />
            </Link>
          </Button>

          {user.type === "STUDENT" ? (
            ""
          ) : (
            <Button
              className="log_out"
              ghost="true"
              size="small"
              onClick={this.showModal}
            >
              {Language.ChangePword}
            </Button>
          )}

          <Modal
            title="Change Password"
            visible={this.state.visible}
            footer={null}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
            style={{ background: "#fff", padding: "15px 20px" }}
          >
            <ChangePassword />
          </Modal>
        </Card>
        <Row className="linkwarp" type="flex" justify="center">
          <Col span={23} className="main">
            <Col
              className="item"
              style={{ backgroundImage: `url(${icon1})` }}
            />
            {this.state.icon.map((item, index) => {
              return (
                <Link
                  key={index}
                  to={{pathname: `${locationUrl}${item.link}`}}
                >
                  <Col
                    className="item"
                    style={{ backgroundImage: `url(${item.src})` }}
                  />
                </Link>
              );
            })}
          </Col>
        </Row>
                
                    <div style={{padding: "10px"}}>
          <Weekchart
            title={Language.charttitle}
            min={Language.chartmin}
            day={Language.chartweek}
          />
        </div>
                
        <Card
          className="drawer_achieve"
          title={Language.awardtitle}
          headStyle={{ border: "none" }}
          bordered={false}
        >
          <Row gutter={20}>
            {data.list.map(item => (
              <Col span={8} style={{ textAlign: "center" }} key={item.id}>
                <Achieve styles={"drawerPage"} data={item} />
              </Col>
            ))}
          </Row>
          <Link
                        to={{pathname: `${locationUrl}achievements`}}
          >
            <p>{Language.more}</p>
          </Link>
        </Card>
      </Drawer>
    );
  }
}


function mapStateToProps({ route, user, auth, translations }) {
  return {
    route,
    user,
    auth,
    translations
  };
}

function mapDispatchToProps(dispatch) {
  return {
    updateAuth: payload => dispatch({ type: "updateAuth", payload })
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(MyDrawer));
