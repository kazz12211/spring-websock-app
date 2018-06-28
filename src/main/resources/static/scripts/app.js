var app = angular.module("app", []);

/**
 * Following codes are used without angular
 */

/*
function setConnected(connected) {
	$("#connect").prop("disabled", connected);
	$("#disconnect").prop("disabled", !connected);
	if(connected) {
		$("#conversation").show();
	} else {
		$("#conversation").hide();
	}
	$("#greetings").html("");
}

function connect() {
	var socket = new SockJS('/spring-websocket-app');
	stompClient = Stomp.over(socket);
	stompClient.connect({}, (frame) => {
		setConnected(true);
		console.log('Connected: ' + frame);
		stompClient.subscribe('/topic/greetings', (greeting) => {
			showGreeting(JSON.parse(greeting.body).content);
		});
		stompClient.subscribe('/user/queue/errors', (error) => {
			$("#errorMessage").html(JSON.parse(error.body).message);
			$("#errorPanel").modal({keyboard:false})
		});
	});
}

function disconnect() {
	if(stompClient !== null) {
		stompClient.disconnect();
	}
	setConnected(false);
	console.log("Disconnected");
}

function sendName() {
	stompClient.send("/app/hello", {}, JSON.stringify({'name': $("#name").val()}));
}

function showGreeting(message) {
	$("#greetings").append("<tr><td>" + message + "</td></tr>");
}

$(() => {
	$("form").on('submit', (e) => {
		e.preventDefault();
	});
	
	$("#connect").click(() => {
		connect();
	});
	
	$("#disconnect").click(() => {
		disconnect();
	});
	
	$("#send").click(() => {
		sendName();
	});
});
*/