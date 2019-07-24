import React, { Component } from 'react';
import { connect } from "react-redux";
import { Link } from "react-router-dom";

import Popup from "components/common/Popup";
import PopupSelection from "components/PopupSelection";
import PopupSpecial from "components/PopupSpecial";

import { toast } from "react-toastify";

import user from "components/services/userService";
import NewPage from "components/services/user_commentService";
import main from "components/services/mainService";

class Adapter extends Component {
  state = {
    visible: false,
    fileList: [], // 上传文件列表
    list: [], // 储存其他类型返回数据
    verifylist: [], // 储存验证上传数据
    id:"",// 更新图片id
  };
  
  componentDidMount = () => {
  }

  showModal = (type, refId, id) => {
    this.setState({ id });
    if (type === "mc" || type === "project") {
      if (type === "project") {
        this.verifyUpload(type, refId, id);
      } else {
        this.setState({
          visible: true,
          type,
          refId
        });
      }
    } else {
      this.OpanNew(refId);
      this.setState({
        visible: false
      });
    }
  };
  //关闭对话框
  onCancel = () => {
    this.setState({
      visible: false
    });
  };

  //对话框类型判断
  _alter = () => {
    let {type,refId,id,title,arr,fileList} = this.state
    const {urlId , item} = this.props;
    const data = { id, title, refId, arr, fileList };
    switch (type) {
      case "mc":
        return (
          <PopupSelection
            visible={this.state.visible}
            onCancel={this.onCancel}
            id={id}
          />
        );
      case "project":
        return (
          <PopupSpecial
            ref="popup"
            onCancel={this.onCancel}
            data={data}
            urlId={item.course_id}
            id={this.state.id}
          />
        );
      default:
        return;
    }
  };
  //验证是否上传过api;
  async verifyUpload(type, refId, id) {
    // console.log("ref:" + value);
    this.setState({
      verifylist: await NewPage.VerifyUplaod(refId)
        .then(ret => {
          // console.log("verifylist成功");
          this.setState({
            id:ret.id
          })
          return ret;
        })
        .catch(_msg => {
          //SHOW MESSAGE
          console.log(_msg);
          return [];
        })
    });
    // console.log(id);
    // const { data } = await NewPage.VerifyUplaod(value);
    if (this.state.verifylist) {
      this.setState({
        data: await main
          .getFullInfo(refId)
          .then(ret => {
            console.log(ret);
            console.log("McData成功");
            return ret;
          })
          .catch(_msg => {
            //SHOW MESSAGE
            console.log(_msg);
            return [];
          })
      });
      //获取标题api;
      const { name } = this.state.data;
      const { file } = this.state.verifylist;
      // console.log(this.state.verifylist);
      if (file) {
        this.setState({
          fileList: [
            {
              uid: this.state.verifylist.id,
              status: "done",
              url: file
            }
          ],
          title: name
        });
      }
    }

    this.setState({
      visible: true,
      type,
      refId
    });
  }

  //其他类型跳转api
  async OpanNew(res_id) {
    let msg = "";
    this.setState({
      list: await user.goResource(res_id)
        .then(ret => {
          return ret;
        })
        .catch(_err => {
          //SHOW MESSAGE
          console.log(_err + "数据请求加載失敗");
          msg = _err.msg;
          return {};
        })
    });
    
    if(Object.keys(this.state.list).length > 0) {
        const { parms, url } = this.state.list;
        this.openPostWindow(parms, url);
    } else {
        toast.error(msg, {
            autoClose: 2000,
            position: toast.POSITION.TOP_CENTER,
        });
    }
  }

  //打开新窗口
  openPostWindow = (parms, url) => {
      var tempForm = document.createElement("form");
      tempForm.id = "tempForm1";
      tempForm.method = "post";
      tempForm.action = url;
      tempForm.target = "_blank";
      Object.keys(parms).map(_key => {
          var input = document.createElement("input");
          input.type = "hidden";
          input.name = _key;
          input.value = parms[_key];
          tempForm.appendChild(input);
      });
    if (document.all) {
      tempForm.attachEvent("onsubmit", function() {}); //IE
    }
    document.body.appendChild(tempForm);
    if (document.all) {
      tempForm.fireEvent("onsubmit");
    } else {
      tempForm.dispatchEvent(new Event("submit"));
    }
    tempForm.submit();
    document.body.removeChild(tempForm);
  };

  render() {
    const { locationUrl } = this.props.route;
    const { res_type, ref_id, id} = this.props;
    const { item } = this.props;
    return (
      <React.Fragment>
        { (res_type || item.res_type || item.type) === "COURSE" ? 
        (<Link to={{pathname: `${locationUrl}course/${!!this.props.info ? "info/" : ""}${(item.display_id || id || item.ref_id)}`, state: { locationUrl },query: { id: item.id }}} >{this.props.children}</Link>) : 
        (<div onClick={this.showModal.bind(this, (res_type || item.res_type || item.type) , (ref_id || item.ref_id), (id || item.id))} style={{width:"100%" , height:"100%"}}>{this.props.children}</div>)}
        <Popup visible={this.state.visible} onCancel={this.onCancel}>
          {this._alter()}
        </Popup>
      </React.Fragment>
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

export default connect(mapStateToProps)(Adapter);