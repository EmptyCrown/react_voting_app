import alt from '../alt';

class DishListActions {
  constructor() {
    this.generateActions(
      'getDishesSuccess',
      'getDishesFail'
    );
  }

  getDishes(payload) {
    let url = '/api/dishes/top';
    let params = {
      name: payload.name,
    };

    // if (payload.category === 'female') {
    //   params.gender = 'female';
    // } else if (payload.category === 'male') {
    //   params.gender = 'male';
    // }

    if (payload.name === 'shame') {
      url = '/api/dishes/shame';
    }

    $.ajax({ url: url, data: params })
      .done((data) => {
        this.actions.getDishesSuccess(data);
      })
      .fail((jqXhr) => {
        this.actions.getDishesFail(jqXhr);
      });
  }
}

export default alt.createActions(DishListActions);
