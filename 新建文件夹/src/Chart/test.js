import React from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

function App() {
  return (
    <Router>
      <div>
        <Header />

        <Route exact path="/" component={Home} />
        <Route path="/about" component={About} />
        <Route path="/topics" component={Topics} />
      </div>
    </Router>
  );
}

function Home() {
  return <h2>Home</h2>;
}

function About() {
  return <h2>About</h2>;
}

function Topic({ match }) {
  return <h3>123</h3>;
}

function Topics({ match }) {
  return (
    <div>
      <h2>Topics</h2>
      <Route
        exact
        path={match.path}
        render={() => <h3>Please select a topic.</h3>}
      />
    </div>
  );
}

function Header() {
  return (
    <ul>
      <li>
        <Link to="/">1231</Link>
      </li>
      <li>
        <Link to="/about">000000</Link>
      </li>
      <li>
        <Link to="/topics">sadsadas</Link>
      </li>
    </ul>
  );
}

export default App;