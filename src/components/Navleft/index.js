import React, {
	Component
} from 'react';
import {
	Menu,
} from 'antd';
import {
	NavLink
} from 'react-router-dom';
import menuList from "./../../config/menuConfig"
import "./index.less"
const SubMenu = Menu.SubMenu;

export default class Navleft extends Component {
	//render之前初始化加载,将权限菜单导入
	componentWillMount() {
		const menuTree = this.renderMenu(menuList);
		this.setState({
			menuTree
		})
	}



	//菜单渲染(递归遍历菜单列表)
	renderMenu = (data) => {
		return data.map((item) => {
			//如果有children重新调用自身重新遍历
			if (item.children) {
				return (
					<SubMenu title={item.title} key={item.key}>
									{this.renderMenu(item.children)}
								</SubMenu>
				)
			}
			return <Menu.Item  title={item.title} key={item.key}>
				<NavLink to={item.key}>{item.title}</NavLink>			
			</Menu.Item>
		})
	}

	render() {
		return (
			<div>
			    <div className="logo">
				    <img src="" alt=""/>
				    <h1>this is logo</h1>
			    </div>
			    <Menu>
					{this.state.menuTree}
				</Menu>
			</div>

		);
	}
}