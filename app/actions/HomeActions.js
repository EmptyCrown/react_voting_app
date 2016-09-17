import alt from '../alt';

class HomeActions {
  constructor() {
    this.generateActions(
      'getTwoDishesSuccess',
      'getTwoDishesFail',
      'voteFail'
    );
  }

  getTwoDishes() {
    $.ajax({ url: '/api/dishes' })
      .done(data => {
        this.actions.getTwoDishesSuccess(data);
      })
      .fail(jqXhr => {
        this.actions.getTwoDishesFail(jqXhr.responseJSON.message);
      });
  }

  vote(winner, loser) {
    $.ajax({
      type: 'PUT',
      url: '/api/dishes' ,
      data: { winner: winner, loser: loser }
    })
      .done(() => {
        this.actions.getTwoDishes();
      })
      .fail((jqXhr) => {
        this.actions.voteFail(jqXhr.responseJSON.message);
      });
  }
}

export default alt.createActions(HomeActions);