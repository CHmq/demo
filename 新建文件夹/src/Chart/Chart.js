
import React, { Component } from 'react';
import ReactDOM from 'react-dom';


import Diagram from '../Chart/Diagram.js';
import {  HashRouter,  Route,  Link,  Switch} from 'react-router-dom';
 
class App extends Component {
  render() {
    return (
      <div>
        <h1>App</h1>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/Diagram">柱状图</Link></li>
          <li><Link to="/inbox">扇形图</Link></li>
        </ul>
        {this.props.children}
 
      </div>
    );
  }
}
 
const Diagram1 = () => (
  <Diagram/>
)
 
const Home = () => (
  <div>
    <h3>Home</h3>
  </div>
)
 
const Message = ({ match }) => (
  <div>
    <h3>new messages</h3>
    <h3>{match.params.id}</h3>
  </div>
)
 
const Inbox = ({ match }) => (
  <div>
    <h2>Topics</h2>
    <Route path={`${match.url}/messages/:id`} component={Message}/>
 
  </div>
) 
class Chart extends Component {

    render() {
        return (
            <HashRouter>
                <App>
                    <Route exact path="/" component={Home} />
                    <Route path="/Diagram" component={Diagram1} />
                    <Route path="/inbox" component={Inbox} />
                </App>
            </HashRouter>
        );
    }
}

//输出组件
export default Chart;