
app.controller("controller", function($scope) {

	var stompClient = null;
	$scope.name = "";
	$scope.greetings = [];
	$scope.connected = false;
	
	function setConnected(connected) {
		$scope.connected = connected;
		$scope.greetings = [];
		$scope.$apply();
	}
	
	$scope.connect = () => {
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
	};
	
	$scope.disconnect = () => {
		if(stompClient !== null) {
			stompClient.disconnect();
		}
		setConnected(false);
		console.log("Disconnected");
	};
	
	$scope.sendName = () => {
		stompClient.send("/app/hello", {}, JSON.stringify({'name': $scope.name}));
	};
	
	function showGreeting(message) {
		$scope.greetings.push(message);
		$scope.name = "";
		$scope.$apply();
	} 
});
