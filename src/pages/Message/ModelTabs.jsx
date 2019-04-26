import React, { Component } from 'react';
import { Tabs } from 'antd';
import Classdetail from './Classdetail'

const TabPane = Tabs.TabPane;

export default class ModelTabs extends Component {

  callback = (key)=> {
   
  }
  render() {
    return (
      <div>
        <Tabs defaultActiveKey="1" onChange={this.callback}>
          <TabPane tab="Tab 1" key="1">
            
              <Classdetail/>
          </TabPane>
          <TabPane tab="Tab 2" key="2">Content of Tab Pane 2</TabPane>
          <TabPane tab="Tab 3" key="3">Content of Tab Pane 3</TabPane>
        </Tabs>
      </div>
    )
  }
}
