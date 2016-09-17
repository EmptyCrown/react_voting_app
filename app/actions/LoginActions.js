import alt from '../alt';
import {assign} from 'underscore';

class LoginActions {
	constructor() {
	  this.generateActions(
	    'updateUsername',
	    'updatePassword',
	    'tryLoginSuccess',
	    'tryLoginFail'
	  );
	}

	tryLogin(payload) {
		$.ajax({
			type: 'POST',
      url: '/api/login',
      data: { username: payload.username, password: payload.password }
    })
      .done((data) => {
        this.actions.tryLoginSuccess(payload);
      })
      .fail(() => {
      	console.log('yay');
        this.actions.tryLoginFail(payload);
      });
	}
}

export default alt.createActions(LoginActions);