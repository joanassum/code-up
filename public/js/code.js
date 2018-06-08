$(document).ready(function(){

    // Setup connection
	let socket = io();
	socket.emit('login', $('#username').text());

	let link = $(location).attr('href').slice(0, $(location).attr('href').indexOf('=') + 1) + encodeURIComponent($('#tutorID').text()) + $(location).attr('href').slice($(location).attr('href').indexOf('&tutorID='));

    socket.emit('to server', {from: $('#username').text(), to: $('#tutorID').text(), msg: "Please Code with me: <a href='" + link + "''>" + link + "</a>"});
});
