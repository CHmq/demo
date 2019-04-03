import React,{Component} from 'react';
import {  HashRouter,  Route,  Link,  Switch} from 'react-router-dom';
import { Layout, Icon ,DatePicker, Row, Col , Button  } from 'antd';
import 'antd/dist/antd.css';
import './myCss.css';
import MenuLeft from '../MenuL/MenuJs.js';
import Router1 from '../Chart/Route.js';
const { Header, Content, Footer, Sider } = Layout;


//自定义组件SiderDemo
class SiderDemo extends Component {

    render() {
        return (
            <Layout>
                <Sider style={{ background: "#fff" }}>
                    <MenuLeft />
                </Sider>
                <Layout>
                    <Header style={{ margin: "0 0 20px" ,background: "#fff" ,padding: "0 15px"}}>
                        <Row>
                              <Col xs={{ span: 13 }} lg={{ span: 8 }}>银行列表</Col>
                              <Col xs={{ span: 8, offset: 3 }} lg={{ span: 3, offset: 13 }}><Button type="primary"><span><Icon type="plus-circle" />&nbsp;新增</span></Button></Col>
                        </Row>
                    </Header>
                    <Content>

                        <Router1 />
                    </Content>
                    <Footer>








                    </Footer>

                </Layout>
            </Layout>
        );
    }
}

//输出组件
export default SiderDemo;