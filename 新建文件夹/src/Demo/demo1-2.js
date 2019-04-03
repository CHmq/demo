import React, {Component} from 'react';
import ReactDOM from 'react-dom';


// const BigDemo = () =>

//     <div>
//     	<h1>我是大DEMO</h1>
            
//     </div>



class BigDemo extends Component {

	render(){

		let {location} = this.props;
		return(
			<div>
		    	<h1>我是大DEMO</h1>

		    	{location ?
			        <div>
			            <div>hash:{location.hash}</div>
			            <div>pathname:{location.pathname}</div>
			            <div>search:{location.search}</div>
			            <div>state:{location.state && location.state.fromDashboard}</div>
			        </div>
			        :null
				}
		            
		    </div>
		    	
			)
	}
}




export default BigDemo;