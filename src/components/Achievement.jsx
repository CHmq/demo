import React, { Component } from "react";
import { Row, Col , Button, Icon, Modal } from "antd";
// import { Client } from "aliyun-gateway-api";

import { Link } from "react-router-dom";
// import { Card } from "antd";
import { connect } from "react-redux";
import intl from "react-intl-universal";

import Achieve from "./Achieve";
// import Breadcrumbs from "components/common/Breadcrumbs";
import DraggerImgUploading from "components/common/UploadingAvatar";
import Achievecard from "components/common/Achievecard";
// import Accompany from "components/chart/Accompany"; 
import Iqchart from "components/chart/Iqchart";
import Logintime from "components/chart/logintime";
import Popup from "components/common/Popup";

import PopupAchieve from "./PopupAchieve";
import Love from "components/common/LoveNum"
// import config from "./services/config";

import card from "assets/css/achievecard.module.scss";
import "assets/css/Achievement.module.scss";

import img1 from "assets/image/achievement_01.png";
import img2 from "assets/image/achievement_02.png";
import img3 from "assets/image/achievement_03.png";
import achieveTitle from "assets/image/achieve.png";

import icon1 from "assets/image/achieve2_1.png";
import icon2 from "assets/image/achieve2_2.png";
import icon3 from "assets/image/achieve2_3.png";
import icon4 from "assets/image/achieve2_4.png";
import icon5 from "assets/image/achieve2_5.png";
import icon6 from "assets/image/achieve2_6.png";
import Logo from "assets/image/logo_s.png"

const list = {
  text:
    "每月推出[腦力大挑戰]問題，題目圍繞六大學習範疇，考驗小朋友在各大範疇上的能力，鼓勵小朋友發揮腦力、創意等各項潛能，建立自信心。",
  list: [
    { iconUrl: icon1, content: "體能與健康" },
    { iconUrl: icon2, content: "語文" },
    { iconUrl: icon3, content: "幼兒教學" },
    { iconUrl: icon6, content: "大自然與生活" },
    { iconUrl: icon5, content: "個人與群體" },
    { iconUrl: icon4, content: "藝術與創意" }
  ]
};

/**
 * 成就页面
 *
 * @export 成就页面
 * @class Achievement
 * @extends {Component}
 */

class Achievement extends Component {
  state = {
    bindFamily: false,
    visible: false,
    list: [
      { id: 1, title: "生活知識", picUrl: img1, finished: 80, sum: 100,url:'knowledgefinish' },
      { id: 2, title: "品德教育", picUrl: img2, finished: 17, sum: 50,url:'achievements' },
      { id: 3, title: "校本課程", picUrl: img3, finished: 5, sum: 20,url:'coursefinish' },
      { id: 4, title: "生活知識", picUrl: img1, finished: 80, sum: 100,url:'knowledgefinish' },
      { id: 5, title: "品德教育", picUrl: img2, finished: 17, sum: 50,url:'achievements' },
      { id: 6, title: "校本課程", picUrl: img3, finished: 5, sum: 20,url:'coursefinish' },
      { id: 7, title: "生活知識", picUrl: img1, finished: 80, sum: 100,url:'knowledgefinish' },
      { id: 8, title: "品德教育", picUrl: img2, finished: 17, sum: 50,url:'achievements' },
      { id: 9, title: "校本課程", picUrl: img3, finished: 5, sum: 20,url:'coursefinish' },
      { id: 10, title: "生活知識", picUrl: img1, finished: 80, sum: 100,url:'knowledgefinish' }
    ],
    loveData:2,
  };

  async componentDidMount()  {
    const { updateFileName } = this.props;
    updateFileName("home");
  }

  showModal = () => {
    this.setState({
      visible: true
    });
  };

  onCancel = () => {
    this.setState({
      visible: false
    });
  };

  setBindFamily = bindFamily => {
    this.setState({ bindFamily });
  };

  createModal = (title='') => {
    return (
      <Modal
        title={title}
        centered
        bodyStyle={{ backgroundColor: "#fff" }}
        visible={this.state.bindFamily}
        onCancel={() => this.setBindFamily(false)}
        footer={null}
        maskClosable={false}
      >
        <DraggerImgUploading />
      </Modal>
    );
  };

  ShowUploading = () => {
    this.setBindFamily(true);
  };


  render() {
    // const { Header, Footer } = Layout;
    const { locationUrl,translations } = this.props;
    const { img: userAvatar, full_name } = this.props.user;
    // const text = "世衛建議2-5嵗幼兒每日看屏幕時間不應超過一個小時";
    // 多语言
    const _fn = function(value) {
      return translations.initDone && intl.get("achievements.content."+value)
    }
    const Language = {
      titleImg: _fn("titleImg"),
      titlerelationship:_fn("titlerelationship"),
      titleTime:_fn("titleTime"),
      min:_fn("min"),
      titleAbility:_fn("titleAbility"),
    }
    console.log(Language)
    return (
          <Row type="flex" justify="space-around" style={{ paddingTop: 20 }}>
            <Col xs={22} md={20} lg={16}>
              {/* <Breadcrumbs locationUrl={locationUrl} /> */}
              <Row gutter={18}>
                {/* 個人信息 */}
                <Col xs={24} sm={12} xl={6}>
                  <Achievecard
                    bigname={full_name}
                    address="EVI幼兒園"
                    width="100%"
                    className="usercard"
                  >
                    <div className={card.user}>
                      <div className={card.usermain}>
                        <div className={card.userimg}>
                          <img
                            src={
                              userAvatar || img2
                            }
                            alt=""
                            className={card.img}
                            onClick={this.ShowUploading}
                          />
                          <div className={card.Identity}>
                            <div className={card.Circle}>
                              <img src={Logo} alt=""/>
                            </div>
                            <div className={`${card.Circle} ${card.word}`}>
                              EVI
                            </div>
                          </div>
                        </div>
                      </div>
                      {/* <img
                        src={
                          userAvatar || require("assets/image/achieve1.png")
                        }
                        alt=""
                        className={card.img}
                        onClick={this.ShowUploading}
                      /> */}

                      {this.createModal(Language.titleImg)}
                    </div>
                  </Achievecard>
                </Col>
                {/* 親子關係 */}
                <Col xs={24} sm={12} xl={6}>
                  {/* <Achievecard
                    title="父母陪同觀看次數（本周）"
                    number="9"
                    width="100%"
                    relation="良好"
                    className="numbercard"
                  >
                    <div className={card.number}>
                      <Accompany style={{ backgroundColor: "#ccc" }} />
                    </div>
                  </Achievecard> */}
                  <Achievecard
                    width="100%"
                    className="numbercard"
                  >
                    <div className={card.number}>
                      <Row>
                        <Col span={22}>
                         <h1 style={{margin:0,color:'#f3fbfa'}}>{Language.titlerelationship}</h1>
                        </Col>
                        <Col span={2}>
                          <Button
                            className={card.TooltipBtn}
                          >
                            <Icon type="question" />
                          </Button>
                        </Col>
                        <Col span={24} style={{display:'flex'}}>
                           {Love(3,1)}
                        </Col>
                      </Row>
                      {/* <Accompany style={{ backgroundColor: "#ccc" }} /> */}
                    </div>
                  </Achievecard>
                </Col>
                {/* 今日登入时间 */}
                <Col xs={24} sm={12} xl={6}>
                  <Achievecard
                    // title="今日登入時間"
                    // time="15"
                    // allTime="80"
                    width="100%"
                    className="timecard"
                  >
                    <div className={card.time}>
                      {/* <Tooltip
                        placement="bottomRight"
                        trigger="click"
                        title={text}
                        overlayClassName="tooltip"
                      >
                        <Button className={card.TooltipBtn}>
                          <Icon type="question" />
                        </Button>
                      </Tooltip> */}
                      <h1 style={{margin:0,color:'#f3fbfa'}}>{Language.titleTime}</h1>
                      <h2 style={{color:'#f3fbfa'}}><span>52</span> {Language.min}</h2>
                      <div style={{paddingTop:'10px'}}>
                        <Logintime></Logintime>
                      </div>
                    </div>
                  </Achievecard>
                  {/* <Card
                    width="100%"
                    className="timecard"
                    style={{backgroundColor:'#7fd6c5'}}
                  >
                    <div >
                      <h1 style={{margin:0,color:'#f3fbfa'}}>今日使用時間</h1>
                      <h2 style={{color:'#f3fbfa'}}><span>52</span> 分鐘</h2>
                      <div style={{paddingTop:'10px'}}>
                        <Logintime></Logintime>
                      </div>
                    </div>
                  </Card> */}
                </Col>
                {/* 雷達圖 */}
                <Col xs={24} sm={12} xl={6}>
                  {/* <Card
                    hoverable
                    width="100%"
                    className="card_container"
                  >
                    <div className={card.ability}>
                      <Iqchart style={{ backgroundColor: "#ccc" }} />
                      <Button
                        onClick={this.showModal}
                        className={card.TooltipBtn}
                      >
                        <Icon type="question" />
                      </Button>
                    </div>
                    <Popup
                      width={580}
                      onCancel={this.onCancel}
                      visible={this.state.visible}
                    >
                      <PopupAchieve data={list} />
                    </Popup>
                  </Card> */}
                  <Achievecard
                    title={Language.titleAbility}
                    width="100%"
                    // relation="良好"
                    // className="numbercard"
                  >
                    <div className={card.ability}>
                      <Iqchart style={{ backgroundColor: "#ccc" }} />
                      <Button
                        onClick={this.showModal}
                        className={card.TooltipBtn}
                      >
                        <Icon type="question" />
                      </Button>
                    </div>
                    <Popup
                      width={580}
                      onCancel={this.onCancel}
                      visible={this.state.visible}
                    >
                      <PopupAchieve data={list} />
                    </Popup>
                  </Achievecard>
                </Col>
              </Row>
            </Col>
            <Col className="achieve" xs={22} md={20} lg={16}>
              <img className="title" src={achieveTitle} alt="title" />
              <Row gutter={20}>
                {this.state.list.map(item => (
                  <Col lg={6} md={8} sm={12} xs={12} key={item.id}>
                    <Link
                      to={{
                        pathname: `${locationUrl}${item.url}`,
                      }}
                    >
                      <Achieve styles={"achievePage"} data={item} />
                    </Link>
                  </Col>
                ))}
              </Row>
            </Col>
          </Row>
    );
  }
}

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
    updateFileName: payload => dispatch({ type: "updateFileName", payload }),
    };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Achievement);
