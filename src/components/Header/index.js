import { Component } from 'preact';
import { route } from 'preact-router';
import TopAppBar from 'preact-material-components/TopAppBar';
import Drawer from 'preact-material-components/Drawer';
import List from 'preact-material-components/List';
import Switch from 'preact-material-components/Switch';
import 'preact-material-components/Switch/style.css';
import 'preact-material-components/Drawer/style.css';
import 'preact-material-components/List/style.css';
import 'preact-material-components/TopAppBar/style.css';
import style from './style';

export default class Header extends Component {
	closeDrawer() {
		this.drawer.MDComponent.open = false;
		this.state = {
			darkThemeEnabled: false
		};
	}

	openDrawer = () => (this.drawer.MDComponent.open = true);

	drawerRef = drawer => (this.drawer = drawer);

	linkTo = path => () => {
		route(path);
		this.closeDrawer();
	};

	goHome = this.linkTo('/');
	goToMyProfile = this.linkTo('/profile');

	toggleDarkTheme = () => {
		this.setState(
			{
				darkThemeEnabled: !this.state.darkThemeEnabled
			},
			() => {
				if (this.state.darkThemeEnabled) {
					document.body.classList.add('mdc-theme--dark');
				}
				else {
					document.body.classList.remove('mdc-theme--dark');
				}
			}
		);
	}

	render() {
		return (
			<div>
				<TopAppBar className="topappbar">
					<TopAppBar.Row>
						<TopAppBar.Section align-start>
							<TopAppBar.Icon onClick={this.openDrawer} navigation>menu</TopAppBar.Icon>
							<TopAppBar.Title>
								Bookmarks
							</TopAppBar.Title>
						</TopAppBar.Section>
						<TopAppBar.Section align-end>
							<label class={style.forSwitchDarkMode} htmlFor="switch-dark-mode">Dark mode</label>
							<Switch id="switch-dark-mode" onClick={this.toggleDarkTheme} />
						</TopAppBar.Section>
					</TopAppBar.Row>
				</TopAppBar>
				<Drawer.TemporaryDrawer ref={this.drawerRef}>
					<Drawer.DrawerItem onClick={this.goHome}>
						<List.ItemGraphic>home</List.ItemGraphic>
						Home
					</Drawer.DrawerItem>
					<Drawer.DrawerItem onClick={this.goToMyProfile}>
						<List.ItemGraphic>account_circle</List.ItemGraphic>
						Profile
					</Drawer.DrawerItem>
				</Drawer.TemporaryDrawer>
			</div>
		);
	}
}
