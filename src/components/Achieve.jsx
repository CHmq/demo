import React, { Component } from "react";
import { Progress } from "antd";
import "assets/css/Achieve.module.scss";

/**
 * 成就组件
 * @使用方法:创建组件<Achieve styles={} data={} />
 * @param styles 类名 String 修改样式
 * @param data 数据 Array
 * data={[{ id: 1, picUrl: '图片路径', finished: '已完成数目', sum: '总数' }]}
 */

export default class Achieve extends Component {
  render() {
    const { data, styles } = this.props;
    return (
      <React.Fragment>
        <div className={styles}>
          <h3>{data.title}</h3>
          <img src={data.picUrl} alt="" />
          <span>
            {data.finished}/{data.sum}
          </span>
          <Progress
            percent={(data.finished / data.sum) * 100}
            size={"small"}
            showInfo={false}
            strokeColor={"#79bebb"}
          />
        </div>
      </React.Fragment>
    );
  }
}
