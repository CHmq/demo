import React, {
	Component
} from 'react';
import {	Table,	Card,Button} from 'antd';
import axios from '../../axios/index';
import Utils from './../../components/utils/util';



export default class AdminList extends Component {
	state = {}
	parmas = {
		page: 1
	}

	//生命周期render渲染前加载
	componentDidMount() {

		this.request();
	}


	request = () => {
		//防止作用域发生变化
		let _this = this;
		//调用封装axios的ajax方法
		axios.ajax({
				url: '/system',
				data: {
					parmas: {
						page: this.parmas.page
					}
				}
			})
			//接受promise抛回的数据
			.then((res) => {
				this.setState({
					list: res.result.list.map((item, index) => {
						item.key = index
						return item
					}),
					pagination: Utils.pagination(res, (current) => {
						_this.parmas.page = current;
						_this.request()
					})
				})
			})
	}



	render() {
		//表头
		const columns = [{
			title: 'No',
			dataIndex: 'id'
		}, {
			title: 'Name',
			dataIndex: 'name'
		}, {
			title: 'Sex',
			dataIndex: 'sex',
			render(sex) {
				return sex === 1 ? '男' : '女';
			}
		}, {
			title: 'Ages',
			dataIndex: 'ages'
		}, {
			title: 'Work',
			dataIndex: 'work',
			render(worker) {
				let config = {
					'1': '司机',
					'2': '工人',
					'3': '农民',
					'4': '白领',
					'5': 'CEO'
				}
				return config[worker]
			}
		}, {
			title: 'Address',
			dataIndex: 'county'
		}, {
			title: 'Date',
			dataIndex: 'date'
		}, {
			title: 'Action',
			key: 'action',
			render: (text, record) => (
				<span>
					<Button type="danger"><a href="/">Delete</a></Button>
				</span>
			),
		}]



		return (
			<div>
				{/* //多选表单 */}
				<Card title="城市管理员">
					<Button type="danger" onClick={this.handleDel}>Delete</Button>
					<Table columns={columns} dataSource={this.state.list} pagination={this.state.pagination}> 
				    </Table>

				</Card>
			</div>


		);
	}
}