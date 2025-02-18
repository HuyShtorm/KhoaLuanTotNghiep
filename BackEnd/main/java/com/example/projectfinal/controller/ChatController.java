package com.example.projectfinal.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/chat")
public class ChatController {

    @Value("${openai.api.key}")
    private String openaiApiKey;

    @PostMapping
    public ResponseEntity<?> chat(@RequestBody Map<String, String> request) {
        String userMessage = request.get("message");

        RestTemplate restTemplate = new RestTemplate();
        String openaiUrl = "https://api.openai.com/v1/chat/completions";

        if (userMessage.contains("webapp") || userMessage.contains("ứng dụng")) {
            String webappInfo = "Webapp này là hệ thống quản lý xe chung cư với các tính năng như: đăng ký xe, quản lý bãi đỗ xe, và theo dõi trạng thái đỗ xe.";
            return ResponseEntity.ok(Map.of("reply", webappInfo));
        }
        if (userMessage.contains("hướng dẫn") || userMessage.contains("sử dụng")) {
            return ResponseEntity.ok(Map.of("reply", "Bạn có thể sử dụng các tính năng như đăng ký xe, xem lịch sử xe tại menu chính của hệ thống."));
        }


        // Chuẩn bị header
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(openaiApiKey);

        // Body request
        Map<String, Object> body = new HashMap<>();
        body.put("model", "gpt-3.5-turbo");
        body.put("messages", List.of(Map.of("role", "user", "content", userMessage)));
        body.put("max_tokens", 1000);

        // Tạo HttpEntity
        HttpEntity<Map<String, Object>> httpEntity = new HttpEntity<>(body, headers);

        try {
            ResponseEntity<Map> response = restTemplate.exchange(openaiUrl, HttpMethod.POST, httpEntity, Map.class);

            // Parse response
            Map<String, Object> responseBody = response.getBody();
            if (responseBody == null || !responseBody.containsKey("choices")) {
                throw new RuntimeException("Response from OpenAI is invalid");
            }
            List<Map<String, Object>> choices = (List<Map<String, Object>>) responseBody.get("choices");
            Map<String, Object> firstChoice = choices.get(0);
            Map<String, Object> message = (Map<String, Object>) firstChoice.get("message");
            String botReply = (String) message.get("content");

            return ResponseEntity.ok(Map.of("reply", botReply.trim()));
        } catch (HttpClientErrorException e) {
            return ResponseEntity.status(e.getStatusCode())
                    .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "An error occurred: " + e.getMessage()));
        }
    }
}
