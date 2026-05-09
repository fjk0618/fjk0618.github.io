(function (window, document) {
	'use strict';

	var posts = window.FJK_POSTS || [];
	var root = document.getElementById('home-posts-root');
	var form = document.querySelector('.js-search');
	var input = document.getElementById('home-search-input');
	var results = document.getElementById('home-search-results');
	var note = document.getElementById('home-search-note');
	var renderedPosts = [];

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

	function getSearchText(post) {
		return [
			post.title,
			post.excerpt,
			post.date,
			(post.tags || []).join(' '),
			post.keywords
		].join(' ').toLowerCase();
	}

	function createMedia(post) {
		var image = createElement('div', 'review-item-img');
		var bg = createElement('div', 'bg-blur');
		var tone = post.mediaTone || 'default';

		if (post.image) {
			setBackgroundImage(image, post.image);
			setBackgroundImage(bg, post.image);
			image.setAttribute('role', 'img');
			image.setAttribute('aria-label', post.imageAlt || post.title);
		} else {
			image.className += ' home-post-card-icon home-post-card-icon--' + tone;
			bg.className += ' home-post-bg home-post-bg--' + tone;
			image.textContent = post.mediaLabel || 'POST';
			image.setAttribute('role', 'img');
			image.setAttribute('aria-label', post.imageAlt || post.title);
		}

		return {
			image: image,
			background: bg
		};
	}

	function createPostCard(post) {
		var wrapper = createElement('div', 'post post-layout-list js-home-post');
		var review = createElement('div', 'postnormal review');
		var reviewContainer = createElement('div', 'post-container review-item');
		var row = createElement('div', 'row review-item-wrapper');
		var imageCol = createElement('div', 'col-sm-3');
		var contentCol = createElement('div', 'col-sm-9 flex-xs-middle');
		var imageLink = createElement('a');
		var title = createElement('div', 'review-item-title');
		var titleLink = createElement('a');
		var date = createElement('div', 'review-item-creator');
		var tags = createElement('span', 'review-item-info');
		var bgWrapper = createElement('div', 'review-bg-wrapper');
		var bodyContainer = createElement('div', 'post-container');
		var entry = createElement('div', 'entry-content', post.excerpt);
		var footer = createElement('div', 'post-footer');
		var readMore = createElement('a', 'gaz-btn primary', 'READ MORE');
		var footerTags = createElement('span', 'post-tags pull-right', post.footerTags || (post.tags || []).join(' · '));
		var media = createMedia(post);

		wrapper.setAttribute('data-aos', 'fade-up');
		wrapper.setAttribute('data-searchable', 'true');
		wrapper.dataset.search = getSearchText(post);

		imageLink.href = post.url;
		imageLink.rel = 'nofollow';
		imageLink.appendChild(media.image);
		imageCol.appendChild(imageLink);

		titleLink.href = post.url;
		titleLink.rel = 'bookmark';
		titleLink.textContent = post.title;
		title.appendChild(titleLink);

		date.innerHTML = '<b>发布日期：</b>' + post.date;
		tags.innerHTML = '<b>标签：</b>' + (post.tags || []).join(' / ');

		contentCol.appendChild(title);
		contentCol.appendChild(date);
		contentCol.appendChild(tags);
		row.appendChild(imageCol);
		row.appendChild(contentCol);
		reviewContainer.appendChild(row);

		bgWrapper.appendChild(media.background);
		reviewContainer.appendChild(bgWrapper);

		readMore.href = post.url;
		footer.appendChild(readMore);
		footer.appendChild(footerTags);
		bodyContainer.appendChild(entry);
		bodyContainer.appendChild(footer);

		review.appendChild(reviewContainer);
		review.appendChild(bodyContainer);
		wrapper.appendChild(review);

		return wrapper;
	}

	function createResult(post) {
		var item = document.createElement('li');
		var anchor = document.createElement('a');
		anchor.href = post.url;
		anchor.textContent = post.title;
		item.appendChild(anchor);
		return item;
	}

	function updateSearch(query) {
		var normalized = query.trim().toLowerCase();
		var matched = posts.filter(function (post) {
			return !normalized || getSearchText(post).indexOf(normalized) !== -1;
		});

		renderedPosts.forEach(function (entry) {
			entry.element.classList.toggle('is-filtered', matched.indexOf(entry.post) === -1);
		});

		if (!results || !note) return;

		results.innerHTML = '';
		if (!normalized) {
			note.textContent = '输入关键词后，首页文章列表会同步筛选。';
			return;
		}

		note.textContent = matched.length ? matched.length + ' 篇匹配结果' : '没有找到匹配文章';
		(matched.length ? matched : []).forEach(function (post) {
			results.appendChild(createResult(post));
		});

		if (!matched.length) {
			var empty = document.createElement('li');
			var label = document.createElement('a');
			label.href = 'javascript:void(0)';
			label.textContent = '没有找到匹配文章';
			empty.appendChild(label);
			results.appendChild(empty);
		}
	}

	function renderPosts() {
		if (!root) return;

		root.innerHTML = '';
		renderedPosts = posts.map(function (post) {
			var element = createPostCard(post);
			root.appendChild(element);
			return {
				post: post,
				element: element
			};
		});

		if (!posts.length) {
			root.appendChild(createElement('p', 'home-posts-empty', '还没有文章。'));
		}
	}

	renderPosts();

	if (form && input) {
		form.addEventListener('submit', function (event) {
			event.preventDefault();
			updateSearch(input.value);
		});

		input.addEventListener('input', function () {
			updateSearch(input.value);
		});
	}
}(window, document));
