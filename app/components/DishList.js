import React from 'react';
import {Link} from 'react-router';
import {isEqual} from 'underscore';
import DishListStore from '../stores/DishListStore';
import DishListActions from '../actions/DishListActions';

class DishList extends React.Component {
  constructor(props) {
    super(props);
    this.state = DishListStore.getState();
    this.onChange = this.onChange.bind(this);
  }

  componentDidMount() {
    DishListStore.listen(this.onChange);
    DishListActions.getDishes(this.props.params);
  }

  componentWillUnmount() {
    DishListStore.unlisten(this.onChange);
  }

  componentDidUpdate(prevProps) {
    if (!isEqual(prevProps.params, this.props.params)) {
      DishListActions.getDishes(this.props.params);
    }
  }

  onChange(state) {
    this.setState(state);
  }

  render() {
    let dishesList = this.state.dishes.map((dish, index) => {
      return (
        <div key={dish.dishId} className='list-group-item animated fadeIn'>
          <div className='media'>
            <span className='position pull-left'>{index + 1}</span>
            <div className='pull-left thumb-lg'>
              <Link to={'/dishes/' + dish.dishId}>
                <img className='media-object' src={'http://www.thecheesecakefactory.com' + dish.image} />
              </Link>
            </div>
            <div className='media-body'>
              <h4 className='media-heading'>
                <Link to={'/dishes/' + dish.dishId}>{dish.name}</Link>
              </h4>
              <small>Description: <strong>{dish.description}</strong></small>
              <br />
              <small>Wins: <strong>{dish.wins}</strong> Losses: <strong>{dish.losses}</strong></small>
            </div>
          </div>
        </div>
      );
    });

    return (
      <div className='container'>
        <div className='list-group'>
          {dishesList}
        </div>
      </div>
    );
  }
}

export default DishList;