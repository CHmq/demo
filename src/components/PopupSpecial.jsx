import React, { Component } from "react";
import { Button, Icon, Row, Col, Upload, Modal } from "antd";
import exploration from "components/services/user_commentService";
import user from "components/services/userService";
import course from "components/services/courseService";

import styles from "assets/css/PopupSpecial.module.scss";

class Exploration extends Component {
  // static defaultProps = {
  //   fileList: [] //初始化上传列表
  // };
getUploadPermit = (file) => {
    console.log(this.props);
    const refId = this.props.data.refId;
    const courseID = this.props.urlId;
    const data = {
        'course_id': courseID,
        'res_id': refId, 
        'id': this.props.id, 
        'app_type': 'KID_WEB'};

    if(!!this.props.id){
        this.setState({$$permit : course.getUserRecordUpdatePermit(file, data)});
    } else {
        this.setState({$$permit : course.getUserRecordAddPermit(file, data)});
    }
    return false;
}
  
  constructor(props) {
    super(props);
    this.state = {
      fileList: [], //初始化上传列表
      uploading: false, //上传状态
      id: "", //验证上传id
      imgbase: "", //base64图
      previewVisible: false, //查看图片状态
      previewImage: "", //查看图片
      modaliImg: true, //判断图片或视频
      title: ""
    };
    console.log('?????')
    console.log(this.props.data)
    console.log('?????')
  }
  componentDidMount() {
    // console.log(this.props.urlId)
    this.setState({
      fileList: this.props.data.fileList
    });
  }

  //关闭彈出框
  onCancel = () => {
    this.verifyUpload(this.props.data.refId);
    this.props.onCancel();

    console.log(this.state.fileList);
  };

  async verifyUpload(refId) {
    // console.log("ref:" + value);
    this.setState({
      verifylist: await exploration
        .VerifyUplaod(refId)
        .then(ret => {
          console.log(ret);
          return ret;
        })
        .catch(_msg => {
          //SHOW MESSAGE
          console.log(_msg);
          return [];
        })
    });
    if (this.state.verifylist.file) {
      const filelist = [
        {
          uid: "-1",
          status: "done",
          url: this.state.verifylist.file
        }
      ];
      this.setState({
        fileList: filelist
      });
    } else {
      // const filelist = [];
      this.setState({
        fileList: []
      });
    }
    this.setState({
      uploading: false
    });
    // console.log(this.state.fileList);
  }

  //分享
  _share = () => {
    console.log("分享");
  };           

  //上传
  handleUpload = async () => {
    try {
        let _permit = await this.state.$$permit;
        await user.uploadProfile( _permit, this.state.fileList[0].originFileObj).catch(error => {
          return new Promise((resolve, reject) => {
              reject("UPLOAD_ERROR");
          });
      });
    } catch (error) {
        console.log(error);
    }
  };

  //base64转换
  getBase64 = file => {
    return new Promise(function(resolve) {
      let reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = function() {
        resolve(this.result);
      };
    });
  };

  //查看文件
  handlePreview = file => {
    this.setState({
      modaliImg: true,
      previewImage: file.url || file.thumbUrl,
      previewVisible: true
    });
  };
  handleCancel = () => this.setState({ previewVisible: false });

  //视频缩略图
  getVideoImage = (file, call) => {
    if (file && file.type.indexOf("video/") === 0) {
      var video = document.createElement("video");
      video.src = URL.createObjectURL(file);
      video.addEventListener("loadeddata", function() {
        this.width = this.videoWidth;
        this.height = this.videoHeight;
        var canvas = document.createElement("canvas");
        var ctx = canvas.getContext("2d");
        canvas.width = this.width;
        canvas.height = this.height;
        ctx.drawImage(this, 0, 0, canvas.width, canvas.height);
        var image = {
          url: canvas.toDataURL("image/jpeg", 1),
          width: this.width,
          height: this.height,
          currentTime: this.currentTime,
          duration: this.duration
        };
        canvas.toBlob(function(blob) {
          image.blob = blob;
          typeof call == "function"
            ? call.call(file, image)
            : console.log(image);
        });
      });
    }
  };

  render() {
    let { uploading, fileList } = this.state;
    let { title } = this.props.data;
    // console.log(this.state.fileList)
    //
    //上传选择框
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">上傳相關的圖片或視頻</div>
      </div>
    );

    // console.log(fileList);
    const thi = this;
    //<Upload/>属性
    const props = {
      listType: "picture-card",
      className: "avatar-uploader",
      onPreview: file => {
        this.handlePreview(file);
      },
      onChange: ({ fileList, file }) => {
        // 视频缩略图
        if (file.type === "video/mp4") {
          let url = "";
          this.getVideoImage(file, function(a) {
            url = a.url;
            thi.setState({ videoImage: url });
            fileList[0].thumbUrl = thi.state.videoImage;
            thi.setState({ fileList });
          });
        }

        //图片缩略图
        this.setState({ fileList });
        this.getBase64(file);
      },
      onRemove: file => {
        this.setState(state => {
          return {
            fileList: []
          };
        });
      },
      beforeUpload: file => {
        this.setState(state => ({
          fileList: [...state.fileList, file]
        }));
        return false;
      },
      fileList
    };

    return (
      <div className={styles.wrap}>
        <Row style={{ borderRadius: 30, overflow: "hidden" }}>
          <Col xs={0} md={9}>
            <img src={require("assets/image/special.png")} alt="pupupType" />
          </Col>
          <Col xs={24} md={0}>
            <div className={styles.xs_title}>
              <h2>專題研習</h2>
            </div>
          </Col>
          <Col xs={24} md={15}>
            <div className={styles.container}>
              <h1>{!!this.props.info ? this.props.info.name : "專題研習"}</h1>
              <h3>{title}</h3>
              <Col span={16} offset={4}>
                <Upload {...props} beforeUpload={this.getUploadPermit}>
                  {fileList.length >= 1 ? null : uploadButton}
                </Upload>
                <Modal
                  visible={this.state.previewVisible}
                  footer={null}
                  onCancel={this.handleCancel}
                >
                  {this.state.modaliImg ? (
                    <img
                      alt="example"
                      style={{ width: "100%" }}
                      src={this.state.previewImage}
                    />
                  ) : (
                    <video
                      alt="example"
                      style={{ width: "100%" }}
                      src={this.state.previewImage}
                      controls
                    />
                  )}
                </Modal>
              </Col>
              <Button className={styles.xs_share} onClick={e => this._share()}>
                分享
              </Button>
              <Button
                className={styles.xs_update}
                onClick={e => this.handleUpload()}
                disabled={fileList.length === 0}
                htmlType="submit"
                loading={uploading}
              >
                {uploading ? "上载中...." : "上载"}
              </Button>
            </div>
          </Col>
        </Row>
        {/* 分享 */}
        <Button className={styles.share} onClick={e => this._share()}>
          <img src={require("assets/image/exploration1.png")} alt="" />
        </Button>
        {/* 上载 */}
        <Button
          className={styles.update}
          disabled={fileList.length === 0}
          htmlType="submit"
          onClick={e => this.handleUpload()}
          // loading={uploading}
        >
          {uploading ? (
            <img src={require("assets/image/exploration21.png")} alt="" />
          ) : (
            <img src={require("assets/image/exploration2.png")} alt="" />
          )}
        </Button>
        {/* 关闭 */}
        <Button className={styles.close} onClick={this.onCancel}>
          <Icon type="close" />
        </Button>
      </div>
    );
  }
}
export default Exploration;
