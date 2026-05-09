(function (window, document) {
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

	function createElement(tagName, className, text) {
		var element = document.createElement(tagName);
		if (className) element.className = className;
		if (text) element.textContent = text;
		return element;
	}

	function setBackgroundImage(element, image) {
		if (!image) return;
		element.style.backgroundImage = 'url("' + image.replace(/"/g, '') + '")';
	}

	function normalizePath(pathname) {
		return pathname.replace(/\/index\.html$/, '/').replace(/\/$/, '');
	}

	function findCurrentPost() {
		var currentPath = normalizePath(window.location.pathname);
		return posts.filter(function (post) {
			return normalizePath(post.url) === currentPath;
		})[0] || null;
	}

	function getRelativePost(currentPost, direction) {
		var index = posts.indexOf(currentPost);
		if (index === -1 || posts.length < 2) return null;
		var offset = direction === 'prev' ? -1 : 1;
		var nextIndex = (index + offset + posts.length) % posts.length;
		return posts[nextIndex];
	}

	function getMediaLabel(post) {
		return post.mediaLabel || post.navTitle || post.title;
	}

	function applyMedia(element, post, fallbackClassPrefix) {
		var tone = post.mediaTone || 'default';
		element.setAttribute('role', 'img');
		if (post.image) {
			setBackgroundImage(element, post.image);
			element.setAttribute('aria-label', post.imageAlt || post.title);
			return;
		}

		element.className += ' ' + fallbackClassPrefix + '--' + tone;
		element.textContent = getMediaLabel(post);
		element.setAttribute('aria-label', post.imageAlt || post.title);
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

	function renderPostHero(currentPost) {
		var root = document.querySelector('.js-post-hero');
		if (!root || !currentPost) return;

		var image = createElement('figure', 'p-image');
		if (currentPost.image) {
			setBackgroundImage(image, currentPost.image);
		} else {
			image.className += ' post-cover--fallback post-cover--' + (currentPost.mediaTone || 'default');
		}

		root.innerHTML = '';
		root.appendChild(image);
	}

	function createNavCard(post, direction) {
		var card = createElement('div', direction);
		var arrow = createElement('div', 'arrow');
		var icon = document.createElement('i');
		var preview = createElement('div', 'preview');
		var media = createElement('div', (direction === 'prev' ? 'pull-left' : 'pull-right') + ' featuredImg post-nav-media');
		var link = createElement('a', (direction === 'prev' ? 'pull-left' : 'pull-right') + ' preview-content bold');
		var title = createElement('span', '', post.navTitle || post.title);

		card.setAttribute('data-aos', direction === 'prev' ? 'slide-right' : 'slide-left');
		card.setAttribute('data-aos-delay', '1.5s');
		arrow.appendChild(icon);
		icon.className = 'iconfont';
		icon.innerHTML = direction === 'prev' ? '&#xe625;' : '&#xe623;';

		applyMedia(media, post, 'post-nav-media');
		link.href = post.url;
		link.appendChild(title);
		preview.appendChild(media);
		preview.appendChild(link);
		card.appendChild(arrow);
		card.appendChild(preview);

		return card;
	}

	function renderPostNavigation(currentPost) {
		var root = document.querySelector('.js-post-nav');
		var prevPost = currentPost ? getRelativePost(currentPost, 'prev') : null;
		var nextPost = currentPost ? getRelativePost(currentPost, 'next') : null;
		var container = createElement('div');

		if (!root || !prevPost || !nextPost) return;

		container.id = 'NextPrevPosts';
		container.appendChild(createNavCard(prevPost, 'prev'));
		container.appendChild(createNavCard(nextPost, 'next'));
		root.innerHTML = '';
		root.appendChild(container);
	}

	function renderArticleSource(currentPost) {
		var source = document.querySelector('.js-article-source');
		if (!source || !currentPost || !currentPost.sourceHtml) return;
		source.innerHTML = currentPost.sourceHtml;
	}

	function initSearch() {
		if (!input || !results) return;

		renderSearchItems();
		updateSearch('');
		input.addEventListener('input', function () {
			updateSearch(input.value);
		});
	}

	var currentPost = findCurrentPost();

	initSearch();
	renderPostHero(currentPost);
	renderPostNavigation(currentPost);
	renderArticleSource(currentPost);
}(window, document));
