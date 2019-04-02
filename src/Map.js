import React, {
  Component
} from 'react';
import {
  Map,
  Marker
} from 'react-amap';
export default class Map extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mapZoom: 12, //地图缩放等级 （zoom）越小缩放越大
      //https://lbs.amap.com/api/javascript-api/guide/abc/prepare这里有介绍key怎么申请
      mapKey: 'f21b4cf3352681db2f20fd0d19d24a5c', //Key就不贴出来了奥
      status: {
        zoomEnable: false,
        dragEnable: false,
      },
      mapCenter: [116.292329, 39.946996], //地图中心点
      mapMake: [116.273961, 39.946338], //marker标记点
    };
  }



  render() {
    let {
      mapCenter,
      mapMake,
      mapZoom,
      mapKey,
      status
    } = this.state;
    return <div style={{width:'500px',height:'800px'}}>
            {/*地图创建必有参数 （key，中心点，zoom等级）*/}
            <Map amapkey={mapKey} center={mapCenter} zoom={mapZoom} status={status}>
            </Map>
        </div>
  }
}