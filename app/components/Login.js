import React from 'react';
import ReactDOM from 'react-dom';
import LoginStore from '../stores/LoginStore';
import LoginActions from '../actions/LoginActions';
import { Form, FormGroup, FormControl, Col, ControlLabel, Checkbox, Button } from 'react-bootstrap';

class Login extends React.Component {
	constructor(props) {
	  super(props);
	  this.state = LoginStore.getState();
	  this.onChange = this.onChange.bind(this);
	}

	componentDidMount() {
	  LoginStore.listen(this.onChange);
	}

	componentWillUnmount() {
	  LoginStore.unlisten(this.onChange);
	}


	onChange(state) {
	  this.setState(state);
	}

	handleSubmit(event) {

	  event.preventDefault();

	  let username = this.state.username;
	  let password = this.state.password;

	  console.log(this.state.username);
	  console.log(this.state.password);

	  if (username && password) {
	    LoginActions.tryLogin({
	      username: username,
	      password: password,
	      loginForm: ReactDOM.findDOMNode(this.refs.loginForm)
	    });
	  }
	}

	render () {
		return (
			<Form horizontal onSubmit={this.handleSubmit.bind(this)}>
			    <FormGroup controlId="formHorizontalEmail">
			      <Col componentClass={ControlLabel} sm={2}>
			        Email
			      </Col>
			      <Col sm={10} style={{width: 300}}>
			        <FormControl type="email" placeholder="Email"  value={this.state.username} onChange={LoginActions.updateUsername}/>
			      </Col>
			    </FormGroup>

			    <FormGroup controlId="formHorizontalPassword">
			      <Col componentClass={ControlLabel} sm={2}>
			        Password
			      </Col>
			      <Col sm={10} style={{width: 300}}>
			        <FormControl ref='loginForm' onSubmit={this.handleSubmit.bind(this)} type="password" placeholder="Password" value={this.state.password} onChange={LoginActions.updatePassword}/>
			      </Col>
			    </FormGroup>

			    <FormGroup>
			      <Col smOffset={2} sm={10}>
			        <Checkbox>Remember me</Checkbox>
			      </Col>
			    </FormGroup>

			    <FormGroup>
			      <Col smOffset={2} sm={10}>
			        <Button type="submit">
			          Sign in
			        </Button>
			      </Col>
			    </FormGroup>
			  </Form>
			// <form ref='loginForm' className='animated' onSubmit={this.handleSubmit.bind(this)} style={{width: 200, margin: 0}}>
			//   <div className='input-group'>
			//     <input type='text' className='form-control' placeholder='Username' value={this.state.username} onChange={LoginActions.updateUsername} style={{width: 130}} />
			//   </div>
			//   <div className='input-group'>
			//     <input type='text' className='form-control' placeholder='Password' value={this.state.password} onChange={LoginActions.updatePassword} style={{width: 130}} />
			//   </div>
			//   <div className='input-group-btn'>
		 //      <button className='btn btn-default' onClick={this.handleSubmit.bind(this)}><span className='glyphicon glyphicon-user'></span></button>
		 //    </div>
			// </form>
		);
	}
}

export default Login;