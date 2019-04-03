import React from 'react';
import ReactDOM from 'react-dom';
import BigDemo from '../Demo/demo1-2.js';
import SmallDemo from '../Demo/demo1-1.js';
import {  HashRouter,  Route,  Link,  Switch ,Redirect} from 'react-router-dom';



const Demo1 = ({match}) =>

    <div>
        <div className="nav">
            <Link to={`${match.url}/demo1-1`} activeClassName="selected" exact>我是小demo</Link>
            <Link to={{
            	pathname: `${match.url}/demo1-2`,
                search: '?sort=this-sort',
                hash: '#the-hash',
                state: { fromDashboard: '222' }}
            } 
            activeClassName="selected" exact>我是大DEMO</Link>
        </div>

         
        <Route path={`${match.url}/demo1-1`} component={SmallDemo}/>
        <Route path={`${match.url}/demo1-2`} component={BigDemo}/>
    </div>


export default Demo1;