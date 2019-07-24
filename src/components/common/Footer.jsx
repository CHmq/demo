import React, { Component } from "react";
import { Menu, Row, Col , Layout } from "antd";
import { connect } from "react-redux";
import intl from "react-intl-universal";
import style from 'assets/css/layout.module.scss';

const { Footer } = Layout;

class MyFooter extends Component {
    
  render() {
    const { translations } = this.props;
    return (
      <Footer className={style.footer}>
        <Row type="flex" align="middle">
          <Col
            xs={{ span: 2, offset: 18 }}
            md={{ span: 13, offset: 7 }}
            lg={{ span: 6, offset: 13 }}
          >
            <Menu
              theme="light"
              mode="horizontal"
              defaultSelectedKeys={["1"]}
              style={{ lineHeight: "64px" }}
            >
              <Menu.Item key="1">
                {translations.initDone && intl.get("home.publicMsg.footer.about")}
              </Menu.Item>
              <Menu.Item key="2">
                {translations.initDone && intl.get("home.publicMsg.footer.liaison")}
              </Menu.Item>
              <Menu.Item key="3">
                {translations.initDone &&
                  intl.get("home.publicMsg.footer.agreement")}
              </Menu.Item>
              <Menu.Item key="4">
                {translations.initDone &&
                  intl.get("home.publicMsg.footer.Disclaimer")}
              </Menu.Item>
            </Menu>
          </Col>
        </Row>
      </Footer>
    );
  }
}

function mapStateToProps({ route, user, translations }) {
  return {
    route,
    user,
    translations
  };
}

export default connect(mapStateToProps)(MyFooter);
