import React, {
	Component
} from 'react';
import {
	Table,
	Card,
	Divider,
	Button,
	Modal,
	message
} from 'antd';
import axios from '../../axios/index';



export default class Uselist extends Component {
	state = {}
	//生命周期render渲染前加载
	componentDidMount() {
		const data = [{
			"id": "0",
			"name": "张三",
			"sex": "女",
			"ages": "26",
			"work": "3",
			"county": "广州",
			"date": "2019-01-01"
		}]
		//遍历绑定key值
		data.map((item, index) => {
			return item.key = index
		})
		this.setState({
			dataSource: data
		})
		this.request();
	}


	request = () => {
		//调用封装axios的ajax方法
		axios.ajax({
				url: '/system',
			})
			//接受promise抛回的数据
			.then((res) => {
				if (res.code == 0) {
					res.result.list.map((item, index) => {
						return item.key = index
					})
					this.setState({
						selectKeys: [],
						selectRows: null,
						dataSource2: res.result.list
					})
				}
			})
	}

	//点击获取表单信息
	onRowClick = (record, index) => {
		let selectKey = [index];
		Modal.info({
			title: "当前选择的是：",
			content: `姓名:${record.name}` + ` ` + `职业:${record.work}`
		})
		this.setState({
			selectKeys: selectKey,
			selectItem: record
		})
	}

	//点击获取删除表单信息
	handleDel = (() => {
		let rows = this.state.selectRows;
		let names = [];
		rows.map((item) => {
			names.push(item.name)
		})
		Modal.info({
			title: "当前选择的是：",
			content: `姓名:${names}`,
			onOk: () => {
				message.success("删除成功！");
				this.request();
			}
		})
	})

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
				return sex == 1 ? '男' : '女';
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
					<Button type="primary"><a href="javascript:;">add</a></Button>
					<Divider type="vertical" />
					<Button type="danger"><a href="javascript:;">Delete</a></Button>
				</span>
			),
		}]

		//定义selectKeys
		const selectKeys = this.state.selectKeys
		//定义表单为多选和单选
		const rowSelection = {
			type: 'radio',
			selectKeys
		}
		const checkboxSelection = {
			type: 'checkbox',
			selectKeys,
			onChange: (selectKeys, selectRows) => {
				this.setState({
					selectKeys,
					selectRows
				})
			}
		}



		return (
			<div>
				<Card title="页面数据">
					<Table columns={columns}  dataSource={this.state.dataSource}>
				    </Table>

				</Card>
				//单选表单
				<Card title="axios获取的mock数据">
					<Table columns={columns} dataSource={this.state.dataSource2} rowSelection={rowSelection}
					onRow={(record,index) => {
							return {
								onClick :() => {
									this.onRowClick(record,index)
								},       // 点击行
							};
					}}> 
				    </Table>

				</Card>
				//多选表单
				<Card title="axios获取的mock数据">
					<Button type="danger" onClick={this.handleDel}>Delete</Button>
					<Table columns={columns} dataSource={this.state.dataSource2} rowSelection={checkboxSelection}>					}}> 
				    </Table>

				</Card>
			</div>


		);
	}
}