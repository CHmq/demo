import React, { Component } from "react";
import { Row, Col, Empty, Button , Select , Skeleton , Divider , Spin , Icon , Tag} from "antd";
import intl from "react-intl-universal";
import { connect } from "react-redux";
import { Textfit } from 'react-textfit';

import course from "components/services/courseService";
import ResourceSelectType from "components/common/resource/SelectType";

import styles from "assets/css/SubClass.module.scss";

//新增课程子分类页面
class SubClass extends Component {
    
    $$mount = false;
  state = {
    tagList : [],
    select: [], // 选择的内容
    list : [],
    rsType : null,
    
    limit : 10,
    total : 0,
    loading : null,
    tagLoading : null
  }
  
  componentDidMount = async() => {
      this.$$mount = true;
      
      if(!this.props.tagID) {
          throw "INVALID_TAG_ID_ERROR";
      }
      
      this.setState({ tagLoading : course.subClassTag(this.props.tagID).then(ret => {
            ret.rows.map(item => {
              item.isTrue = false;
              return item;
            });
            return ret.rows;
          }).then(ret => {
              this.setState({tagList : ret , tagLoading : null , select : _select , rsType : this.state.rsType || ["jttw,jttw360,learn"]} ,this.updateList);
          })
      });
      
      let _select = [];// [].concat(...this.props.data.tagData);
      
//      this.props.data.select = _select;
  }
  
  componentWillUnmount = async() => {
      this.$$mount = false;
  }
  
  //建立
  handlEstablish = () => {
    const {select , list , tagList} = this.state;
    if(typeof this.props.callback === "function") {
        this.props.callback({tag : select , tagList , resource : list});
    }
    this.setState({
        select : [],
        list : []
    });
  }
  
  genBackground = (index) => {
      let mapping = [
        "#92d9f8",
        "#ff8ea6",
        "#fff4de",
        "#c7ff72",
        "#bd9cff"
      ];
      return mapping[(index % mapping.length)];
  }
  //選擇
  handleClick = (item) => {
    let _idx = this.state.select.indexOf(item);
    let _select = this.state.select;
    if(_idx > -1) { 
        _select.splice(_idx ,1) 
    } else { 
        _select.push(item) 
    };
//    this.props.data.select = _select;
    this.setState({ select: _select } , this.updateList);
  }
  
  updateList = async(rs_type , i_limit) => {
    if(!!this.$$mount) {
        this.setState({loading : course.search(this.props.tag , this.state.select.map(_select => _select.tag).join(',') , rs_type || this.state.rsType , 0 , i_limit || this.state.limit , true).then(({total , rows}) => {
                this.setState({total , list : rows});
                return rows;
            }).then(ret => {
                this.setState({loading : null});
            })
        });
    }
  }
  //返回
  back = () => {
    if(typeof this.props.prevStep === "function") {
        return this.props.prevStep();
    }
    return;
  }
  render() {
    const { picUrl } = this.props;
    // const { select , list } = this.state;
    const { select , list , tagLoading , tagList , loading , rsType , limit , total} = this.state;
        
    return (
      <Row type='flex' justify='start' style={{ background: "#fff" }}>
          <Col md={18} sm={16} xs={24} className={styles.card_container}>
            {!!tagLoading || (tagList.length > 0) ? (
            <Row type={(!!tagLoading) ? "flex" : null} gutter={20} justify={ (!!tagLoading) ? "center" : "start"} align={(!!tagLoading) ? "middle" : "top"} style={{height: "100%"}}>
            {(!!tagLoading) && (<Spin indicator={<Icon type="loading" style={{ fontSize: 40 }} spin />} tip="Loading..." />)}
            {!tagLoading && (<React.Fragment>
            <Col xs={24}>
                {!(select.length > 0) ? 
                (<h3 className={styles.select}>請選擇：</h3>) : (<h3 className={styles.select}>已選擇：<span>{ select.length == tagList.length ? "全部" : select.map(_select => _select.name).join(' , ')}</span></h3>
                )}
            </Col>
                  {tagList.map((item , idx) => {
                    return (
                      <Col lg={6} md={8} sm={12} xs={12} key={item.id} onClick={() => {this.handleClick(item)}}  style={{margin : "0.5rem auto"}}>
                        <div className={styles.card} style={{outline: (select.indexOf(item) > -1) ? '5px solid #ff4d4f' : '' , height:"150px" , background : picUrl ? `url(${picUrl})` : this.genBackground(idx) , padding : "0.5rem" }} className={ "cursor-pointer" }>
                            <Textfit forceSingleModeWidth={false} mode="single" min={1} max={45} style={{width : "100%" , height: "100%", alignItems: "center", justifyContent: "center"}} className={"d-inline-flex"}>{item.name}</Textfit>
                        </div>
                      </Col>
                    );
                  })}
            </React.Fragment>)}        
            </Row>
            ) : (
                <Empty style={{marginTop: 100}}/>
            )}
          </Col>
        <Col md={6} sm={8} xs={24} style={{ background: "#ebf3ff" }}>
          <div className={styles.list_container}>
            <h3>{!!loading ? "課件名稱：" : `已配對：${list.length}/${total}`}</h3>
            <div style={{height: "32vh",overflowY: "auto"}}>
                <Skeleton paragraph={10} loading={!!loading} active >
                    <ul>
                      {list.map(item => (
                        <li key={item.id}><Tag color="#108ee9">{this.props.translations.initDone && intl.get(`home.publicMsg.resource_type.${item.type}`) || item.type}</Tag>{item.name}</li>
                      ))}
                    </ul>
                </Skeleton>
            </div>
          </div>
          <div className={styles.select_container}>
            <h3>學習活動：</h3>
            <ResourceSelectType default={rsType} callback={(rsType) => {
                this.setState({rsType} , () => {this.updateList(rsType);});
            }}/>
            <h3>預設課件數量：</h3>
             <Select size={"small"} defaultValue={limit} style={{ width: 120 }} onChange={(_num) => {
                 this.setState({limit : _num} , this.updateList);
             }}>
                {[5 , 10 , 15].map(_num => (<Select.Option key={_num} value={_num}>{_num.toString()}</Select.Option>))}
            </Select>
          </div>
          <Divider style={{margin: "0.5rem auto"}}/>
          <div className={styles.button_container}>
            <Button type='primary' onClick={this.back}>返回</Button>
            <Button type='primary' onClick={this.handlEstablish}>建立</Button>
          </div>
        </Col>
      </Row>
    );
  }
}

function mapStateToProps( state , ownProps) {
    const { route, user, translations, merchant } = state;
    return {route, user, translations, merchant};
}

export default connect(
        mapStateToProps,
        null,
        null
        )(SubClass);
