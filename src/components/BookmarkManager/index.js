import React, { Component } from 'react';
import TreeView from '../TreeView';

const listItems = [{
	title: 'Item 1',
	depth: 1,
	disabled: false
}, {
	title: 'Item 2',
	depth: 1,
	disabled: false
}, {
	title: 'Item 3',
	depth: 1,
	children: [3],
	disabled: false
}, {
	title: 'Item 3.1',
	depth: 2,
	children: [4],
	parentIndex: 2,
	disabled: false
}, {
	title: 'Item 3.1.1',
	depth: 3,
	parentIndex: 3,
	disabled: false
}, {
	title: 'Item 4',
	depth: 1,
	disabled: false
}];

export default class BookmarkManager extends Component {
	render() {
		return (
			<div>
				<TreeView
					listItems={listItems}
					contentKey={'title'}
					useFolderIcons
					haveSearchBar
				/>
			</div>
		);
	}
}