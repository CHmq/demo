import React, { Component } from 'react';
import ReactPlayer from "react-player";
import {Row , Typography} from 'antd';
class Video extends Component {
  
  // 设置默认值
  static defaultProps = { 
    width:'100%',
    height:"100%",
    title:'' // 标题
  }
  render() {
    const {videosrc,title,width,height} = this.props;
    const {Title} = Typography;
    const styleCss = {
      main: {
        width: "auto",
        height: "auto",
        maxWidth: width,
        maxHeight: height,
        backgroundColor:'transparent'
      },
      text: {
        color:'#fff',
        textAlign:'center'
      },
      black:{
      }
    };
    return (
      <Row type="flex" justify="center" align="middle" style={{width:"100%" , height:"100%" , flexDirection: "column"}} >
        {title ? <Title level={2} style={styleCss.text}>{title}</Title> : ''}
        <ReactPlayer className="evi-player" url={videosrc} controls={true} width="auto" height="auto" style={styleCss.main} playing={this.props.playing} />
        {this.props.children}
      </Row>
    );
  }
}

export default Video;