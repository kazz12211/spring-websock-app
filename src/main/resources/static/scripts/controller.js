app.controller("controller", function($scope, $filter, $sanitize) {

	var stompClient = null;
	
	$scope.username = "";
	$scope.message = "";
	$scope.messages = [];
	$scope.topicMessages = [];
	$scope.connected = false;
	$scope.required = true;
	$scope.topics = ['General', 'Development', 'Project Management'];
	$scope.topic = $scope.topics[0];
	
	function setConnected(connected) {
		$scope.connected = connected;
		$scope.messages = [];
		$scope.topicMessages = [];
		$scope.$apply();
	}
	
	function showAlert(message) {
		$("#errorMessage").html(message);
		$("#errorPanel").modal({keyboard:false})
	}
	
	$scope.startChatting = () => {
		if($scope.username === null || $scope.username.trim() === "") {
			showAlert("Username is required.");
			return;
		}
		$scope.username = $scope.username.trim();
		var socket = new SockJS('/spring-websocket-app');
		stompClient = Stomp.over(socket);
		stompClient.connect({}, onConnect, onError);
	};
	
	function onConnect() {
		setConnected(true);
		console.log('Connected');
		stompClient.subscribe('/topic/messages', receiveMessage);
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
		$scope.username = "";
		console.log("Disconnected");
	};
	
	$scope.sendMessage = () => {
		var message = $scope.message.trim();
		if(message && stompClient) {
			let chatMessage = {
				sender: $scope.username,
				content: $sanitize(message),
				type: 'CHAT',
				timestamp: new Date()
			};
			stompClient.send("/app/chat.send/" + $scope.topic, {}, JSON.stringify(chatMessage));
			$scope.message = "";
		}
	};
	
	function receiveMessage(chatMessage) {
		var conversationArea = document.querySelector('#conversation');
		
		var message = JSON.parse(chatMessage.body);
		console.log(JSON.stringify(message));
		$scope.messages.push(message);
		makeTopicMessages();
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
	};
	
	$scope.topicChanged = function() {
		makeTopicMessages();
	};
	
	function makeTopicMessages() {
		$scope.topicMessages = $scope.messages.filter(mes => mes.topic === $scope.topic || mes.topic === null);
	}
});

