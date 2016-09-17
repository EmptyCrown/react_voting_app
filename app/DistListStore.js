import alt from '../alt';
import DishListActions from '../actions/DishListActions';

class DishListStore {
  constructor() {
    this.bindActions(DishListActions);
    this.dishes = [];
  }

  onGetCharactersSuccess(data) {
    this.dishes = data;
  }

  onGetCharactersFail(jqXhr) {
    toastr.error(jqXhr.responseJSON.message);
  }
}

export default alt.createStore(DishListStore);