$(document).ready(function(){

    // Setup connection
	let socket = io();
	socket.emit('login', $('#username').text());
    socket.emit('to server', {from: $('#username').text(), to: $('#tutorID').text(), msg: "Please Code with me: <a href='" + $(location).attr('href') + "''>" + $(location).attr('href') + "</a>"});
});
