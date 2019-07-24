import React, { Component } from 'react';
// import MyHeader from 'components/common/Header';
// import MyFooter from 'components/common/Footer';
// import Breadcrumbs from "components/common/Breadcrumbs";
import Title from "components/common/Title"
import { Row, Col , Button } from "antd";
import { connect } from "react-redux";
import intl from "react-intl-universal";

// import layoutStyle from "assets/css/layout.module.scss";
import styleCss from "assets/css/CourseFinish.module.scss"; 
import BGIMG from "assets/image/bg.png"

/**   
 * page name:生活知识
 * 
 * */ 
class CourseFinish extends Component {
  state = {
    frishNum:4,
    allNum:40,
    backgroundIMG:BGIMG,// 页面背景图
    itemData:[{
      img:'https://hk.evi.com.hk/assets/images/common/ceo/head/1.png'
    },{
      img:'https://hk.evi.com.hk/assets/images/common/ceo/head/1.png'
    },{
      img:'https://hk.evi.com.hk/assets/images/common/ceo/head/1.png'
    },{
      img:'https://hk.evi.com.hk/assets/images/common/ceo/head/1.png'
    },{
      img:'https://hk.evi.com.hk/assets/images/common/ceo/head/1.png'
    },{
      img:'https://hk.evi.com.hk/assets/images/common/ceo/head/1.png'
    },{
      img:'https://hk.evi.com.hk/assets/images/common/ceo/head/1.png'
    },{
      img:'https://hk.evi.com.hk/assets/images/common/ceo/head/1.png'
    },{
      img:'https://hk.evi.com.hk/assets/images/common/ceo/head/1.png'
    },{
      img:'https://hk.evi.com.hk/assets/images/common/ceo/head/1.png'
    },{
      img:'https://hk.evi.com.hk/assets/images/common/ceo/head/1.png'
    },{
      img:'https://hk.evi.com.hk/assets/images/common/ceo/head/1.png'
    },{
      img:'https://hk.evi.com.hk/assets/images/common/ceo/head/1.png'
    },{
      img:'https://hk.evi.com.hk/assets/images/common/ceo/head/1.png'
    },{
      img:'https://hk.evi.com.hk/assets/images/common/ceo/head/1.png'
    },{
      img:'https://hk.evi.com.hk/assets/images/common/ceo/head/1.png'
    },{
      img:'https://hk.evi.com.hk/assets/images/common/ceo/head/1.png'
    },{
      img:'https://hk.evi.com.hk/assets/images/common/ceo/head/1.png'
    },{
      img:'https://hk.evi.com.hk/assets/images/common/ceo/head/1.png'
    },{
      img:'https://hk.evi.com.hk/assets/images/common/ceo/head/1.png'
    },{
      img:'https://hk.evi.com.hk/assets/images/common/ceo/head/1.png'
    },{
      img:'https://hk.evi.com.hk/assets/images/common/ceo/head/1.png'
    },{
      img:'https://hk.evi.com.hk/assets/images/common/ceo/head/1.png'
    },{
      img:'https://hk.evi.com.hk/assets/images/common/ceo/head/1.png'
    },{
      img:'https://hk.evi.com.hk/assets/images/common/ceo/head/1.png'
    },{
      img:'https://hk.evi.com.hk/assets/images/common/ceo/head/1.png'
    },{
      img:'https://hk.evi.com.hk/assets/images/common/ceo/head/1.png'
    },{
      img:'https://hk.evi.com.hk/assets/images/common/ceo/head/1.png'
    },{
      img:'https://hk.evi.com.hk/assets/images/common/ceo/head/1.png'
    },{
      img:'https://hk.evi.com.hk/assets/images/common/ceo/head/1.png'
    },{
      img:'https://hk.evi.com.hk/assets/images/common/ceo/head/1.png'
    },{
      img:'https://hk.evi.com.hk/assets/images/common/ceo/head/1.png'
    },{
      img:'https://hk.evi.com.hk/assets/images/common/ceo/head/1.png'
    },{
      img:'https://hk.evi.com.hk/assets/images/common/ceo/head/1.png'
    }]
  }

  async componentDidMount()  {
    const { updateFileName } = this.props;
    updateFileName("home");
  }
  
  render() {
    const { translations } = this.props;
    // const { Header, Footer } = Layout;
    const style = {
      background: {
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundColor: "#fff",
        backgroundImage: `url(${this.state.backgroundIMG})`
      },
    }

        // 多语言
        const _fn = function(value) {
          return translations.initDone && intl.get("coursefinish.content."+value)
        }
        const Language = {
          title: _fn("title"),
          Completed:_fn("Completed"),
          backbtn:_fn("backbtn"),
        }
        console.log(Language)
    return (
      <div style={style.background} className={styleCss.CourseFinishWarp}>
        <Row 
          type="flex"
          justify="space-around"
          style={{ paddingTop: 60, }}>
            <Col xs={22} md={20} lg={15}>
              {/* 主体内容 */}
              <Col span={24} style={{display:'flex',flexWrap:'wrap',justifyContent:'center'}}>
                <Col span={24}>
                  <Title title={Language.title} tip={`${Language.Completed}：${this.state.frishNum}/${this.state.allNum}`}></Title>
                </Col>
                <Col span={24} className={styleCss.blackboardHeader}></Col>
                <Col span={22} style={{display:'flex',alignItems:'center',justifyContent: 'center'}}>
                  <Row 
                    type="flex"
                    justify="space-around" 
                    className={styleCss.blackboard}>
                    <Col span={21} className={styleCss.main}>
                    {
                        this.state.itemData.map((item,index)=>{
                          return (
                            <Col xs={11} md={3} key={index} className={styleCss.item}>
                              <img className={styleCss.avatar} src={item.img} alt=""/>
                            </Col>
                          )
                        })
                      }
                    </Col>
                  </Row>
                </Col>
                <Col span={24} className={styleCss.blackboardFooder}></Col>
                <Col span={24} style={{textAlign:'center'}}>
                  <Button type="primary" onClick={()=>{ this.props.history.go(-1)}}>{Language.backbtn}</Button>
                </Col>
              </Col>

            </Col>
        </Row>
      </div>
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
)(CourseFinish);