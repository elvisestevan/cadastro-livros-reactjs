import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import './index.css';
import App from './App';
import AutorBox from "./Autor";
import Home from "./Home";
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(
    (<Router>
        <App>            
            <Switch>
                <Route exact path="/" component={Home} />
                <Route path="/autores" component={AutorBox} />
            </Switch>            
        </App>
    </Router>),
    document.getElementById('root'));
registerServiceWorker();
