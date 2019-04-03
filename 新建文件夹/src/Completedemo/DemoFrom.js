import React, {
  Component
} from 'react';
import * as reactAPI from './reactAPI';

export default class Demofrom extends Component {
  constructor(props) {
    super(props);
    this.state = {
      date: "",
      title: "",
      amount: "",
    }
  }


  //绑定输入框
  handleChange(event) {
    let name, obj;
    name = event.target.name;
    this.setState((
      obj = {},
      obj["" + name] = event.target.value,
      obj
    ))
  }

  //判断输入框
  voild() {
    return this.state.date && this.state.title && this.state.amont;
  }

  handleSubmit(event) {
    event.preventDefault();
    // reactAPI.create(this.state).then(
    //   response => console.log(response.data) 
    //   ).catch(
    //   error => console.log(error)

    //  <button type="submit" className="btn btn-primary" disabled={!this.voild()}>Send</button>
  }


  //获取输入框数据向父组件传值，并清空输入框
  handleNew() {
    this.props.handleNewRecord(this.state)
    this.setState({
      date: "",
      title: "",
      amount: "",
    })

  }

  render() {
    return (
      <form className="form-inline" onSubmit={this.handleSubmit.bind(this)}>
        <div className="form-group">
          <input type="text" className="form-control" placeholder="date" name="date" value={this.state.date} onChange={this.handleChange.bind(this)} />
        </div>
      	<div className="form-group">
        	<input type="text" className="form-control" placeholder="title"  name="title" value={this.state.name} onChange={this.handleChange.bind(this)}/>
      	</div>
      	<div className="form-group">
        	<input type="text" className="form-control" placeholder="amount" name="amount" value={this.state.amount} onChange={this.handleChange.bind(this)}/>
      	</div>

        <button type="submit" className="btn btn-primary" onClick={this.handleNew.bind(this)}>Send</button>

    	</form>
    )
  }
}