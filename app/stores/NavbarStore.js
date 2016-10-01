import alt from '../alt';
import NavbarActions from '../actions/NavbarActions';

class NavbarStore {
  constructor() {
    this.bindActions(NavbarActions);
    this.totalDishes = 0;
    this.onlineUsers = 0;
    this.searchQuery = '';
    this.ajaxAnimationClass = '';
  }

  onFindDishSuccess(payload) {
    payload.history.pushState(null, '/dishes/' + payload.dishId);
  }

  onFindDishFail(payload) {
    payload.searchForm.classList.add('shake');
    setTimeout(() => {
      payload.searchForm.classList.remove('shake');
    }, 1000);
  }

  onUpdateOnlineUsers(data) {
    this.onlineUsers = data.onlineUsers;
  }

  onUpdateAjaxAnimation(className) {
    this.ajaxAnimationClass = className; //fadein or fadeout
  }

  onUpdateSearchQuery(event) {
    this.searchQuery = event.target.value;
  }

  onGetDishCountSuccess(data) {
    this.totalDishes = data.count;
  }

  onGetDishCountFail(jqXhr) {
    toastr.error(jqXhr.responseJSON.message);
  }
}

export default alt.createStore(NavbarStore);