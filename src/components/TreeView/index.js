import { Component } from 'preact';
import PropTypes from 'prop-types';
import CSSTransitionGroup from 'preact-transition-group';
import TreeItem from '../TreeItem';
import TextField from 'preact-material-components/TextField';
import Icon from 'preact-material-components/Icon';

export default class TreeView extends Component {
	constructor(props) {
		super(props);

		this.state = {
			expandedListItems: [],
			activeListItem: null,
			searchTerm: ''
		};
		this.searchMode = false;
		this.handleTouchTap = this.handleTouchTap.bind(this);
	}
	handleTouchTap(listItem, index) {
		if (this.searchMode && !listItem.children) {
			this.setState({
				activeListItem: index
			});
		}
		else if (listItem.children) {
			const indexOfListItemInArray = this.state.expandedListItems.indexOf(index);
			if  (indexOfListItemInArray === -1) {
				this.setState({
					expandedListItems: this.state.expandedListItems.concat([index])
				});
			}
			else {
				let newArray = [].concat(this.state.expandedListItems);
				newArray.splice(indexOfListItemInArray, 1);
				this.setState({
					expandedListItems: newArray
				});
			}
		}
		else {
			this.setState({
				activeListItem: index
			});
		}

		if (this.searchMode && this.props.handleTouchTapInSearchMode) this.props.handleTouchTapInSearchMode(listItem, index);
		if (!this.searchMode && this.props.handleTouchTap) this.props.handleTouchTap(listItem, index);
	}

	render() {
		// required props
		const { children, listItems, contentKey } = this.props;
		// optional props
		const style = (this.props.style) ? this.props.style : {};
		const startingDepth = (this.props.startingDepth) ? this.props.startingDepth : 1;
		const expandedListItems = (this.props.expandedListItems) ? this.props.expandedListItems : this.state.expandedListItems;
		const activeListItem = (this.props.activeListItem) ? this.props.activeListItem : this.state.activeListItem;
		const listHeight = (this.props.listHeight) ? this.props.listHeight : '48px';
		const { haveSearchBar, handleSearch } = this.props;

		let listItemsModified = listItems
			.map((listItem, i) => {
				listItem._styles ={
					root: {
						paddingLeft: (listItem.depth - startingDepth) * 16,
						backgroundColor: (activeListItem === i) ? 'rgba(0,0,0,0.2)' : null,
						height: listHeight,
						cursor: (listItem.disabled) ? 'not-allowed' : 'pointer',
						color: (listItem.disabled) ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.87)',
						overflow: 'hidden',
						transform: 'translateZ(0)'
					}
				};
				return listItem;
			});
		const searchTerm = (this.props.searchTerm) ? this.props.searchTerm : this.state.searchTerm;
		if (searchTerm) {
			this.searchMode = true;
			listItemsModified = listItemsModified
				.map(tagListItemsWithSearchTerm(searchTerm))
				.map((listItem, i, inputArray) => {
					listItem._shouldRender = (listItem.searchMatched || childIsTaggedWithSearch(listItem, inputArray));
					// highlighting search terms
					if (listItem.highlight) {
						const left = listItem[contentKey].substring(0, listItem.highlight[0]);
						const middle = listItem[contentKey].substring(listItem.highlight[0], listItem.highlight[0] + listItem.highlight[1]);
						const right = listItem[contentKey].substring(listItem.highlight[0] + listItem.highlight[1]);
						listItem._primaryText = <span>{left}<span style={{ display: 'inline-block', backgroundColor: 'rgba(255,235,59,0.5)', padding: '3px' }}>{middle}</span>{right}</span>;
					}
					else {
						listItem._primaryText = listItem[contentKey];
					}
					return listItem;
				});
		}
		else {
			this.searchMode = false;
			listItemsModified = listItemsModified
				.map((listItem) => {
					listItem._shouldRender = (listItem.depth >= startingDepth && parentsAreExpanded(listItem));
					listItem._primaryText = listItem[contentKey];
					return listItem;
				});
		}

		const listItemsJSX = listItemsModified
			.map((listItem, i) => {
				if (listItem._shouldRender) {
					return (
						<TreeItem
							key={'treeViewItem-' + i}
							primaryText={listItem._primaryText}
							style={Object.assign({}, listItem._styles.root)}
							leftIcon={getLeftIcon(listItem, this.props.useFolderIcons)}
							rightIcon={(!listItem.children) ? null : (expandedListItems.indexOf(i) === -1) ? <Icon>expand_more</Icon> : <Icon>expand_less</Icon>}
							onClick={() => {
								if (listItem.disabled) return;
								this.handleTouchTap(listItem, i);
							}}
						/>
					);
				}
				return null;
				
			});

		const styles = {
			root: {
				padding: 0,
				paddingBottom: 8,
				paddingTop: (children) ? 0 : 8
			}
		};
		return (
			<div style={Object.assign({}, styles.root, style)}>
				{children}
				{haveSearchBar &&
				<form
					style={{ padding: '0px 16px' }}
					onSubmit={(e) => {
						e.preventDefault();
						if (handleSearch) {
							handleSearch(document.getElementById('searchfield').value);
						}
						else {
							this.setState({ searchTerm: document.getElementById('searchfield').value });
						}
						document.getElementById('searchfield').value = '';
					}}
				>
					<TextField
						label="Search"
						fullWidth
						id="searchfield"
					/>
				</form>}
				<CSSTransitionGroup transitionName="tree-list" transitionEnterTimeout={300} transitionLeaveTimeout={150}>
					{listItemsJSX}
				</CSSTransitionGroup>
			</div>
		);


		function getLeftIcon(listItem, useFolderIcons) {
			if (useFolderIcons) {
				if (listItem.children) {
					return <Icon>folder</Icon>;
				}
				return <Icon>link</Icon>;

			}
			return listItem.icon;
			
		}

		function parentsAreExpanded(listItem) {
			if (listItem.depth > startingDepth) {
				if (expandedListItems.indexOf(listItem.parentIndex) === -1) {
					return false;
				}
				const parent = listItems.filter((_listItem, index) => index === listItem.parentIndex)[0];
				return parentsAreExpanded(parent);
				
			}
			return true;
			
		}

		function tagListItemsWithSearchTerm(searchTerm, listItem) {
			const f = (listItem) => {
				const searchTerms = searchTerm.split(' ');
				let match = false;
				let matchIndex = null, matchTermLength = null;

				if (searchTerms[0] !== '') {
					searchTerms.forEach((searchTerm) => {
						const content = (listItem[contentKey]) ? listItem[contentKey] : '';
						matchIndex = content.toLowerCase().indexOf(searchTerm.toLowerCase());
						if (matchIndex !== -1) {
							match = true;
							matchTermLength = searchTerm.length;
						}
					});
				}

				if (match) {
					return Object.assign({}, listItem, { searchMatched: true, highlight: [matchIndex, matchTermLength] });
				}
				return listItem;
				
			};

			if (listItem) {
				return f(listItem);
			}
			return f;
			
		}

		function childIsTaggedWithSearch(listItem, listItems) {
			if (listItem.children) {
				for (let i = 0; i < listItem.children.length; i++) {
					if (listItems[listItem.children[i]].searchMatched) {
						return true;
					}
				}
			}
		}
	}
}

TreeView.contextTypes = {
	muiTheme: PropTypes.object
};

TreeView.propTypes = {
	listItems: PropTypes.array.isRequired,
	contentKey: PropTypes.string.isRequired,
	style: PropTypes.object,
	expandedListItems: PropTypes.array,
	activeListItem: PropTypes.number,
	handleTouchTap: PropTypes.func,
	handleTouchTapInSearchMode: PropTypes.func,
	handleSearch: PropTypes.func,
	listHeight: PropTypes.number,
	useFolderIcons: PropTypes.bool,
	haveSearchBar: PropTypes.bool,
	searchTerm: PropTypes.string,
	startingDepth: PropTypes.number
};