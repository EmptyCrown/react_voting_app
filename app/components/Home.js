import React from 'react';
import {Link} from 'react-router';
import HomeStore from '../stores/HomeStore'
import HomeActions from '../actions/HomeActions';
import {first, without, findWhere} from 'underscore';

class Home extends React.Component {

  constructor(props) {
    super(props);
    this.state = HomeStore.getState();
    this.onChange = this.onChange.bind(this);
  }

  componentDidMount() {
    HomeStore.listen(this.onChange);
    HomeActions.getTwoDishes();
  }

  componentWillUnmount() {
    HomeStore.unlisten(this.onChange);
  }

  onChange(state) {
    this.setState(state);
  }

  handleClick(dish) {
    var winner = dish.dishId;
    var loser = first(without(this.state.dishes, findWhere(this.state.dishes, { dishId: winner }))).dishId;
    HomeActions.vote(winner, loser);
  }

  render() {
    var dishNodes = this.state.dishes.map((dish, index) => {
      return (
        <div key={dish.dishId} className={index === 0 ? 'col-xs-6 col-sm-6 col-md-5 col-md-offset-1' : 'col-xs-6 col-sm-6 col-md-5'}>
          <div className='thumbnail fadeInUp animated'>
            <img onClick={this.handleClick.bind(this, dish)} src={'http://www.thecheesecakefactory.com' + dish.image}/>
            <div className='caption text-center'>
              <h4>
                <Link to={'/dishes/' + dish.dishId}><strong>{dish.name}</strong></Link>
              </h4>
            </div>
          </div>
        </div>
      );
    });

    return (
      <div className='container'>
        <h3 className='text-center'>Select your favorite dish.</h3>
        <div className='row'>
          {dishNodes}
        </div>
      </div>
    );
  }
}

export default Home;
