import React, {
	Component
} from 'react';
import {
	Card,
	Form,
	Input,
	Button,
	Checkbox,
	Icon,
	message
} from 'antd';
import './index.less';



class LoginForm extends Component {

	handleSubmit = () => {
		let useInfo = this.props.form.getFieldsValue();
		this.props.form.validateFields((err, value) => {
			if (!err) {
				message.success(`${useInfo.usename}通过了，你的密码为${useInfo.password}`)
			}
		})
	}

	render() {
		const {
			getFieldDecorator
		} = this.props.form;
		return (
			<Card title="登录" className="login-card">
				<Form className="login-form" >
					<Form.Item>
						{getFieldDecorator('usename',{
							initialValue:'',
							rules:[
								{
									required:true,
									message:"用户名不能为空"
								},
								{
									min:5,max:10,
									message:"密码不能少于6位"
								}
							]						
						})(<Input prefix={<Icon type="user"/>} placeholder="usename"/>)						          
					}
		        	</Form.Item>

					<Form.Item>
						{getFieldDecorator('password',{
							initialValue:'',
							rules:[
								{
									required:true,
									message:"密码不能为空"
								}
							]							
						})(<Input prefix={<Icon type="lock"/>}  placeholder="password"/>)						          
					}
		        	</Form.Item>

					<Form.Item>
      					{getFieldDecorator('remember', {
            				valuePropName: 'checked',
        					initialValue: true,
      						})(<Checkbox>Remember me</Checkbox>
         				 )}
          				<a className="login-form-forgot" href="">Forgot password</a>       
		        	</Form.Item>

					<Form.Item>
						<Button type="primary"  onClick={this.handleSubmit}><Icon type="check-circle"/>submit</Button>       
		        	</Form.Item>
	        
	      		</Form>

			</Card>

		);
	}
}
export default Form.create()(LoginForm)