import React, { Component } from "react";
import { Col, Row } from "antd";
import { connect } from "react-redux";
import toast from "components/utils/toast";
// import intl from "react-intl-universal";
import intl from "components/utils/language";

import family_API from "components/services/familyService";
import user_API from "components/services/userService";

import loginBasics from "assets/css/login/basics.module.scss";

export class tipsAddKid extends Component {
  state = {
    viewState: {
      bindAccout: false
    }
  };

  /** 函数防抖
   *  防止用户同一时间执行多次
   */
  viewStateUpdate = () => {
    const {
      state: {
        viewState,
        viewState: { bindAccout }
      }
    } = this;
    this.setState({ viewState: { ...viewState, bindAccout: !bindAccout } });
  };

  /** 跳转到新增账户页面 */
  addAccount = () => {
    const { updateAuth } = this.props;
    updateAuth({ userState: "addKid" });
  };

  /** 绑定子女账号
   * 只有当 kid_token 存在才会执行
   */
  bindAccout = async () => {
    const {
      props: {
        auth: {
          kid_token,
          AddKidMsg: { family_id }
        },
        updateAuth,
        user: { language }
      },
      state: {
        viewState: { bindAccout }
      },
      viewStateUpdate
    } = this;
    if (bindAccout) return;
    viewStateUpdate();
    // updateAuth({ kid_token: null });
    if (!kid_token) {
      viewStateUpdate();
      return updateAuth({ loginCode: 401, userState: "kidAccount" });
    }
    try {
      const user_id = await family_API.addChildren({
        kid_token,
        family_id,
        language
      });
      await user_API.swap({ user_id });
      const { full_name } = await user_API.getUserData();
      toast.createToast({
        type: "success",
        msg: `綁定成功 即將以 ${full_name} 瀏覽`,
        onClose: () => {
          viewStateUpdate();
          window.location = "/";
        }
      });
    } catch (error) {
      console.log(error);
      viewStateUpdate();
    }
  };

  render() {
    const {
      props: {
        translations: { initDone }
      }
    } = this;
    const headerPosition = "home.publicMsg.role.tipsAddKid";
    return (
      <React.Fragment>
        <h2 className={loginBasics.title}>
          {intl.getPlus({ initDone, value: `${headerPosition}.title` })}
        </h2>
        {/* <img src="" alt=""/> */}
        <Row type="flex" justify="space-around" align="middle" style={{minHeight:"400px"}}>
          <Col span={8} style={{textAlign : "center"}}>
            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid*/}
            <h4><a onClick={this.addAccount}>
            {intl.getPlus({
                initDone,
                value: `${headerPosition}.addTrialAccout`
            })}
            </a></h4>
          </Col>
          <Col span={9} style={{textAlign : "center"}}>
            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid*/}
            <h4><a onClick={this.bindAccout}>
            {intl.getPlus({
                initDone,
                value: `${headerPosition}.addExistAccout`
            })}
            </a></h4>
          </Col>
        </Row>
      </React.Fragment>
    );
  }
}

function mapStateToProps({ user, auth, translations }) {
  return { user, auth, translations };
}

function mapDispatchToProps(dispatch) {
  return {
    updateAuth: payload => dispatch({ type: "updateAuth", payload })
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(tipsAddKid);
