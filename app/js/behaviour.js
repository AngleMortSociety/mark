
// Node.js require's
var fs = require('fs');
var path = require('path');
var gui = require('nw.gui');
var win = gui.Window.get();

$(document).ready(function() {
	win.on('devtools-opened', function(event) {
		$('.btn-dev-tools > span:first-child').addClass('fa-chevron-down');
	});

	win.on('devtools-closed', function(event) {
		$('.btn-dev-tools > span:first-child').removeClass('fa-chevron-down');
	});

	$('.btn-set-gfm').click(function(event) {
		$(this).children('span:first-child').toggleClass('fa-chevron-down');

		if($(this).children('span:first-child').hasClass('fa-chevron-down')) {
			marked.setOptions({
				gfm: true,
				tables: true
			});
			if(datas != '') {
				openFile(win, document.title);
			}
		}
		else {
			marked.setOptions({
				gfm: false,
				tables: false
			});
			if(datas != '') {
				openFile(win, document.title);
			}
		}
	});

	$('.btn-set-mmd').click(function(event) {
		$(this).children('span:first-child').toggleClass('fa-chevron-down');

		if($(this).children('span:first-child').hasClass('fa-chevron-down')) {
			// Active mmd
		}
		else {
			// Disable mmd
		}
	});

	$('.btn-dev-tools').click(function(event) {
		$(this).children('span:first-child').toggleClass('fa-chevron-down');

		if($(this).children('span:first-child').hasClass('fa-chevron-down')) {
			win.showDevTools();
		}
		else {
			win.closeDevTools();
		}
	});

	$('.btn-set-ontop').click(function(event) {
		$(this).children('span:first-child').toggleClass('fa-chevron-down');

		if($(this).children('span:first-child').hasClass('fa-chevron-down')) {
			win.setAlwaysOnTop(true);
		}
		else {
			win.setAlwaysOnTop(false);
		}
	});

	$('.btn-wth-file').click(function(event) {
		if(fs.existsSync(document.title)) {
			// TODO : scrolltop don't work.
			var scrollTop = $(window).scrollTop();
			$(this).children('span:first-child').toggleClass('fa-chevron-down');

			if($(this).children('span:first-child').hasClass('fa-chevron-down')) {
				openFile(win, document.title);

				$(window).scrollTop(scrollTop);

				fs.watchFile(document.title, { persistent: true, interval: 600 }, function (curr, prev) {
					openFile(win, document.title);
				});
			}
			else {
				fs.unwatchFile(document.title);
			}
		}
	});

});