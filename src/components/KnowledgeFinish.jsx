import React, { Component } from 'react';
// import MyHeader from 'components/common/Header';
// import MyFooter from 'components/common/Footer';
import Breadcrumbs from "components/common/Breadcrumbs";
import Title from "components/common/Title"
import ImgCard from "components/common/ImgCard"
import { Row, Col , Button } from "antd";
import { connect } from "react-redux";
import intl from "react-intl-universal";

// import layoutStyle from "assets/css/layout.module.scss";
import styleCss from "assets/css/KnowledgeFinish.module.scss"; 
import BGIMG from "assets/image/bg.png"

/**   
 * page name:生活知识完成
 * 
 * */ 
class KnowledgeFinish extends Component {
  state = {
    frishNum:4, // 已经完成
    allNum:40,// 任务总数
    backgroundIMG:BGIMG,// 页面背景图
    data:[{
      value:3,
      name:'交通',
      img:'https://hk.evi.com.hk/assets/images/common/ceo/head/7.png'
    }
    ,{
      value:5,
      name:'食物',
      img:'https://hk.evi.com.hk/assets/images/common/ceo/head/7.png'
    },{
      value:7,
      name:'家庭',
      img:'https://hk.evi.com.hk/assets/images/common/ceo/head/7.png'
    },{
      value:7,
      name:'認識自己',
      img:'https://hk.evi.com.hk/assets/images/common/ceo/head/7.png'
    },{
      value:7,
      name:'動物',
      img:'https://hk.evi.com.hk/assets/images/common/ceo/head/7.png'
    },{
      value:7,
      name:'環保',
      img:'https://hk.evi.com.hk/assets/images/common/ceo/head/7.png'
    },{
      value:7,
      name:'水',
      img:'https://hk.evi.com.hk/assets/images/common/ceo/head/7.png'
    }
    // ,{
    //   value:7,
    //   name:'種植',
    //   img:'https://hk.evi.com.hk/assets/images/common/ceo/head/7.png'
    // },{
    //   value:7,
    //   name:'學校',
    //   img:'https://hk.evi.com.hk/assets/images/common/ceo/head/7.png'
    // },{
    //   value:7,
    //   name:'季節',
    //   img:'https://hk.evi.com.hk/assets/images/common/ceo/head/7.png'
    // }
  ],
    max:10, // Y轴最大值
    level:[{
      active:true,
      img:'https://hk.evi.com.hk/assets/images/common/ceo/head/7.png'
    },
    {
      active:true,
      img:'https://hk.evi.com.hk/assets/images/common/ceo/head/7.png'
    },
    {
      active:true,
      img:'https://hk.evi.com.hk/assets/images/common/ceo/head/7.png'
    },
    {
      active:true,
      img:'https://hk.evi.com.hk/assets/images/common/ceo/head/7.png'
    },
    {
      active:false,
      img:'https://hk.evi.com.hk/assets/images/common/ceo/head/7.png'
    }]
  }

  async componentDidMount()  {
    const { updateFileName } = this.props;
    updateFileName("home");
  }

  render() {
    const { locationUrl,translations } = this.props;
    // const { Header, Footer } = Layout;
    const style = {
      background: {
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundColor: "#fff",
        backgroundImage: `url(${this.state.backgroundIMG})`
      },
      backgroundItem:{
        backgroundImage: `url(${this.state.backgroundIMG})`
      }
    }
    let arrR = ''
    // max 是传递过来的最大值,item是数据(图表的处理)
    const _itemDom  = function(max,item={}) {
      let arr = [];// 存放每一个Y值
      let Max = max; // Y轴的数值 最大值
      let value = item.value || '';// 对应名称 的Y值
      let  img = item.img || ''// 图片
      for(let i = 1;i<=max;i++) {
        arr.push(i)
      }
      arr.reverse() // 数据倒序排序为了下面的Y轴能正常排序显示
      console.log(arr)
      arrR = arr.map((item,index) =>{
        //   style={{ backgroundImage: (Max-value<=index)?`url(${img})`:''}}
        return <div className={styleCss.item} key={index} >
         {/* 如果没有图片，代表是Y轴的数值显示出来 */}
         {/* Y轴最大值:{Max} 值:{value}  key:{index} */}
         {/* 如果 img 为空则就是Y轴给予显示出遍历（item）1，2，3，4，5，6...的Y值 */}
         {img === ''?item:''} 
         {
           // Max-value<=index 是计算位置给予赋值显示背景图
           Max-value<=index?<img src={img} alt="图片" style={{height:'90%',maxWidth:'100%'}} />:''
         }
        </div>
      }) 
    }

    // 多语言
    const _fn = function(value) {
      return translations.initDone && intl.get("knowledgefinish.content."+value)
    }
    const Language = {
      title: _fn("title"),
      Completed:_fn("Completed"),
      Open:_fn("Open"),
      change:_fn("change"),
      backbtn:_fn("backbtn"),
    }
    return (
      <div style={style.background} className={styleCss.KnowledgeFinishWarp}>
        <Row 
          type="flex"
          justify="space-around"
          >
            <Col xs={22} md={20} lg={15}>
              {/* 面包屑 */}
              <Breadcrumbs locationUrl={locationUrl} />
              {/* 主体内容 */}
              <Col span={24} style={{display:'flex',flexWrap:'wrap',justifyContent:'center'}}>
                <Col span={24} style={{paddingBottom:'10px'}}>
                  <Title title={Language.title} tip={`${Language.Completed}：${this.state.frishNum}/${this.state.allNum}`}>
                    <Col span={24}>
                    {Language.Open}:
                    </Col>
                    <Col span={23} className={styleCss.imgwarp}>
                      {
                        this.state.level.map((item,index)=>{
                          return <div className={styleCss.item} key={index}>
                            <ImgCard bgimg={item.img} width={'50px'} height={'50px'} state={item.active} ></ImgCard>
                          </div>
                        })
                      }
                      <Button className={styleCss.button}>{Language.change}</Button>
                    </Col>
                  </Title>
                </Col>
                <Col span={24} className={styleCss.chartwrap}>
                  {/* Y轴显示 */}
                  <div className={styleCss.itemwarp}>
                    {_itemDom(this.state.max)} 
                    {arrR}
                    <div className={`${styleCss.item} ${styleCss.yname}`}></div>
                  </div>
                  {/* 坐标内容 */}
                  {
                    this.state.data.map((item,index)=>{
                      return (
                        <div className={styleCss.itemwarp} key={index}>
                          {_itemDom(this.state.max,item)}
                          {arrR}
                          <div className={`${styleCss.item} ${styleCss.name}`}>{item.name}</div>
                        </div>
                      )
                    })
                  }
                </Col>
                <Col span={24} style={{textAlign:'center',padding:'10px 0'}}>
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
)(KnowledgeFinish);