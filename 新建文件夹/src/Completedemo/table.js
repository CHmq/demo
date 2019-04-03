import React, {
	Component
} from 'react';

export default class Demotable extends Component {
	constructor() {
		super();
		this.state = {
			edit: false
		}
	}

	editTogget() {
		this.setState({
			edit: !this.state.edit
		})
	}

	//获取输入框输入内容并将数值传给父组件
	editUpdate(event) {
		const updateval = {
			date: this.refs.date.value,
			title: this.refs.title.value,
			amount: this.refs.amount.value,
		}

		this.props.handleUpdate(this.props.app, updateval)
		this.setState({
			edit: !this.state.edit
		})

	}

	//删除表单列表并将数值传给父组件
	deleteTogget(event) {
		const delval = {
			id: this.props.app.id
		}
		this.props.handleDelete(this.props.app, delval)
	}

	editRow() {
		return (
			<tr>
	          <th>{this.props.app.id}</th>
	          <td>{this.props.app.date}</td>
	          <td>{this.props.app.title}</td>
	          <td>{this.props.app.amount}</td>
	          <td>
	          <button className="btn btn-info mr-2" onClick={this.editTogget.bind(this)}>edit</button>
	          <button className="btn btn-danger" onClick={this.deleteTogget.bind(this)}>delete</button>
	          </td>
	        </tr>
		)
	}


	editForm() {
		return (
			<tr>
	          <td><input type="text" className="form-control"  defaultValue={this.props.app.date} ref="date"/></td>
	          <td><input type="text" className="form-control"  defaultValue={this.props.app.title} ref="title"/></td>
	          <td><input type="text" className="form-control"  defaultValue={this.props.app.amount} ref="amount"/></td>
	          <td>
	          <button className="btn btn-info mr-2" onClick={this.editUpdate.bind(this)} >UPdate</button>
	          <button className="btn btn-danger" onClick={this.editTogget.bind(this)}>Cancel</button>
	          </td>
	        </tr>
		)
	}



	render() {
		if (this.state.edit) {
			return this.editForm();

		} else {
			return this.editRow();
		}
	}
}