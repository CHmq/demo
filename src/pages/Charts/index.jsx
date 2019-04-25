import React, { Component } from 'react'
import { Chart, Geom, Axis, Tooltip, Legend, Coord } from 'bizcharts';


// 数据源
const data = [
  { genre: 'Sports', sold: 275, income: 2300 },
  { genre: 'Strategy', sold: 115, income: 667 },
  { genre: 'Action', sold: 120, income: 982 },
  { genre: 'Shooter', sold: 350, income: 5271 },
  { genre: 'Other', sold: 150, income: 3710 }
];
const data1 = [
  {
    country: 'Asia',
    year: '1750',
    value: 502,
  },
  {
    country: 'Asia',
    year: '1800',
    value: 635,
  },
  {
    country: 'Asia',
    year: '1850',
    value: 809,
  },
  {
    country: 'Asia',
    year: '1900',
    value: 5268,
  },
  {
    country: 'Asia',
    year: '1950',
    value: 4400,
  },
  {
    country: 'Asia',
    year: '1999',
    value: 3634,
  },
  {
    country: 'Asia',
    year: '2050',
    value: 947,
  },
  {
    country: 'Africa',
    year: '1750',
    value: 106,
  },
  {
    country: 'Africa',
    year: '1800',
    value: 107,
  },
  {
    country: 'Africa',
    year: '1850',
    value: 111,
  },
  {
    country: 'Africa',
    year: '1900',
    value: 1766,
  },
  {
    country: 'Africa',
    year: '1950',
    value: 221,
  },
  {
    country: 'Africa',
    year: '1999',
    value: 767,
  },
  {
    country: 'Africa',
    year: '2050',
    value: 133,
  },
  {
    country: 'china',
    year: '1650',
    value: 140,
  },
  {
    country: 'china',
    year: '1740',
    value: 300,
  },
  {
    country: 'china',
    year: '1790',
    value: 500,
  },
  {
    country: 'china',
    year: '2060',
    value: 2300,
  },
  {
    country: 'china',
    year: '1900',
    value: 2120,
  },
  {
    country: 'china',
    year: '1860',
    value: 1767,
  },
  {
    country: 'china',
    year: '2003',
    value: 1330,
  },
];

// 定义度量
const cols = {
  sold: { alias: '销售量' },
  genre: { alias: '游戏种类' }
};
const cols1 = {
  year: {
    type: 'linear',
    tickInterval: 50,
  },
};
export default class index extends Component {
  render() {
    return (
      <div>
        <Chart width={600} height={400} data={data} scale={cols}>
          <Axis name="genre" />
          <Axis name="sold" />
          <Legend position="top" dy={-20} />
          <Tooltip />
          <Geom type="interval" position="genre*sold" color="genre" />
          
        </Chart>

        
        <Chart height={400} width={600}  data={data1} scale={cols1}>
          <Axis name="year" />
          <Axis name="value" />
          <Legend />
          <Tooltip />
          <Geom type="areaStack" position="year*value" shape="smooth" color={['country', ['l (0) 0:rgba(0, 85, 255, 1) 1:rgba(0, 200, 255, 1)', 'l (90) 0:rgba(0, 268, 0, 1) 1:rgba(0, 268, 0, 0.1)','l (90) 0:rgba(133, 150, 0, 1) 1:rgba(133, 150, 0, 0.1)']]} />
          {/* <Geom type="lineStack" position="year*value" size={2} color={['country', ['rgba(0, 146, 255, 1)', '#00ff00',]]} /> */}
        </Chart>
      </div>
    )
  }
}
