import alt from '../alt';

class DishActions {
  constructor() {
    this.generateActions(
      'reportSuccess',
      'reportFail',
      'getDishSuccess',
      'getDishFail'
    );
  }

  getDish(dishId) {
    $.ajax({ url: '/api/dishes/' + dishId })
      .done((data) => {
        this.actions.getDishSuccess(data);
      })
      .fail((jqXhr) => {
        this.actions.getDishFail(jqXhr);
      });
  }

  report(dishId) {
    $.ajax({
      type: 'POST',
      url: '/api/report',
      data: { dishId: dishId }
    })
      .done(() => {
        this.actions.reportSuccess();
      })
      .fail((jqXhr) => {
        this.actions.reportFail(jqXhr);
      });
  }
}

export default alt.createActions(DishActions);
