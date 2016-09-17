import React from 'react';
import {Route} from 'react-router';
import App from './components/App';
import Home from './components/Home';
import AddDish from './components/AddDish';
import Dish from './components/Dish';
import DishList from './components/DishList';
import Stats from './components/Stats';
import Login from './components/Login';

export default (
  <Route component={App}>
    <Route path='/' component={Home} />
    <Route path='/add' component={AddDish} />
    <Route path='/dishes/:id' component={Dish} />
    <Route path='/stats' component={Stats} />
    <Route path='/login' component={Login} />
    <Route path=':name' component={DishList}>
  </Route>
);