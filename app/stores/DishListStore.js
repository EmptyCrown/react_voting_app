import alt from '../alt';
import DishListActions from '../actions/DishListActions';

class DishListStore {
  constructor() {
    this.bindActions(DishListActions);
    this.dishes = [];
  }

  onGetDishesSuccess(data) {
    this.dishes = data;
  }

  onGetDishesFail(jqXhr) {
    toastr.error(jqXhr.responseJSON.message);
  }
}

export default alt.createStore(DishListStore);