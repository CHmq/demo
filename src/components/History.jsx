import React, { Component } from "react";
import { Row, Col, Icon, Empty, message, Skeleton } from "antd";
import { connect } from "react-redux";
import intl from "react-intl-universal";
import InfiniteScroll from "react-infinite-scroller";

import Breadcrumbs from "components/common/Breadcrumbs";
import Adapter from "components/common/resource/Adapter";
// import Video from "components/common/Video";
import Memulist from "components/common/Memulist";
import TitleCard from "components/common/TitleCard";
import course from "./services/courseService";

import "assets/css/History.module.scss";
//觀看記錄頁面

class History extends Component {
  state = {
    listData: [],
    loading: true, // 骨架屏狀態
    scrollLoading: false, // 滾動區域狀態
    hasMore: true,
    offset: 0
  }
  async componentDidMount() {
    console.log(this.props);
    const {
      updateFileName,
      match,
      updateRoute,
      $rootURL,
      $language: currentLanuage
    } = this.props;
    updateFileName("home");
    updateRoute({ currentLanuage, realUrl: match.url.replace($rootURL, "")});
    
    await course.history().then(ret => {
      this.setState({
        listData: ret.rows,
        loading: false
      });
      console.log(this.state.listData);
    }).catch(_msg => {
      console.log(_msg);
    })
  }

  skeletonList = () => {
    let dom = [];
    for(let i=0; i<10; i++){
      dom.push(<Col span={18} key={i}><Skeleton active avatar /></Col>)
    }
    return dom;
  }

  handleInfiniteOnLoad = async () => {
    let data = this.state.listData;
    this.setState({
      scrollLoading: true,
    });
    let num = this.state.offset + 10;
    await course.history(num).then(ret => { 
      data = data.concat(ret.rows);
      if (ret.rows.length <= 0 ) {
        message.warning('加載完畢');
        this.setState({
          hasMore: false,
          scrollLoading: false
        });
        return;
      }
      this.setState({
        listData: data,
        offset: num
      });
    })
  }
  render() {
    const { locationUrl, translations } = this.props;
    return (
      <div className='history_container' style={{ backgroundColor: "#fff" }}>
        <Row className='main_container' type='flex' justify='center'>
          <Col xl={14} lg={18} md={20} xs={22}>
            <Breadcrumbs locationUrl={locationUrl} />
          </Col>
          <TitleCard
          title={translations.initDone &&
            intl.get("history.content.title")}
          titleBgColor='#1cb394'
          titleColor='#fff'
          >
            <div className='infinite_container'>
              <InfiniteScroll
              initialLoad={false}
              pageStart={0}
              loadMore={this.handleInfiniteOnLoad}
              hasMore={!this.state.scrollLoading && this.state.hasMore}
              useWindow={false}
              >
                <Row className='list_container' type='flex' justify='center'>
                  {!this.state.loading ? 
                  this.state.listData.map(item => (
                      <Col key={item.id} span={18} className='item_container'>
                        <Adapter res_type={item.res_type} ref_id={item.id} id={item.id}>
                          <Row>
                            <Col style={{border: '2px solid #f2f2f2'}} sm={9} xs={24}>
                              {item.file ? <Memulist picUrl={item.file} /> : <Empty style={{margin: 0}} />}
                            </Col>
                            <Col sm={{span: 13, offset: 2}} xs={24}>
                              <h3>{item.name}</h3>
                              <div>
                                <h4>學習重點</h4>
                                <p>{item.teaching_point}</p>
                              </div>
                            </Col>
                            <div className='close'><Icon type="close" /></div>
                          </Row>
                        </Adapter>
                      </Col>
                  )) : 
                  this.skeletonList()
                  }
                </Row>
              </InfiniteScroll>
            </div>
          </TitleCard>  
        </Row>
      </div>
    );
  }
}

/** redux 獲得全局數據
 * route  route data (url, language)
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
    updateFileName: payload => dispatch({ type: "updateFileName", payload }),
    updateRoute: payload => dispatch({ type: "updateRoute", payload }),
    initUrl: payload => dispatch({ type: "initUrl", payload })
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(History);
