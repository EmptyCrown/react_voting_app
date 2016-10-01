import React from 'react';
import {Link} from 'react-router';
import FooterStore from '../stores/FooterStore'
import FooterActions from '../actions/FooterActions';

class Footer extends React.Component {
  constructor(props) {
    super(props);
    this.state = FooterStore.getState();
    this.onChange = this.onChange.bind(this);
  }

  componentDidMount() {
    FooterStore.listen(this.onChange);
    FooterActions.getTopDishes();
  }

  componentWillUnmount() {
    FooterStore.unlisten(this.onChange);
  }

  onChange(state) {
    this.setState(state);
  }

  render() {
    let leaderboardDishes = this.state.dishes.map((dish) => {
      return (
        <li key={dish.dishId}>
          <Link to={'/dishes/' + dish.dishId}>
            <img className='thumb-md' src={'http://www.thecheesecakefactory.com' + dish.image} />
          </Link>
        </li>
      )
    });

    return (
      <footer>
        <div className='container'>
          <div className='row'>
            <div className='col-sm-5'>
              <h3 className='lead'><strong>Information</strong> and <strong>Copyright</strong></h3>
              <p>© 2015 Sahat Yalkabov.</p>
            </div>
            <div className='col-sm-7 hidden-xs'>
              <h3 className='lead'><strong>Leaderboard</strong> Top 5 Dishes</h3>
              <ul className='list-inline'>
                {leaderboardDishes}
              </ul>
            </div>
          </div>
        </div>
      </footer>
    );
  }
}

export default Footer;