import React, { Component } from "react";
import { Row, Col, Input, Select, Button, Empty , Icon , Spin } from "antd";
import InfiniteScroll from "react-infinite-scroller";
import { connect } from "react-redux";
import intl from "react-intl-universal";

import ManagePopup from "components/common/ManagePopup";
import style from "assets/css/PopupCoursware.module.scss";
import SchoolResource from "components/PopupAECoursware";
import Memulist from "components/common/Memulist";
import MemulistWarp from "components/common/Memulistwarp";
import ResourceSelectType from "components/common/resource/SelectType";

// import mainService from "components/services/mainService";
import courseService from "components/services/courseService";

const Search = Input.Search;
const Option = Select.Option;

class PopupCoursware extends Component {
    
  constructor(props) {
    super(props);
    this.state = {
        
      loading : null,
      
      tagList : [], // 选择器
      tag: "", // 选择器第一个name
      width: 930,
      
      showData: {
        title: "",
        src: null,
        word: ""
      }, // 顯示點擊(单选) 显示详细单个点击itemData，默认选itemData 的第一个数据
      
      itemData: [],// 数据
      activeIndex: "", // 点击的index
      
      itemList : ["jttw,jttw360,learn"],
      keyword : "",
      offset: 0,
      total : 0,
      limit : 16,
      result:  (this.props.selected || []).sort(this.advSort)
    };
  }
  componentDidMount() {
//    this.getOption(); // 下拉获取
    this.props.onRef(this); // 被父类调用
    this.setState({result : (this.props.selected || []).sort(this.advSort) });
  }
  
  hasMore = () => {
      return ((this.state.offset * this.state.limit) + this.state.limit) < this.state.total;
  }
  
  reset = (offset = true , result = true , itemList = false) => {
    !!itemList ? this.setState({itemList : ["jttw,jttw360,learn"]}) : void(0);
    !!result ? this.setState({itemData : []}) : void(0);
    !!offset ? this.setState({offset : 0 , total : 0 , limit : 16}) : void(0);
  }
  
  advSort = (a,b) => (a.active===b.active ? (a.sort || a._score) -  (b.sort || b._score) : (!!a.active ? -1 : 1) );
  
  //滑动加载
  handleInfiniteOnLoad = async () => {
      if(!!this.state.loading) {
          return this.state.loading;
      }
      
      this.setState({offset : this.state.offset + 1});
      let itemList = this.state.itemData;
      let $$call = this.getList(this.state.offset , this.state.limit , false).then(_ret => {
          if(this.state.loading !== $$call) throw "NOT_LAST_CALL";
          let list = [...itemList , ..._ret].sort(this.advSort);
          this.setState({itemData : list , loading : null});
      }).catch(_err => console.log(_err));
      return $$call;
  }
  // 获取列表数据  备注：header（父组件） 组件获取调用
  getList = async (offset = 0 , limit = 16 , autoSet = true) => {
      let itemList = (this.state.itemList.map(_item => {
          return _item.split(",");
      }));
      let $$call = courseService.search(null , this.state.keyword , [].concat(...itemList) , (!!autoSet ? 0 : offset) , ( !!autoSet ? 20 : limit ) , true).then(_ret => {
          if(this.state.loading !== $$call) throw "NOT_LAST_CALL";
          this.setState({total : _ret.total});
          return _ret.rows;
      }).then(_ret => {
//          _ret = _ret.
          _ret = [...this.state.result.map(_res => {
                  _res.active = true;
                  return _res;
              }) , ..._ret.map(_res => {
              return this.hasSelected(_res , false) ? null : _res;
          }).filter(_res => !!_res)].sort(this.advSort);
          if(!!autoSet) {
            this.setState({
                itemData : _ret,
                showData: {
                    title: _ret.length>0?_ret[0].name:'',
                    src:  _ret.length>0?_ret[0].file:'',
                    word:  _ret.length>0?_ret[0].teaching_point:''
                }
            });
          }
        return _ret;
      }).catch(_err => {
        console.log(_err);
        return [];
      }).then(_ret => {
        if(!!autoSet) {
            this.setState({loading : null});
        }
        return _ret;
      })
      
      this.setState({ loading : $$call});
      return $$call;
  };
  
  // 下拉选择
  handleChange(value) {
    this.setState({
      tag: value
    });
    console.log(`selected ${value}`);
  }
  // 复选择框
  onChange(itemList) {
      this.setState({itemList} , this.getList);
  }
  
  // 點擊獲取當前的值
  selectResource(res, key) {
    let _result = this.state.result;
    let _idx = this.hasSelected(res) , active = (_idx > -1);
    
    if(!active) {
        this.setState({
          showData: {
            title: res.name,
            src: res.file,
            word: res.teaching_point
          },
          activeIndex: key
        });  
    }
    !active ? _result.push(res) : _result.splice(_idx , 1);
    this.setState({ result : (_result) });
  }
  
  hasSelected = (res , isRetKey = true) => {
      let ret = (this.state.result.filter(_select => 
                _select.id.toString() === res.id.toString() ) || []);
      return !!isRetKey ? this.props.selected.indexOf((ret.length > 0 ? ret[0] : [])) : ret.length > 0;
  }
  
  // 搜索
  getSearch = (keyword) => {
//      if(!!keyword) {
//          this.setState({keyword},this.getList);
//      } else {
           console.warn("getSearch is deprecated");
           this.getList();
//      }   
  }
  
  // 获取子组件方法
  onOpend = ref => {
    this.child = ref;
  };

  handleClickEstablish = () => {
    this.props.compile(this.state.result);
  }
  
  render() {
    const {translations} = this.props;
    // 多语言
    const _fn = function(value) {
      return translations.initDone && intl.get('course_1.content.PopupCoursware.'+value)
    }
    const Language = {
      title:_fn("title"),
      changeItem:_fn("changeItem"),
      Teachingfocus:_fn("Teachingfocus"),
      btnnew:_fn("btnnew"),
      btnbuild:_fn("btnbuild"),
      edit:_fn("edit")
    }
    return (
      <ManagePopup
        title={Language.title}
        width={this.state.width}
        visible={this.props.visible}
        onCancel={this.props.onCancel}
      >
        <React.Fragment>
          <Row type="flex" justify="center" className={style.main}>
            <Col span={24}>
              {/* left */}
              <Col span={18} className={style.leftmain}>
                <Row type="flex" gutter={4}>
                  <Col span={21}>
                    <Col span={24} style={{marginBottom: 5}}>
                      <Search
                        defaultValue={this.state.keyword}
                        placeholder="搜尋 EVI 資源"
                        onSearch={(_keyword) => {
                            this.setState({keyword : _keyword},this.getList);
                        }}
                        allowClear
                        enterButton={!!this.state.loading ? <Spin indicator={<Icon type="loading" style={{ fontSize: 24 }} spin />} />  : true}
                        disabled={!!this.state.loading}
                        autoFocus
                      />
                    </Col>
                    <Col span={24}>
                      <ResourceSelectType
                        default={this.state.itemList}
                        callback={this.onChange.bind(this)}
                      />
                    </Col>
                  </Col>
                  {/* 弹框（添加or编辑）*/}
                  <Col span={3}>
                    <SchoolResource
                      onOpend={this.onOpend}
                      addCallback={(ret) => {
                          console.log(ret);
                          this.getSearch();
                      }}
                      updateCallback={(ret) => {
                          console.log(ret);
                          this.getSearch();
                      }}
                    />
                  </Col>
                  {/* 内容 */}
                  <Col span={24}>
                    <p>
                      <span>{Language.changeItem} : </span>
                      <span style={{ color: "#2b4b80", fontSize: 12 }}>
                        {this.props.selected.map(_select => _select.name).join(' , ')}
                      </span>
                    </p>
                    <div className={style.scroll_container}>
                      <InfiniteScroll
                      initialLoad={false}
                      pageStart={0}
                      loader={<div className="loader" key={0}>Loading ...</div>}
                      loadMore={this.handleInfiniteOnLoad}
                      hasMore={this.hasMore()}
                      useWindow={false}
                      >
                        <Row gutter={10}>
                          {this.state.itemData.map((item, key) => {
                            return (
                              <Col span={6} key={item.ref_id.toString()}>
                                <div
                                  className={`${style.item} ${this.hasSelected(item , false)?`${style.active}`:""}`}
                                  onClick={this.selectResource.bind(this, item, key)}
                                >
                                  <MemulistWarp
                                    open={() => this.child.onOpend(item,Language.edit)}
                                    item={item}
                                    name={item.type}
                                  >
                                    <Memulist
                                      picUrl={item.file}
                                      title={item.name}
                                      titleFontSize="12px"
                                      titleBgcolor={"rgba(0, 0, 0, 0.5)"}
                                    />
                                  </MemulistWarp>
                                </div>
                              </Col>
                            )})}
                        </Row>
                      </InfiniteScroll>
                    </div>
                  </Col>
                </Row>
              </Col>
              {/* rigth */}
              <Col span={6} className={style.rigthmain}>
                {this.state.itemData.length > 0 ? (
                  <div>
                    <h3 className={`${style.titleCB} ${style.fontW}`}>
                      {this.state.showData.title}
                    </h3>
                    <Memulist picUrl={this.state.showData.src} />
                    <h4 className={`${style.titleCB} ${style.fontW}`}>
                      {Language.Teachingfocus}:
                    </h4>
                    <p className={style.titleCB}>{this.state.showData.word}</p>
                    <Col span={24} className={style.btnwarp}>
                      <Button onClick={this.handleClickEstablish}>{Language.btnbuild}</Button>
                    </Col>
                  </div>
                ) : (
                  <Empty />
                )}
              </Col>
            </Col>
          </Row>
        </React.Fragment>
      </ManagePopup>
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

export default connect(mapStateToProps)(PopupCoursware);