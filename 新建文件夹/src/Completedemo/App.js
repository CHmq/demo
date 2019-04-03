import React, {
	Component
} from 'react';
import $ from 'jquery';
import Demotable from './table';
import * as reactAPI from './reactAPI';
import Demofrom from './DemoFrom'

export default class Appdemo extends Component {
	constructor() {
		super();
		this.state = {
			error: null,
			isLoaded: false,
			app: []
		}
	}

	componentDidMount() {
		$.getJSON(reactAPI.api).then(
			response => this.setState({
				app: response.app,
				isLoaded: true,
				error: response.errmsg
			})
		)
	}


	//父组件获取子组件数据，并添加列表
	addRecord(addval) {
		let i = {
			"id": this.state.app.length + 1
		}
		const newapp = $.extend({}, i, addval)
		this.setState({
			error: null,
			isLoaded: true,
			app: [
				...this.state.app,
				newapp
			]
		})

	}
	//父组件获取子组件数据，并更新列表
	updateRecord(updateval, date) {
		const recordIndex = this.state.app.indexOf(updateval)
		const newapp = this.state.app.map((item, index) => {
			if (index !== recordIndex) {
				return item;
			}
			return {
				...item,
				...date
			};
		});
		this.setState({
			app: newapp
		});
	}

	//父组件获取子组件数据，并删除列表对应列
	deleteRecord(delval, date) {
		const recordIndex = this.state.app.indexOf(delval)
		const newapp = this.state.app.filter((item, index) => index !== recordIndex);
		this.setState({
			app: newapp
		});
	}



	render() {
		const {
			error,
			isLoaded,
			app
		} = this.state;


		if (error) {
			return <div className="div">{error}</div>

		} else if (!isLoaded) {
			return <div className="div">Loading..........</div>
		} else {
			return (

				<div>
		<Demofrom handleNewRecord={this.addRecord.bind(this)} />

    	<table className="table table-striped">
	      <thead>
	        <tr>
	          <th>#</th>
	          <th>First Name</th>
	          <th>Last Name</th>
	          <th>Username</th>
	          <th>Operation</th>
	        </tr>
	      </thead>
	      <tbody>
			{
				this.state.app.map(
				(app) => 
				<Demotable 
				key={app.id} 
				app = {app}  
				handleUpdate={this.updateRecord.bind(this)}				
				handleDelete={this.deleteRecord.bind(this)}
				/>)
			}

	        
	      </tbody>
	    </table>
	    </div>
			)
		}


	}



}