import React, { Component } from 'react';
import { Chart, Geom, Axis, Tooltip, } from 'bizcharts';

import styleCss from 'assets/css/Weekchart.module.scss'

/**   
 * 图表组件
 * <Weekchart heigth={默认为180 number类型}/>
 */
class Weekchart extends Component {
  // 设置默认值
  static defaultProps = {
    height: 180,
    data: [],
    title:'本周自学时间',
    min:'分鐘',
    day:'星期'
  }
  render() {
    const { height,title,min,day } = this.props;
    const data = [
      {
        day: '日',
        value: 80,
      },
      {
        day: '一',
        value: 50,
      },
      {
        day: '二',
        value: 120,
      },
      {
        day: '三',
        value: 20,
      },
      {
        day: '四',
        value: 130,
      },
      {
        day: '五',
        value: 80,
      },
      {
        day: '六',
        value: 90,
      },
    ];
    const titleY = {
      autoRotate:false,
      offset:-5,
      textStyle: {
        fontSize: '12',
        // textAlign: 'center',
        fill: '#999',
        fontWeight: 'bold',
      }, // 坐标轴文本属性配置
      position:'end'
    }
    
    const scale = {
      day: {
        alias: day // 为属性定义别名
      },
      value: {
        alias: min, // 为属性定义别名
      }
    };
    return (
      <div className={styleCss.weekchartwarp}>
        <Chart scale={scale} padding={[10,20,20,40]} width={100} height={height} data={data} forceFit>
         <p className='main-title' style={{textAlign:"center"}}>
            {title}
          </p>
          {/*visible={false} 设置可以隐藏Y轴的刻度  */}
          <Axis name="value" title={titleY}  />
          {/* line="null" 设置可以隐藏X轴的刻度  */}
          <Axis name="day" title={titleY}  tickLine="null"/>
          {/* Legend 点击按钮切换 */}
          {/* <Legend/>  */}
          {/* Tooltip 鼠标移动上去可以看到详情 */}
          <Tooltip />
          {/* type 图的类型 */}
          <Geom 
          // radius={.8}
          type="interval"
          position="day*value" 
          shape="smooth"
          color={['value', (value)=>{
            // 当value值大于50进行颜色改变
              if(value >= 50)
                return 'l(90) 0.2:#ffae71 1:#ffe6cf';
              else
                return 'l(90) 0.2:#6a98e2 1:#7edbf8';
            }]} />
        </Chart>
      </div>
    );
  }
}

export default Weekchart;