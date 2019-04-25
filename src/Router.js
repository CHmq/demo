import React, {
	Component
} from 'react';
import {
	HashRouter,Redirect,
	Route,
	Switch
} from 'react-router-dom';

import App from './App';
import Admin from './Admin';
import Login from './pages/Login';
import Home from './pages/Home';
import Uselist from './pages/User';
import Nomatch from './pages/Nomatch';
import AdminList from './pages/AdminList';
import Order from './pages/Order';
import Common from './common'
import OrderDetail from './pages/Order/detail'


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
								<Route path="/admin/adminList" component={AdminList}></Route>
								<Route path="/admin/order" component={Order}></Route>
								<Redirect to="/admin/home" />																
							</Switch>
						</Admin>}>	
					</Route>
					<Route path="/common" render={() =>
              <Common>
                  <Route path="/common/order/detail/:orderId" component={OrderDetail} />
              </Common>
          }/>									
				</App>
			</HashRouter>
		);
	}
}