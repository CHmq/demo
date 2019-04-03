import React,{Component} from 'react';
import { Menu, Icon, Switch } from 'antd';
import 'antd/dist/antd.css';
import './MenuCss.css';


const SubMenu = Menu.SubMenu;

class MenuLeft extends React.Component {
  state = {
    theme: 'light',
    current: '1',
  }


  handleClick = (e) => {
    console.log('click ', e);
    this.setState({
      current: e.key,
    });
  }

  render() {
    return (
      <div>
      <h3>{<span><Icon type="file-text" /><span>缴费系统</span></span>}</h3>
        <Menu
          theme={this.state.theme}
          onClick={this.handleClick}
          style={{ width: 200 }}
          defaultOpenKeys={['sub1']}
          selectedKeys={[this.state.current]}
          mode="inline"
        >
          <SubMenu key="sub1" title={<span><Icon type="mail" /><span>银行设置</span></span>}>
          
            <Menu.Item key="1" >Home</Menu.Item>
            <Menu.Item key="2" >柱状图</Menu.Item>
            <Menu.Item key="3" >扇形图</Menu.Item>
          </SubMenu>
        </Menu>
      </div>
    );
  }
}


export default MenuLeft;