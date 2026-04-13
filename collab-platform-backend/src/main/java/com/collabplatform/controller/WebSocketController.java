package com.collabplatform.controller;

import com.collabplatform.dto.EditMessage;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class WebSocketController {

    @MessageMapping("/document.edit.{docId}")
    @SendTo("/topic/document.{docId}")
    public EditMessage broadcastEdit(@DestinationVariable String docId, EditMessage message) {
        return message;
    }
}
