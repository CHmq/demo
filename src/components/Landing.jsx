import React, { Component } from "react";
import { connect } from "react-redux";
import { Layout, Row, Col, Button, Divider } from "antd";
// import { Link } from "react-router-dom";
import intl from "react-intl-universal";
import LandingBanner from "./LandingBanner";
import LandingPopup from "./LandingPopup";
import LanguageSwitch from "components/common/LanguageSwitch";
import SlickCarousel from "./SlickCarousel";
import logoutStyle from "assets/css/logout.module.scss";

class Landing extends Component {
  constructor(props) {
    super(props);
    this.props.initRoute(this.getRoute());
  }

  componentDidMount() {
    this.props.initRoute(this.getRoute());
    this.props.updateFileName(["home"]);
  }

  getRoute = () => {
    let {
      $language: currentLanguage,
      $location: currentLocation,
      $voLanguage: currentVoLanguage,
      $rootURL: locationUrl,
      match,
      tag,
      history
    } = this.props;

    let route = {
      currentLanguage,
      currentLocation,
      currentVoLanguage,
      locationUrl,
      tag: tag,
      history
    };
    return route;
  };

  render() {
    const { Header, Content, Footer } = Layout;

    // 登入彈框樣式
    const style = {
      width: "100%",
      height: "100%",
      textAlign: "center",
      paddingTop: "5px",
      background: "#1890ff",
      borderRadius: "7px",
      fontSize: "16px",
      color: "#fff",
      border: "none",
      padding: "10px 30px"
    };
    // 注冊彈框樣式
    const style1 = {
      color: "#fff",
      border: "none",
      padding: 0,
      cursor: "pointer",
      fontSize: "14px"
    };
    const Modalstyle = {
      background: "#fff",
      padding: "15px 20px",
      borderRadius: "15px 20px",
      maxWidth: "620px"
    };



    const {  translations } = this.props;
    return (
      <div>
        <Header className={logoutStyle.header}>
          <div className={logoutStyle.bar}>
            <Row type="flex" justify="end">
              <Col xs={23}>
                <div className={logoutStyle.header_right}>
                  <LandingPopup
                    ref="LandingPopup"
                    title={
                      translations.initDone && intl.get("home.publicMsg.header.loginbtn")
                    }
                    type={"login"}
                    style={style1}
                    width="400px"
                    closable={false}
                    Modalstyle={Modalstyle}
                  />
                  <Divider type="vertical" />
                  <LandingPopup
                    ref="LandingPopup"
                    title={
                      translations.initDone && intl.get("home.publicMsg.header.registerbtn")
                    }
                    type={"register"}
                    style={{ ...style1 }}
                    width="100%"
                    closable={false}
                    Modalstyle={Modalstyle}
                    familyToken={this.props.match.params.family_token || ""}
                  />
                  <Divider type="vertical" />
                  <LanguageSwitch />
                </div>
              </Col>
            </Row>
          </div>

          <div style={{ backgroundColor: "#fff" }}>
            <Row type="flex" justify="center">
              <Col xs={22} md={20} xl={20}>
                <Row type="flex" justify="space-between" align="middle">
                  {/* logo */}
                  <Col xs={{ span: 16 }} md={6} xl={5}>
                    <img
                      src={require("assets/image/logo.png")}
                      alt=""
                      style={{
                        width: "100%",
                        cursor: "pointer",
                        margin: "17px 0"
                      }}
                    />
                  </Col>
                  <Col>
                    {" "}
                    <LandingPopup
                      ref="LandingPopup"
                      title={
                        translations.initDone && intl.get("home.publicMsg.header.loginbtn")
                      }
                      type={"login"}
                      style={style}
                      closable={false}
                      Modalstyle={Modalstyle}
                    />
                  </Col>
                </Row>
              </Col>
            </Row>
          </div>
        </Header>
        <Content>
          <LandingBanner />

          {/* 三個色塊 */}
          <Row
            type="flex"
            justify="center"
            gutter={32}
            style={{ margin: "50px 0 0" }}
          >
            <Col xs={24} lg={20}>
              <Col xs={24} lg={8}>
                <div
                  className={logoutStyle.section}
                  style={{ background: "#dff9ff" }}
                >
                  <img src={require("assets/image/Group1.png")} alt="" />
                  <h4>{translations.initDone && intl.get("loading.content.titleleft")}</h4>
                  <p>{translations.initDone && intl.get("loading.content.contentleft")}</p>
                  <Button>{translations.initDone && intl.get("loading.content.morebtn")}</Button>
                </div>
              </Col>
              <Col xs={24} lg={8}>
                <div
                  className={logoutStyle.section}
                  style={{ background: "#fff7e7" }}
                >
                  <img src={require("assets/image/Group2.png")} alt="" />
                  <h4>{translations.initDone && intl.get("loading.content.titlemiddle")}</h4>
                  <p>{translations.initDone && intl.get("loading.content.contentmiddle")}</p>
                  <Button>{translations.initDone && intl.get("loading.content.morebtn")}</Button>
                </div>
              </Col>
              <Col xs={24} lg={8}>
                <div
                  className={logoutStyle.section}
                  style={{ background: "#ffedef" }}
                >
                  <img src={require("assets/image/Group3.png")} alt="" />
                  <h4>{translations.initDone && intl.get("loading.content.titleright")}</h4>
                  <p>{translations.initDone && intl.get("loading.content.contentright")}</p>
                  <Button>{translations.initDone && intl.get("loading.content.morebtn")}</Button>
                </div>
              </Col>
            </Col>
          </Row>
          {/* 生活知識 */}
          <Row
            type="flex"
            justify="center"
            gutter={32}
            style={{ margin: "0 0 70px" }}
          >
            <Col xs={24} lg={20}>
              <Col xs={24} lg={6}>
                <div
                  className={logoutStyle.slickdetail}
                  style={{ background: "#3598db" }}
                >
                  <img src={require("./../assets/image/course.png")} alt="" />
                  <h2>{translations.initDone && intl.get("loading.course.title")}</h2>
                  <p>{translations.initDone && intl.get("loading.course.content")}</p>
                </div>
              </Col>
              <Col xs={24} lg={18}>
                <SlickCarousel type={"course"} />
              </Col>
            </Col>
          </Row>
          {/* 探索360 */}
          <Row
            type="flex"
            justify="center"
            gutter={32}
            style={{ margin: "0 0 50px" }}
          >
            <Col xs={24} lg={20}>
              <Col xs={24} lg={6}>
                <div
                  className={logoutStyle.slickdetail}
                  style={{ background: "#31c3b0" }}
                >
                  <img src={require("./../assets/image/course2.png")} alt="" />
                  <h2>{translations.initDone && intl.get("loading.explore.title")}</h2>
                  <p>{translations.initDone && intl.get("loading.explore.content")}</p>
                </div>
              </Col>
              <Col xs={24} lg={18}>
                <SlickCarousel type={"explore"} />
              </Col>
            </Col>
          </Row>
        </Content>
        <Footer>Footer</Footer>
      </div>
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

/** redux 數據更新
 * initLanguageState  初始化 language  bool
 * updateTranslations 更新language 以渲染多语言
 */
function mapDispatchToProps(dispatch) {
  return {
    initRoute: payload => dispatch({ type: "initRoute", payload }),
    updateFileName: payload => dispatch({ type: "updateFileName", payload })
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Landing);
