import alt from '../alt';

class FooterActions {
  constructor() {
    this.generateActions(
      'getTopDishesSuccess',
      'getTopDishesFail'
    );
    // Same as 
    // getTopDishesSuccess(payload) {
    //   this.dispatch(payload);
    // }

    // getTopDishesFail(payload) {
    //   this.dispatch(payload);
    // }
  }

  getTopDishes() {
    $.ajax({ url: '/api/dishes/top' })
      .done((data) => {
        this.actions.getTopDishesSuccess(data)
      })
      .fail((jqXhr) => {
        this.actions.getTopDishesFail(jqXhr)
      });
  }
}

export default alt.createActions(FooterActions);
