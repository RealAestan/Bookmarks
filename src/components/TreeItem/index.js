import { Component } from 'preact';
import PropTypes from 'prop-types';
import styles from './style.css';

export default class TreeItem extends Component {
	render() {
		const { primaryText, style, onClick, leftIcon, rightIcon } = this.props;

		return (
			<div
				class={styles.item}
				style={style}
				onClick={onClick}
			>
				{leftIcon}
				<span class={styles.itemTitle}>
					{primaryText}
				</span>
				{rightIcon}
			</div>
		);
	}
}

TreeItem.propTypes = {
	primaryText: PropTypes.string.isRequired,
	style: PropTypes.object.isRequired,
	leftIcon: PropTypes.element,
	rightIcon: PropTypes.element,
	onClick: PropTypes.func
};