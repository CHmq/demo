
import React, { Component } from 'react';
import ReactDOM from 'react-dom';


import Demo1 from '../Demo/demo1.js';
import Diagram from '../Chart/Diagram.js';
import TableData from '../TableData/DataJs.js';
import {  HashRouter,  Route,  Link,  Switch} from 'react-router-dom';


 
class Router1 extends Component {

    render() {
        return (
            <HashRouter>
                <div>
                  <ul>
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/Diagram">柱状图</Link></li>
                    <li><Link to="/demo">hi demo</Link></li>
                  </ul>
                  <Route exact path="/" component={TableData} />
                  <Route path="/Diagram" component={Diagram} />
                  <Route path="/demo" component={Demo1} />
           
                </div>
            </HashRouter>
        );
    }
}

//输出组件
export default Router1;