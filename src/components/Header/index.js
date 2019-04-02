import React, {
	Component
} from 'react';

import {
	Row,
	Col
} from 'antd';
import "./index.less"
import Util from "./../utils/util"
import axios from "../../axios"


export default class Header extends Component {
	// state({
	// 	city: 广州
	// })



	componentWillMount() {
		this.setState({
			username: 'Username'
		})
		setInterval(() => {
			let sysTimes = Util.formateDate(new Date().getTime());
			this.setState({
				sysTimes
			})
		}, 1000)
		this.getWeatherAPI()
	}

	//通过.then()接受promise返回参数
	getWeatherAPI() {
		let city = "广州"
		axios.jsonp({
			url: 'https://restapi.amap.com/v3/weather/weatherInfo?key=f21b4cf3352681db2f20fd0d19d24a5c&city=' + city
		}).then((res) => {
			if (res.status == '1') {
				let data = res.lives[0]
				console.log(data)
				this.setState({
					province: data.province,
					city: data.city,
					temperature: data.temperature,

				})
			}
		})
	}



	render() {
		return (
			<div className="header">
				<Row className="header-top">
					<Col span={24}>
					<span>welcome,{this.state.username}</span>	
				 		<a href="#">退出</a>		

					</Col>
				</Row>
				<Row className="breadcrumb">
					<Col span={6} className="breadcrumb-title">
						<span>welcome,{this.state.username}</span>	

					</Col>
					<Col span={18} className="weather">
						<span className="date">{this.state.sysTimes}</span>	
						<span className="weather-detail">{this.state.province}{this.state.city}</span>	
						<span className="weather-detail">温度：{this.state.temperature}°C</span>		

					</Col>

				</Row>

			</div>

		);
	}
}