app.controller("controller", function($scope, $filter) {

	var stompClient = null;
	var username = null;
	var colors = [
		'#2196F3', '#32c787', '#00BCD4', '#ff5652',
		'#ffc107', '#ff85af', '#FF9800', '#39bbb0'
	];
	
	$scope.username = "";
	$scope.message = "";
	$scope.messages = [];
	$scope.connected = false;
	
	function setConnected(connected) {
		$scope.connected = connected;
		$scope.messages = [];
		$scope.$apply();
	}
	
	function showAlert(message) {
		$("#errorMessage").html(message);
		$("#errorPanel").modal({keyboard:false})
	}
	
	$scope.startChatting = () => {
		var socket = new SockJS('/spring-websocket-app');
		stompClient = Stomp.over(socket);
		stompClient.connect({}, onConnect, onError);
	};
	
	function onConnect() {
		setConnected(true);
		console.log('Connected');
		stompClient.subscribe('/topic/public', receiveMessage);
		stompClient.subscribe('/user/queue/errors', (error) => {
			showAlert(JSON.parse(error.body).message);
		});
		stompClient.send("/app/chat.adduser", {}, JSON.stringify({sender: $scope.username, type: 'JOIN', timestamp: new Date()}));
	}
	
	function onError(error) {
		console.log(error);
		showAlert("Could not connect to WebSocket server. Try after refresh this page.");
		setConnected(false);
	}
	
	$scope.disconnect = () => {
		if(stompClient !== null) {
			stompClient.disconnect();
		}
		setConnected(false);
		console.log("Disconnected");
	};
	
	$scope.sendMessage = () => {
		var message = $scope.message.trim();
		if(message && stompClient) {
			let chatMessage = {
				sender: $scope.username,
				content: message,
				type: 'CHAT',
				timestamp: new Date()
			};
			stompClient.send("/app/chat.send", {}, JSON.stringify(chatMessage));
			$scope.message = "";
		}
	};
	
	function receiveMessage(chatMessage) {
		var conversationArea = document.querySelector('#conversation');
		
		var message = JSON.parse(chatMessage.body);
		console.log(JSON.stringify(message));
		$scope.messages.push(message);
		$scope.$apply();
		
		conversationArea.scrollTop = conversationArea.scrollHeight;
	} 
	
	$scope.getClass = function(index, messages) {
		let mes = messages[index];
		if(mes.type === 'CHAT') {
			return "chat-message";
		} else {
			return "event-message";
		}
	}
});

