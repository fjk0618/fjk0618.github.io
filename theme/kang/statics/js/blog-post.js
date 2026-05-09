(function () {
	var input = document.getElementById('post-search-input');
	var results = document.getElementById('post-search-results');
	var note = document.getElementById('post-search-note');
	var items = results ? Array.prototype.slice.call(results.querySelectorAll('li[data-post-search]')) : [];

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

	updateSearch('');
	input.addEventListener('input', function () {
		updateSearch(input.value);
	});
}());
