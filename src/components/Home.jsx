import React, { Component } from "react";
import Animate from 'rc-animate';
import { Row, Col,  Input,  Icon, Avatar , Spin , Badge } from "antd";
import intl from "react-intl-universal";
import { connect } from "react-redux";
import { Textfit } from "react-textfit";

import ResourceSelectType from "components/common/resource/SelectType";
import Adapter from "components/common/resource/Adapter";

import course from "components/services/courseService";
import staff from "components/services/staffService";

import styles from "assets/css/home.module.scss";

class Home extends Component {
  $$isMount = false;

  constructor(props) {
    super(props);
    this.state = {
      list: [],
      $$loading: false,
      searchResult: [],
      staffPermit: false,
      
      keyword : "",
      itemType : ["jttw,jttw360,learn"]
    };
  }

  async componentDidMount() {
    this.$$isMount = true;
    
    this.props.updateFileName("home");
    
    if(this.props.user.type === "STUDENT") {
        this.getMenu();
    }

    if (!!this.$$isMount) {
        this.setState({
          staffPermit: staff.checkRPermit({
            module: "resource",
            ctrl: "main",
            action: "get_list"
          })
        } , () => {
            if(!!this.state.staffPermit) {
                this.getMenu();
            }
        });
    }
  }

  componentWillUnmount = async () => {
    this.$$isMount = false;
  }
  
  getMenu = () => {
     if(!!this.state.$$loading) {
         return this.state.$$loading;
     }
     this.setState({
         $$loading : course.getMenu(this.props.$language, "").then(ret => {
             return ret.map(_item => { return {..._item, url: "course/" + _item.id }}).sort((a,b) => a.sort - b.sort);
         }).catch(_msg => {
             console.log("NO_MAIN_MENU" , _msg);
             return [];
         }).then(list => {
             if (!!this.$$isMount) {
                 this.setState({ list: list , $$loading : false});
             }
         })
     });
     return this.state.$$loading;
  }
  
  search = (keyword , rsType , offset = 0 , limit = 50) => {
     let $$call = course.search(null , keyword , rsType || this.state.itemType  , offset , limit).then(ret =>  {
        return ret;
    }).catch(err => {
        return [];
    }).then((ret) => {
        if(!!this.$$isMount && $$call === this.state.$$loading) {
            this.setState({
              searchResult : ret,
              $$loading : false
            });
        }
    });
     this.setState({
         $$loading : $$call
     });
     return this.state.$$loading;
  }

  render() {
    const Search = Input.Search;
    const { translations } = this.props;
    
    const displayList = Array.isArray(this.state.searchResult) && this.state.searchResult.length > 0 ? this.state.searchResult :
              Array.isArray(this.state.list) && this.state.list.length > 0 ? this.state.list.map(_mItem => {return {..._mItem , type : "COURSE" }}) :
              [];
    return (
      <React.Fragment>
        {!this.state.staffPermit ? this.props.user.type ==="STUDENT" && (
          <Row className={styles.bgHeight}>
            <Col span={24} className={styles.bgCover} />
          </Row>
        ) : (
          <Row type="flex" justify="center" style={{ margin: "5.75rem auto" }}>
            <Col xs={18} md={12} lg={9} xl={6}>
              <Search
                size="large"
                placeholder={translations.initDone && intl.get("home.publicMsg.search.placeholder") || "搜尋 EVI 資源"}
                onSearch={value => this.search(value)}
                onChange={e => {
                  this.setState({keyword : e.target.value});
                  e.target.value === ""
                    ? this.setState({ searchResult: [] })
                    : void 0;
                }}
                allowClear
                enterButton={!!this.state.$$loading ? <Spin indicator={<Icon type="loading" style={{ fontSize: 24 }} spin />} />  : true}
                disabled={!!this.state.$$loading}
                autoFocus
              />
              <Animate showProp="visible" transitionName="fade">
                {this.state.keyword.length > 0 ? (<ResourceSelectType visible tagMode={true} default={this.state.itemType} callback={ (itemList => { this.setState({itemType : itemList} , () => { this.search(this.state.keyword)}) })} />) : null}
              </Animate>
            </Col>
          </Row>
        )}
        <Row
          gutter={8}
          type="flex"
          justify="center"
          style={{ margin: "0.5rem 0 2.5rem" }}
        >
          <Col xs={24} xxl={15} className={styles.customCol} style={{maxWidth:"1200px"}}>
            <Row gutter={8} type="flex" justify="center">
              {displayList.map(item => {
                return (
                  <Col
                    xs={8}
                    sm={{ span: 8, offset: 0 }}
                    md={{ span: 6, offset: 0 }}
                    xl={{ span: 5, offset: 0 }}
                    style={{ textAlign: "center", padding: "0.8rem" }}
                    key={item.id}
                  >
                    <Adapter
                      item={item}
                      res_type={item.type}
                      ref_id={item.id}
                      id={item.id}
                    >
                      <Avatar src={item.file} className={styles.resource} />
                      <Textfit
                        forceSingleModeWidth={false}
                        mode="single"
                        min={1}
                        max={45}
                        style={{
                          width: "100%",
                          height: "30px",
                          alignItems: "center",
                          justifyContent: "center"
                        }}
                        className={"d-inline-flex"}
                      >
                        {item.type !== "COURSE" ? (<><Badge count={translations.initDone && intl.get(`home.publicMsg.resource_type.${item.type}`) || item.type} /> {item.name} </>) : item.name}
                      </Textfit>
                    </Adapter>
                  </Col>
                );
              })}
            </Row>
          </Col>
        </Row>
      </React.Fragment>
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

export default connect(mapStateToProps)(Home);
