import React from "react";
import { Upload, Icon, Modal, Button, Row, Col } from "antd";
import { connect } from "react-redux";
import { toast, Flip } from "react-toastify";

import user from "components/services/userService";

class UploadingAvatar extends React.Component {
  /** state
   *  previewVisible
   *      模態框狀態更新  bool
   *
   *  previewImage
   *      點擊 預覽圖片保存的值 base64 || url string
   *
   *  fileList
   *      文件列表 array
   *
   *  uploading
   *      上傳按鈕狀態更新 bool
   */
  state = {
    previewVisible: false,
    previewImage: "",
    fileList: [],
    uploading: false,
    $$premit: [],
  };

  /** 模态框状态更新 */
  handleCancel = () => this.setState({ previewVisible: false });

  /** 点击图片或者预览图片回调 */
  handlePreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = file.thumbUrl;
    }
    /** 更新图片base64编码 并显示模态框 用于图片展示 */
    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true
    });
  };

  /** 切換預覽視圖 */
  handleChange = async ({ fileList }) => this.setState({ fileList });

getUploadPermit = (file) => {
    this.setState({$$permit : user.getProfilePermit(file)});
    return false;
}

  /** 上传头像 */
  uploadingAvatar = async () => {
    // 更新上傳按鈕狀態
    const { uploading } = this.state;
    this.setState({ uploading: true });

    const id = this.createToast({
      type: "info",
      msg: "正在上傳",
      autoClose: false,
      hideProgressBar: true
    });
    try {
      let _permit = await this.state.$$permit;
      await user.uploadProfile( _permit, this.state.fileList[0].originFileObj).catch(error => {
          if(!!error) {
            this.uploadingErrors({ result: error.result, id, uploading });
        }
          return new Promise((resolve, reject) => {
              reject("UPLOAD_ERROR");
          });
      });
      // 重新更新 redux user數據
      const { img } = await user.getUserData();
      this.props.UpdateAvatar(img);

      this.createUpdateToast({
        id,
        render: "上傳成功",
        type: toast.TYPE.SUCCESS,
        position: "top-center",
        transition: Flip,
        onClose: () => this.setState({ uploading })
      });
    } catch (error) {
        console.log(error);
    }
  };

  /** 上傳的異常處理 */
  uploadingErrors = ({ result, id, uploading }) => {
    switch (result) {
      case 0:
        return this.createUpdateToast({
          id,
          render: "上傳失敗,請重試",
          uploading
        });
      case 21:
        return this.createUpdateToast({
          id,
          render: "無權操作,請刷新重試",
          uploading
        });
      case 22:
        return this.createUpdateToast({
          id,
          render: "登錄已過期,請重試",
          uploading
        });
      case 23:
        return this.createUpdateToast({
          id,
          render: "設備已經更新,請刷新重試",
          uploading
        });
      case 24:
        return this.createUpdateToast({
          id,
          render: "已經登出,請重新登陸後重試",
          uploading
        });
      default:
        break;
    }
  };

  /** 生成 toast 提示控件
   * type 展示的消息類型
   * msg  消息
   * onOpen,onClose 控件渲染/銷毀的回調函數
   * 其餘請看API 文檔
   */
  createToast = ({
    type,
    msg,
    position = "top-center",
    autoClose = 3000,
    hideProgressBar = false,
    onOpen,
    onClose
  }) => {
    return toast[type](msg, {
      position,
      autoClose,
      hideProgressBar,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      onOpen,
      onClose
    });
  };

  /** 生成 toast 更新組件
   * type 展示的消息類型
   * msg  消息
   * onOpen,onClose 控件渲染/銷毀的回調函數
   * 其餘請看API 文檔
   */
  createUpdateToast = ({
    id,
    render,
    position = "top-right",
    type = toast.TYPE.ERROR,
    transition,
    autoClose = 3000,
    hideProgressBar = false,
    onOpen,
    uploading,
    onClose = () => this.setState({ uploading })
  }) => {
    toast.update(id, {
      render,
      position,
      type,
      transition,
      autoClose,
      hideProgressBar,
      onOpen,
      onClose
    });
  };

  /** 渲染元素 */
  render() {
    const { img: userAvatar } = this.props.user;
    const { previewVisible, previewImage, fileList, uploading } = this.state;
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">上傳頭像</div>
      </div>
    );
    return (
      <div className="clearfix">
        <Row type="flex" justify="space-around">
          {userAvatar && (
            <Col span={12}>
              <img src={userAvatar} alt="您的頭像"  style={{width:'100%'}}/>
            </Col>
          )}
          <Col span={12}>
            <Upload
              accept="image/*"
              listType="picture-card"
              fileList={fileList}
              onPreview={this.handlePreview}
              onChange={this.handleChange}
              beforeUpload={this.getUploadPermit}
              onRemove={this.handleRemove}
              style={{ height: 200 }}
            >
              {fileList.length >= 1 ? null : uploadButton}
            </Upload>
            <Modal
              visible={previewVisible}
              footer={null}
              onCancel={this.handleCancel}
            >
              <img alt="example" style={{ width: "100%" }} src={previewImage} />
            </Modal>
          </Col>
        </Row>
        <Row type="flex" justify="space-around">
          <Button
            type="primary"
            onClick={this.uploadingAvatar}
            loading={uploading}
          >
            確認上傳
          </Button>
        </Row>
      </div>
    );
  }
}

/** redux 数据获取
 * route 路由信息 -- 暂时无效
 */
function mapStateToProps({ /* route, */ user }) {
  return { /* route, */ user };
}

/** redux 數據更新
 * UpdateAvatar 用戶上傳圖片成功後 更新redux img
 */
function mapDispatchToProps(dispatch) {
  return {
    UpdateAvatar: payload => dispatch({ type: "UpdateAvatar", payload })
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UploadingAvatar);
