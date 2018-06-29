package jp.tsubakicraft.controller;

import org.springframework.messaging.handler.annotation.MessageExceptionHandler;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.annotation.SendToUser;
import org.springframework.stereotype.Controller;
import org.springframework.web.util.HtmlUtils;

import jp.tsubakicraft.chat.Greeting;
import jp.tsubakicraft.chat.HelloMessage;
import jp.tsubakicraft.chat.MessagingError;

@Controller
public class GreetingController {

	@MessageMapping("/hello")
	@SendTo("/topic/greetings")
	public Greeting greeting(HelloMessage message) throws Exception {
		if(message.getName() == null || message.getName().isEmpty()) {
			throw new NullPointerException("No name");
		}
		Thread.sleep(1000);
		return new Greeting("Hello, " + HtmlUtils.htmlEscape(message.getName()));
	}

	@MessageExceptionHandler
	@SendToUser("/queue/errors")
	public MessagingError handleException(Throwable exception) {
		MessagingError error = new MessagingError();
		error.setMessage(exception.getMessage());
		return error;
	}
}
