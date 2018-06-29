package jp.tsubakicraft.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.messaging.handler.annotation.MessageExceptionHandler;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.annotation.SendToUser;
import org.springframework.stereotype.Controller;
import jp.tsubakicraft.chat.ChatMessage;
import jp.tsubakicraft.chat.MessagingError;

@Controller
public class ChatController {

    private static final Logger logger = LoggerFactory.getLogger(ChatController.class);

    @MessageMapping("/chat.send")
	@SendTo("/topic/public")
	public ChatMessage sendMessage(@Payload ChatMessage chatMessage) {
		logger.info("sendMessage : " +  chatMessage.getContent() + " (" + chatMessage.getSender());
		return chatMessage;
	}
	
	@MessageMapping("/chat.adduser")
	@SendTo("/topic/public")
	public ChatMessage addUser(@Payload ChatMessage chatMessage, SimpMessageHeaderAccessor headerAccessor) {
		logger.info("addUser : " +  chatMessage.getType() + " (" + chatMessage.getSender());
		headerAccessor.getSessionAttributes().put("username", chatMessage.getSender());
		return chatMessage;
	}
	
	@MessageExceptionHandler
	@SendToUser("/queue/errors")
	public MessagingError handleException(Throwable exception) {
		MessagingError error = new MessagingError();
		error.setMessage(exception.getMessage());
		return error;
	}

}
