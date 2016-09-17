import alt from '../alt';
import LoginActions from '../actions/LoginActions';

class LoginStore {
  constructor() {
    this.bindActions(LoginActions);
    this.username = '';
    this.password = '';
  }

  onTryLoginSuccess(payload) {
    
  }

  onTryLoginFail(payload) {
    console.log(payload);
    payload.loginForm.classList.add('shake');
    setTimeout(() => {
      payload.loginForm.classList.remove('shake');
    }, 1000);
  }

  onUpdateUsername(event) {
    this.username = event.target.value;
  }

  onUpdatePassword(event) {
    this.password = event.target.value;
  }
}

export default alt.createStore(LoginStore);