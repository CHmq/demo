import React, { Component } from "react";
import { Button, Col, Row, Select, Avatar, Card, Form , Divider , Icon , Tabs , Tag , Dropdown , Menu } from "antd";
import { connect } from "react-redux";
import toast from "components/utils/toast";
import intl from "components/utils/language";

import family_API from "components/services/familyService";
import user_API from "components/services/userService";
import auth_API from "components/services/authService";

import ParentPwd from "components/common/login/role/parentPwd";

import parentEditScss from "assets/css/parentEdit.module.scss";

const headerPosition = "home.publicMsg.role.edit";

/**
 * 家長登錄後進行綁定/新增 view
 *
 * @export
 * @class parentEdit
 * @extends {Component}
 */
export class parentEdit extends Component {
  /**
   * state
   *
   *  familyMsg 家庭信息 Object
   *      familyList  非重複的家庭列表 array
   *      currentFamily 當前選中的家庭 string
   *
   *  viewState 視圖狀態 Object
   *      cardState  當前選定的未綁定子女 number
   *      bindLoading   綁定子女button State bool
   *      parentPwdModel   家長輸入密碼模態框 bool
   *
   *  accountMsg
   *      user_id   當前選定的未綁定子女 id string
   *      role   賬號角色
   *
   * @memberof parentEdit
   */
  state = {
    familyMsg: {
      familyList: [],
      currentFamily: ""
    },
    viewState: {
      cardState: null,
      bindLoding: false,
      parentPwdModel: false
    },
    accountMsg: {
      user_id: "",
      bindState: "",
      role: false
    }
  };

  constructor(props) {
    super(props);
  }

  /**
   * 初始化 familyMsg 信息
   *
   * @memberof parentEdit
   */
  componentDidMount() {
    const { user } = this.props;
    const family_name = Array.from(
      new Set((user.family || []).map(item => item.family_name))
    );
    this.setState({
      familyMsg: { currentFamily: family_name[0], familyList: family_name }
    });
    this.props.updateFileName(["home"]);
  }

  switchState = () => {
    const { bindLoding } = this.state.viewState;
    this.setState({ viewState: { bindLoding: !bindLoding } });
  };

  /** 家庭 Select 切換
   * currentFamily 當前選中的家庭
   */
  familySelectSwitch = currentFamily => {
    const { familyMsg } = this.state;
    this.setState({
      familyMsg: { ...familyMsg, currentFamily, bindLoding: false }
    });
  };

  /** 關閉輸入家長密碼 模態框 */
  parentModalCancel = parentPwdModel => {
    const {
      props: {
        form: { setFields }
      },
      state: { viewState }
    } = this;
    setFields({ pwd: "" });
    this.setState({
      viewState: { ...viewState, parentPwdModel, bindLoding: false }
    });
  };
  
  isCurrentUser = (i_userID = null) => {
      return i_userID.toString() === this.props.user.id.toString();
  }

  /** 創建家長列表 */
  createParent = () => {
      return this.createList("parent");
  };

  /** tips 当前选中 Card */
  CardOnClick = ({ index, user_id, bindState, role = false }) => {
   if(!!this.viewState && !!this.viewState.bindLoding) {
       return;
   }
    const {
      state: { accountMsg }
    } = this;
    if(accountMsg.user_id === user_id && accountMsg.bindState === bindState) {
        return this.bindAddOnClick();
    }
    this.setState({
      viewState: { cardState: index },
      accountMsg: { ...accountMsg, user_id, bindState, role }
    } , () => {
        this.bindAddOnClick();
    });
  };

  /** 跳转到对应页面
   * page: 页面标识
   */
  goPage = ({ page: userState }) => {
    const {
      props: {
        updateAuth,
        user: { family }
      },
      state: {
        familyMsg: { currentFamily }
      }
    } = this;
    const { family_id, permit_user: user_id } = family.find(
      item => item.family_name === currentFamily
    );
    updateAuth({ userState, AddKidMsg: { family_id, user_id } });
  };
  
  canBinding = (i_permitKid = null , i_type = "family" , i_forceMode = false) => {
    const {
      props: {
        auth: { isParent },
      }
    } = this;
    return (i_forceMode || !isParent) && !i_permitKid && i_type !=="parent"
  }
  
  createList = (i_type = "family") => {
    let mType = "";
    switch(i_type.toString().toLowerCase()) {
        case "child" : mType = "child"; break;
        case "parent": mType = "parent"; break;
        default : return;
    }
    const type = mType;
    
    const { Meta } = Card;
    const { Option } = Select;
    const {
      props: {
        auth: { isParent },
        user: { family },
        translations: { initDone },
        updateAuth
      },
      state: {
        familyMsg: { familyList, currentFamily },
        viewState: { cardState }
      },
      CardOnClick,
      goPage
    } = this;
    
    return (<Row
         className={`${parentEditScss.card_AntD} ${parentEditScss.kid_list}`}
         style={{height:400 , overflowY : "auto"}}
       >
         {(family || []).filter(_user =>
              this.isCurrentUser(_user.permit_user) &&
              _user.family_name === currentFamily &&
              this.isCurrentUser(_user.owner)
          ).length > 0 && (<Col xs={24}>
                <Card bordered={false} className={`${parentEditScss.card}`} style={{cursor : "pointer"}} onClick={() => goPage({ page: (type==="parent" ? "addParent" : "tips") })}>
                 <Card.Meta
                  avatar={ <Avatar size={32} icon="user-add" /> }
                  title={(<h4 style={{ margin: "4px 0" }}> {intl.getPlus({initDone, value: `${headerPosition}.${type==="parent" ? "addFamilyKid" : "addKid"}` }) || type.toString().toUpperCase()} </h4>)}
                  style={{ marginBottom: 0 }}
                />
              </Card>
            </Col>)}
         {(family || []).sort((a , b) => {
             if(!isParent) {
                 return a.permit_kid === b.permit_kid ? 0 : (!!a.permit_kid ? 1 : -1);
             }
             return a.create_time == b.create_time ? 0 : (a.create_time > b.create_time) ? 1 : -1
         }).map((account, index) => {
           return (
             currentFamily === account.family_name && ((type==="parent" && account.relation_id !== "7") || (type==="child" && account.relation_id === "7")) && (
               <Col xs={24} sm={12} key={index}>
                 <Card
                   bordered={false}
                   hoverable={true}
                   className={`${parentEditScss.card} ${index === cardState && parentEditScss.card_click} ${parentEditScss['sex-' + account.permit_user_sex]} ${this.isCurrentUser(account.permit_user) && parentEditScss.current} `}
                   actions={[
                       ...(!this.isCurrentUser(account.permit_user) 
                     && (this.canBinding(account.permit_kid , type) || !!isParent) ? [<a onClick={() =>
                     !this.isCurrentUser(account.permit_user)
                     && (this.canBinding(account.permit_kid , type) || !!isParent)
                     && CardOnClick({
                       index,
                       user_id: account.permit_user,
                       bindState: account.permit_kid,
                       role: type==="parent" //account.permit_user === account.owner
                     })
                     }><Icon type={this.canBinding(account.permit_kid , type) ? "usergroup-add" : "login"} /> {`${this.canBinding(account.permit_kid , type) ? "綁定" : "開始"}`}</a>]
                    : (!!isParent ? 
                        ([<a className={"cursor-not-allowed"}><Icon type="edit" /> 個人資料</a>]) : 
                        [<a className={"cursor-not-allowed"} style={{backgroundColor : "#f5222d"}}><Icon type="lock" /> 已綁定</a>])) , 
                    ...( this.isCurrentUser(account.owner) && !!isParent ? [<Dropdown overlay={(<Menu>
                                {this.canBinding(account.permit_kid , type , true) && (<Menu.Item><a rel="noopener noreferrer" onClick={()=> updateAuth({userState:"kidAccount"})}>綁定</a></Menu.Item>)}
                                <Menu.Item><a rel="noopener noreferrer">修改</a></Menu.Item>
                                <Menu.Item><a rel="noopener noreferrer">權限控制</a></Menu.Item>
                                </Menu>)} placement="topCenter"><a ><Icon type="setting" /> 設定</a></Dropdown>] : [])]}
                 >
                 <Meta
                     avatar={(<Avatar size={84} src={account.permit_img} icon="user" style={{ border: `3px solid ${account.permit_user_sex === "F" ? "#ff6363" : "cornflowerblue"}` }} />)}
                     title={(<React.Fragment>
                        {account.permit_user === account.owner && (<Tag color="gold" style={{ marginRight : "0.3rem"}}>{`${intl.getPlus({initDone,value: `${headerPosition}.parent.role`})}`}</Tag>)}
                        {type==="parent" && (<Tag color={account.permit_user_sex === "F" ? "red" : "blue"} >{intl.getPlus({initDone,value: `${headerPosition}.parent.${account.relation_id === "1" ? "father" : "mother"}`})}</Tag>)}
                        {type==="child" && (<Tag color={account.permit_kid ? (account.permit_user_sex ==="F" ? "magenta" : "cyan") : "#f50"} >{intl.getPlus({ initDone, value: `${headerPosition}.kid.role.${account.permit_kid? "isBinding" : "unbound"}` })}</Tag>)}
                     </React.Fragment>)}
                     description={(<React.Fragment>
                            <p style={{ ...{ marginBottom: 0 , color:"black"} }}>{account.permit_user_name}</p>
                            {this.isCurrentUser(account.permit_user) && (<p style={{color : "grey"}}>
                                <span style={{marginRight : "0.1rem"}}>{intl.getPlus({initDone,value: "user.currentUser"}) || "當前帳戶"}</span>
                                <Icon type="check-circle" theme="twoTone" twoToneColor="#52c41a" />
                            </p>)}
                        </React.Fragment>)}
                   />
                 </Card>
              </Col>)
              );         
        })}
       </Row>);
  }

  /** 創建子女列表 */
  createFamilyList = () => {
    return this.createList('child');
  };

  /** 綁定子女 erros 處理
   * params
   *    code errors result碼
   */
  bindAddErrors = code => {
    const {
      state: {
        viewState: { bindLoding }
      }
    } = this;
    const errors = new Map().set(203, () =>
      toast.createToast({
        type: "error",
        msg: "該賬號已經綁定了kid賬戶!",
        onClose: () => this.setState({ viewState: { bindLoding: !bindLoding } })
      })
    );
    return errors.get(code)
      ? errors.get(code)()
      : toast.createToast({
          type: "error",
          msg: "發生了未知的錯誤,請您稍後再試!",
          onClose: () =>
            this.setState({ viewState: { bindLoding: !bindLoding } })
        });
  };

  /** 绑定子女 */
  bindAddOnClick = async () => {
    const {
      props: {
        auth: { kid_token, isParent },
        user: { id }
      },
      state: {
        viewState,
        viewState: { bindLoding },
        accountMsg: { user_id, bindState, role }
      },
      bindAddErrors
    } = this;
    this.setState({ viewState: { ...viewState, bindLoding: !bindLoding } });
    if (!user_id)
      return toast.createToast({
        msg: "目前沒有選中賬號,請重試",
        onClose: () =>
          this.setState({
            viewState: { ...viewState, bindLoding }
          })
      });
    try {
      if (user_id === id) {
        return toast.createToast({
          msg: "已經是當前賬號了!",
          onClose: () =>
            this.setState({
              viewState: { ...viewState, bindLoding }
            })
        });
      }

      if (role) {
        return this.setState({
          viewState: { ...viewState, parentPwdModel: true, bindLoding: true }
        });
      }

      console.log(!isParent && !bindState);
      if (!isParent && !bindState) {
        await family_API.bindChlidren({ kid_token, user_id });
      }

      await user_API.swap({ user_id });
      toast.createToast({
        type: "success",
        msg: `${isParent || bindState ? "切換" : "綁定"}成功!即將跳轉到首頁`,
        onClose: () => {
          this.setState({ viewState: { ...viewState, bindLoding } });
          window.location.reload();
        }
      });
    } catch (error) {
      console.log(error);
      bindAddErrors(error.result);
    }
  };

  render() {
    const {
      createParent,
      createFamilyList,
      bindAddOnClick,
      goPage,
      parentModalCancel,
      state: {
        viewState: { bindLoding, parentPwdModel ,cardState },
        accountMsg: { user_id },
        familyMsg: { familyList, currentFamily },
      },
      props: {
        user: { family },
        translations: { initDone }
      }
    } = this;
    
    const { Option } = Select;
    return (
      <React.Fragment>
        <h2
          style={{
            textAlign: "center",
            backgroundColor: "#0050B3",
            color: "#fff",
            padding: "10px 0"
          }}
        >
          {intl.getPlus({
            initDone,
            value: `${headerPosition}.title`
          })}
        </h2>
        
        <div
          style={{
            textAlign: "center",
            padding: 10,
            marginBottom: 0
          }}
        >
          <h2>{!!this.state.showList ? 
          (<Select
            value={currentFamily}
            style={{ minWidth: 175 }}
            onChange={(ret) => { this.familySelectSwitch(ret); this.setState({showList : false});} }
          >
            {familyList.map(item => (
              <Option value={item} key={item}>
                {item}
              </Option>
            ))}
            </Select>) : (<React.Fragment><Icon type="home" /> {familyList[0]}{familyList.length > 1 && (<a onClick={() => { this.setState({showList : true})}} ><Icon type="edit" /></a>)} </React.Fragment>)}
            </h2>
        </div>
        <Tabs className={`${parentEditScss.parentEditList}`} defaultActiveKey="Parent" style={{marginBottom:"2rem"}} size={"large"}>
            <Tabs.TabPane
              tab={(<span style={{ textAlign: "center" }}>{intl.getPlus({initDone,value: `${headerPosition}.parent.parentTitle`})}</span>)}
              key="PARENT"
            >
                {createParent()}
            </Tabs.TabPane>
            <Tabs.TabPane
              tab={(<span style={{ textAlign: "center" }}>{intl.getPlus({ initDone, value: `${headerPosition}.kid.kidTitle` })}</span>)}
              key="STUDENT"
            >
                {createFamilyList()}
            </Tabs.TabPane>
        </Tabs>
        <Row type="flex" style={{ padding: "0 50px" }} justify="center">
          <Col>
            <Button
              style={{ backgroundColor: "#0050b3", color: "#fff" }}
              onClick={() => { auth_API.logout().then((ret) => {
                      window.location = this.props.route.locationUrl;
              })}}
              loading={bindLoding}
            >
              {intl.getPlus({
                initDone,
                value: `logout`
              }) || "Logout"}
            </Button>
          </Col>
        </Row>
        {parentPwdModel && (
          <ParentPwd parentModalCancel={parentModalCancel} user_id={user_id} />
        )}
      </React.Fragment>
    );
  }
}

/** redux 數據獲取
 * user 用戶信息
 * auth 登錄信息
 */
function mapStateToProps({ route , user, auth, translations }) {
  return { route ,user, auth, translations };
}

/**
 * redux 更新數據
 * updateAuth 更新 modal_view
 */
function mapDispatchToProps(dispatch) {
  return {
    updateAuth: payload => dispatch({ type: "updateAuth", payload }),
    updateFileName: payload => dispatch({ type: "updateFileName", payload })
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Form.create()(parentEdit));
