
// Node.js require's
var fs = require('fs');
var path = require('path');
var gui = require('nw.gui');
var win = gui.Window.get();
var marked = require('marked');
// TODO : mmd don't work.
//var mmd = require('mmd');
//var html = mmd.convert('# Look Ma!');

// Third party modules
var WindowManager = require('node-webkit-window-manager').windowManager;

var extensions = ['.markdown', '.mdown', '.mkdn', '.md', '.mkd', '.mdwn', '.mdtxt', '.mdtext', '.text'];
var encoding = 'utf8';
var mainHTML = 'index.html';
var datas = '';
var Windows = {};

window.ondragover = window.ondrop = function(event) {
	event.preventDefault();
	return false;
}

this.ondrop = function(e) {
	e.preventDefault();

	var h = 0;

	for (var i = e.dataTransfer.files.length - 1 ; i >= 0 ; i--) {
		Windows['myWindow-' + i] = {
			page: mainHTML,
			options: {
				frame: true,
				toolbar: false,
				width: 1024,
				height: 720,
				show: true
			}
		};
	}

	global.windowManager = new WindowManager(gui, Windows);

	// Clear the summary menu.
	$('#summary').html('');

	for (var key in Windows) {

		var myPath = e.dataTransfer.files[h].path;

		if(extensions.indexOf(path.extname(myPath)) === -1) {
			alert('Must be a Markdown file.');
			continue;
		}

		if(key === 'myWindow-0') {
			openFile(win, myPath);
			h++;
			continue;
		}

		var loginWindow = global.windowManager.open(key, { 
			file: myPath
		});

		global.windowManager.get(key).on('document-end', function() {
			openFile(this, this.data.file);
		});

		h++;
	}

	return false;
}

function openFile(myWindow, myPath) {
	fs.readFile(myPath, encoding, function (err, data) {
		if (err) {
			return alert(err);
		}

		myWindow.title = myPath;

		datas = data;

		myWindow.window.$('#content').html(marked(data));

		var titles = {};

		// Make a Summary :
		// TODO : find a way when the summary is too large.
		myWindow.window.$('h1, h2, h3, h4, h5, h6', '#content').html(function(index, src) {
			titles[index] = {
				type: $(this).context.localName,
				content: src,
				id: title2id(src)
			}
		});

		for (var key in titles) {

			var w = 0;

			switch (titles[key].type) {
			case "h1":
				w = 14;
				break;
			case "h2":
				w = 28;
				break;
			case "h3":
				w = 46;
				break;
			case "h4":
				w = 64;
				break;
			case "h5":
				w = 82;
				break;
			case "h6":
				w = 100;
				break;
			default:
				console.log('Sorry, we are out of ' + expr + '.');
			}

			$('#summary').append('<li><a href="#' + titles[key].id + '"><span class="fa" style="width:' + w + 'px"></span>' + titles[key].content + '</a></li>');
		}

		// Custom elements with Bootstrap framework.
		myWindow.window.$('table', '#content').addClass('table table-striped table-hover');
		myWindow.window.$('blockquote', '#content').addClass('col-sm-11 col-sm-offset-1');

		// Make a new path into this context for the pictures.
		myWindow.window.$('img', '#content').attr('src', function(index, src) {
			return path.dirname(myPath) + path.sep + src;
		});

		// Open links in default web browser.
		myWindow.window.$('a', '#content').click(function(event) {
			if($(this).attr('href') != '#') {
				event.preventDefault();
				gui.Shell.openExternal($(this).attr('href'));
			}
		});
	});
}

function title2id(title) {
	return title.replace(/[àâæáäãåāÀÂÆÁÄÃÅĀéèêëęėėÉÈÊËĘĖĒûùüúūÛÙÜÚŪîïìíįīÎÏÌÍĮĪôœöòóõøōÔŒÖÒÓÕØŌ\/\s]/g, '-').toLowerCase();
}
