(function () {
	var input = document.getElementById('post-search-input');
	var results = document.getElementById('post-search-results');
	var note = document.getElementById('post-search-note');
	var posts = window.FJK_POSTS || [];
	var items = [];

	function getSearchText(post) {
		return [
			post.title,
			post.excerpt,
			post.date,
			(post.tags || []).join(' '),
			post.keywords
		].join(' ').toLowerCase();
	}

	function createSearchItem(post) {
		var item = document.createElement('li');
		var anchor = document.createElement('a');

		item.dataset.postSearch = getSearchText(post);
		anchor.href = post.url;
		anchor.textContent = post.title;
		item.appendChild(anchor);

		return item;
	}

	function renderSearchItems() {
		if (!results) return;

		if (posts.length) {
			results.innerHTML = '';
			posts.forEach(function (post) {
				results.appendChild(createSearchItem(post));
			});
		}

		items = Array.prototype.slice.call(results.querySelectorAll('li[data-post-search]'));
	}

	function updateSearch(query) {
		var normalized = query.trim().toLowerCase();
		var matched = items.filter(function (item) {
			return !normalized || item.dataset.postSearch.indexOf(normalized) !== -1;
		});

		items.forEach(function (item) {
			item.classList.toggle('is-filtered', matched.indexOf(item) === -1);
		});

		if (!note) return;

		if (!normalized) {
			note.textContent = '输入关键词后，选择要跳转的文章。';
			return;
		}

		note.textContent = matched.length ? matched.length + ' 篇匹配结果' : '没有找到匹配文章';
	}

	if (!input || !results) return;

	renderSearchItems();
	updateSearch('');
	input.addEventListener('input', function () {
		updateSearch(input.value);
	});
}());
