/*
	Future Trading Capital - Minimal JS
	Handles menu toggle and page preload
*/

(function() {
	'use strict';

	// Remove preload class after page loads
	window.addEventListener('load', function() {
		setTimeout(function() {
			document.body.classList.remove('is-preload');
		}, 100);
	});

	// Wait for DOM to be ready before setting up menu
	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', initMenu);
	} else {
		initMenu();
	}

	function initMenu() {
		// Menu functionality
		const menu = document.getElementById('menu');
		const body = document.body;

		if (!menu) {
			console.error('Menu element not found!');
			return;
		}

		let menuLocked = false;

		// Move menu to body (so it doesn't get blurred with page-wrapper)
		body.appendChild(menu);

		// Lock mechanism to prevent rapid toggling
		function lockMenu() {
			if (menuLocked) return false;
			menuLocked = true;
			setTimeout(function() {
				menuLocked = false;
			}, 350);
			return true;
		}

		// Toggle menu visibility
		function toggleMenu() {
			if (lockMenu()) {
				body.classList.toggle('is-menu-visible');
			}
		}

		// Hide menu
		function hideMenu() {
			if (lockMenu()) {
				body.classList.remove('is-menu-visible');
			}
		}

		// Menu button click handler
		document.addEventListener('click', function(e) {
			// Check if clicked element or its parent is the menu link
			const menuLink = e.target.closest('a[href="#menu"]');
			if (menuLink) {
				e.preventDefault();
				e.stopPropagation();
				toggleMenu();
				return;
			}

			// Close menu when clicking outside
			if (body.classList.contains('is-menu-visible') && !e.target.closest('#menu .inner')) {
				hideMenu();
			}
		});

		// Close button handler
		const closeButton = menu.querySelector('.close');
		if (closeButton) {
			closeButton.addEventListener('click', function(e) {
				e.preventDefault();
				hideMenu();
			});
		}

		// Menu link click handler (close menu and navigate)
		const menuLinks = menu.querySelectorAll('.inner a:not(.close)');
		menuLinks.forEach(function(link) {
			link.addEventListener('click', function(e) {
				e.preventDefault();
				const href = this.getAttribute('href');
				hideMenu();

				// Navigate after menu closes
				setTimeout(function() {
					window.location.href = href;
				}, 350);
			});
		});

		// Close menu on Escape key
		document.addEventListener('keydown', function(e) {
			if (e.key === 'Escape' && body.classList.contains('is-menu-visible')) {
				hideMenu();
			}
		});
	}

})();
