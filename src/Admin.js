import React, {
	Component
} from 'react';

import {
	Row,
	Col
} from 'antd';
import Header from './components/Header';
import Navleft from './components/Navleft';
import Footer from './components/Footer';
// import Home from './pages/Home';
import './Admin.less';
import 'antd/dist/antd.css';


export default class Admin extends Component {
	render() {
		return (
			<Row>
			    <Col span={4}>
			        <Navleft></Navleft>
			   </Col>
			    <Col span={20} className="main">
			        <Header></Header>
			        {/*<Home></Home>*/}
			        {this.props.children}
			        <Footer></Footer>
			   </Col>
			</Row>

		);
	}
}