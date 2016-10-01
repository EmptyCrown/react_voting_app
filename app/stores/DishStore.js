import {assign, contains} from 'underscore';
import alt from '../alt';
import DishActions from '../actions/DishActions';

class DishStore {
  constructor() {
    this.bindActions(DishActions);
    this.dishId = 0;
    this.name = 'TBD';
    this.description = 'TBD';
    this.image = 'TBD';
    this.link = 'TBD';
    this.wins = 0;
    this.losses = 0;
    this.winLossRatio = 0;
    this.isReported = false;
  }

  onGetDishSuccess(data) {
    assign(this, data);
    $(document.body).attr('class', 'profile cheesecakefactory');
    let localData = localStorage.getItem('FV') ? JSON.parse(localStorage.getItem('FV')) : {};
    let reports = localData.reports || [];
    this.isReported = contains(reports, this.dishId);
    // If is NaN (from division by zero) then set it to "0"
    this.winLossRatio = ((this.wins / (this.wins + this.losses) * 100) || 0).toFixed(1);
  }

  onGetDishFail(jqXhr) {
    toastr.error(jqXhr.responseJSON.message);
  }

  onReportSuccess() {
    this.isReported = true;
    let localData = localStorage.getItem('FV') ? JSON.parse(localStorage.getItem('FV')) : {};
    localData.reports = localData.reports || [];
    localData.reports.push(this.dishId);
    localStorage.setItem('FV', JSON.stringify(localData));
    toastr.warning('Dish has been reported.');
  }

  onReportFail(jqXhr) {
    toastr.error(jqXhr.responseJSON.message);
  }
}

export default alt.createStore(DishStore);