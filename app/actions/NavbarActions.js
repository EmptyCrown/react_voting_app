import alt from '../alt';
import {assign} from 'underscore';

class NavbarActions {
  constructor() {
    this.generateActions(
      'updateOnlineUsers',
      'updateAjaxAnimation',
      'updateSearchQuery',
      'getDishCountSuccess',
      'getDishCountFail',
      'findDishSuccess',
      'findDishFail'
    );
  }

  findDish(payload) {
    $.ajax({
      url: '/api/dishes/search',
      data: { name: payload.searchQuery }
    })
      .done((data) => {
        assign(payload, data);
        this.actions.findDishSuccess(payload);
      })
      .fail(() => {
        this.actions.findDishFail(payload);
      });
  }

  getDishCount() {
    $.ajax({ url: '/api/dishes/count' })
      .done((data) => {
        this.actions.getDishCountSuccess(data)
      })
      .fail((jqXhr) => {
        this.actions.getDishCountFail(jqXhr)
      });
  }
}

export default alt.createActions(NavbarActions);