package com.luan_nguyen.example205.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.luan_nguyen.example205.entity.Topic;
import com.luan_nguyen.example205.service.TopicService;

@RestController
@RequestMapping("/api/topics")
@CrossOrigin(origins = "http://localhost:3000")

public class TopicController {
    @Autowired
    private TopicService topicService;

    @PostMapping("/create")
    public ResponseEntity<Topic> createTopic(@RequestBody Topic topic) {
        return new ResponseEntity<>(topicService.createTopic(topic), HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Topic> getTopicById(@PathVariable Integer id) {
        Topic topic = topicService.getTopicById(id);
        return topic != null ? ResponseEntity.ok(topic) : ResponseEntity.notFound().build();
    }

    @GetMapping
    public ResponseEntity<List<Topic>> getAllTopics() {
        return ResponseEntity.ok(topicService.getAllTopics());
    }

    @GetMapping("/active")
    public ResponseEntity<List<Topic>> getAllActiveTopics() {
        return ResponseEntity.ok(topicService.getAllActiveTopics());
    }

    @GetMapping("/trash")
    public ResponseEntity<List<Topic>> getTrashTopics() {
        return ResponseEntity.ok(topicService.getTrashTopics());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Topic> updateTopic(@PathVariable Integer id, @RequestBody Topic topic) {
        Topic updatedTopic = topicService.updateTopic(id, topic);
        return updatedTopic != null ? ResponseEntity.ok(updatedTopic) : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTopic(@PathVariable Integer id) {
        topicService.deleteTopic(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/restore/{id}")
    public ResponseEntity<Void> restoreTopic(@PathVariable Integer id) {
        topicService.restoreTopic(id);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/destroy/{id}")
    public ResponseEntity<Void> destroyTopic(@PathVariable Integer id) {
        topicService.destroyTopic(id);
        return ResponseEntity.noContent().build();
    }
}
