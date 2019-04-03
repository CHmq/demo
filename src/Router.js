import React, {
	Component
} from 'react';
import {
	HashRouter,
	Route,
	Switch
} from 'react-router-dom';

import App from './App';
import Admin from './Admin';
import Login from './pages/Login';
import Home from './pages/Home';
import Uselist from './pages/User';
import Nomatch from './pages/Nomatch';


//这里不能用path="/"，因为三者都平级关系，所以会全部加载；

export default class Router extends Component {
	render() {
		return (
			<HashRouter>
				<App>
					<Route path="/login" component={Login}></Route>
					<Route path="/admin" render= {()=>
						<Admin>
							<Switch>
								<Route path="/admin/home" component={Home}></Route>
								<Route path="/admin/useList/addUser" component={Uselist}></Route>
								<Route component={Nomatch}></Route>																
							</Switch>
						</Admin>}>	
					</Route>									
				</App>
			</HashRouter>
		);
	}
}