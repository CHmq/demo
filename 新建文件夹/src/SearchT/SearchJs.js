import React,{Component} from 'react';
import {
  Form, Icon, Input, Button,
} from 'antd';

const Search = Input.Search;

function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}

class HorizontalLoginForm extends React.Component {

  render() {
    return (
      <Form layout="inline" onSubmit={this.handleSubmit}>
        <Form.Item  span={16}>
          <Search
		      placeholder="input search text"
		      onSearch={value => console.log(value)}
		      enterButton
		    />
        </Form.Item>
        <Form.Item span={4}><Button><Icon type="sync" spin />
          </Button></Form.Item>
        <Form.Item span={4}><Button><Icon type="switcher" />
          </Button></Form.Item>
        
      </Form>
    );
  }
}

export default Form.create({ name: 'horizontal_login' })(HorizontalLoginForm);	