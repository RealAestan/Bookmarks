import { Component } from 'preact';
import TextField from 'preact-material-components/TextField';
import 'preact-material-components/TextField/style.css';
import Button from 'preact-material-components/Button';
import 'preact-material-components/Button/style.css';
import style from './style.css';

export default class Login extends Component {
	render() {
		return (
			<div class={style.loginWrapper}>
				<i class={style.logo + ' material-icons'}>collections_bookmark</i>
				<TextField id="loginUsername" leadingIcon="account_box" label="Username" />
				<TextField id="loginPassword" leadingIcon="vpn_key" type="password" label="Password" />
				<Button raised class={style.loginButton +  ' mdc-theme--primary-bg'}>Login</Button>
			</div>
		);
	}
}