/*
*	Source Belongs to: https://github.com/danielireson/google-sheets-blog-cms/blob/master/src/js/main.js
*	I am just borrowing it.. ;)
*/
const app = function (){
	const API_BASE = 'https://script.google.com/macros/s/AKfycbzBkKUKkv5Usp6e507GKa78hrpfvUVXpZ0bYzX21jnYz5ZysAjF/exec';
	const API_KEY = 'abcde12345';
	const CATEGORIES = ['Programming', 'Science', 'Finance', 'Education', 'Philosophy', 'Life'];
	const state = {activePage: 1, activeCategory: null};
	const page = {};

	function init () {
		page.notice = document.getElementById('notice');
		page.filter = document.getElementById('filter_category');
                page.filter2 = document.getElementById('filter_recent');
		page.container = document.getElementById('container');

		_buildFilter();
		_getNewPosts();
	}

	function _getNewPosts () {
		page.container.innerHTML = '';
		_getPosts();
	}

	function _getPosts () {
		_setNotice('Loading posts');

		fetch(_buildApiUrl(state.activePage, state.activeCategory))
			.then((response) => response.json())
			.then((json) => {
				if (json.status !== 'success') {
					_setNotice(json.message);
				}

				_renderPosts(json.data);
				_renderPostsPagination(json.pages);
			})
			.catch((error) => {
				_setNotice('Unexpected error loading posts');
			})
	}

	function _buildFilter () {
	    //page.filter.appendChild(_buildFilterLink('no filter', true));
	    page.filter.innerHTML = "Category"
	    var list = document.createElement('ul');
	    CATEGORIES.forEach(function (category) {
		list.appendChild(_buildFilterLink(category, false));
	    });
	    page.filter.appendChild(list);
	}

	function _buildFilterLink (label, isSelected) {
		//const link = document.createElement('button');
		const link = document.createElement('a');
	  	link.innerHTML = _capitalize(label);
	  	link.classList = isSelected ? 'selected' : '';
	  	link.onclick = function (event) {
	  		let category = label === 'no filter' ? null : label.toLowerCase();

			_resetActivePage();
	  		_setActiveCategory(category);
	  		_getNewPosts();
	  	};
		var item = document.createElement('li');
		item.appendChild(link);
	  	return item;
	}

	function _buildApiUrl (page, category) {
		let url = API_BASE;
		url += '?key=' + API_KEY;
		url += '&page=' + page;
		url += category !== null ? '&category=' + category : '';

		return url;
	}

	function _setNotice (label) {
		page.notice.innerHTML = label;
	}

	function _renderPosts (posts) {
		posts.forEach(function (post) {
			const article = document.createElement('article');
			article.innerHTML = `
				<h1>${post.title}</h1>
				<div class="article-details">
					<div>By ${post.author} on ${_formatDate(post.timestamp)}</div>
					<div>Posted in ${post.category}</div>
				</div>
				${_formatContent(post.content)}
			`;
			page.container.appendChild(article);
		});
	}

	function _renderPostsPagination (pages) {
		if (pages.next) {
			const link = document.createElement('button');
			link.innerHTML = 'Load more posts';
			link.onclick = function (event) {
				_incrementActivePage();
				_getPosts();
			};

			page.notice.innerHTML = '';
			page.notice.appendChild(link);
		} else {
			_setNotice('No more posts to display');
		}
	}

	function _formatDate (string) {
		return new Date(string).toLocaleDateString('en-GB');
	}

	function _formatContent (string) {
		return string.split('\n')
			.filter((str) => str !== '')
			.map((str) => `<p>${str}</p>`)
			.join('');
	}

	function _capitalize (label) {
		return label.slice(0, 1).toUpperCase() + label.slice(1).toLowerCase();
	}

	function _resetActivePage () {
		state.activePage = 1;
	}

	function _incrementActivePage () {
		state.activePage += 1;
	}

	function _setActiveCategory (category) {
		state.activeCategory = category;
		
		const label = category === null ? 'no filter' : category;
		Array.from(page.filter.children).forEach(function (element) {
  			element.classList = label === element.innerHTML.toLowerCase() ? 'selected' : '';
  		});
	}

	return {
		init: init
 	};
}();

