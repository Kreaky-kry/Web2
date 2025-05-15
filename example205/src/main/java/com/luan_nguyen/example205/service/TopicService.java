package com.luan_nguyen.example205.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.luan_nguyen.example205.entity.Topic;
import com.luan_nguyen.example205.repository.TopicRepository;

@Service

public class TopicService {
    @Autowired
    private TopicRepository topicRepository;

    public Topic createTopic(Topic topic) {
        topic.setCreated_at(LocalDateTime.now());
        topic.setStatus(1); // Mặc định là active
        return topicRepository.save(topic);
    }

    public Topic getTopicById(Integer id) {
        return topicRepository.findById(id).orElse(null);
    }

    public List<Topic> getAllTopics() {
        return topicRepository.findAll();
    }

    public List<Topic> getAllActiveTopics() {
        return topicRepository.findByStatus(2);
    }

    public List<Topic> getTrashTopics() {
        return topicRepository.findByStatus(0);
    }

    public Topic updateTopic(Integer id, Topic topic) {
        Optional<Topic> optionalTopic = topicRepository.findById(id);
        if (optionalTopic.isPresent()) {
            Topic existingTopic = optionalTopic.get();
            existingTopic.setName(topic.getName());
            existingTopic.setSlug(topic.getSlug());
            existingTopic.setSort_order(topic.getSort_order());
            existingTopic.setDescription(topic.getDescription());
            existingTopic.setUpdated_by(topic.getUpdated_by());
            existingTopic.setUpdated_at(LocalDateTime.now());
            return topicRepository.save(existingTopic);
        }
        return null;
    }

    public void deleteTopic(Integer id) {
        topicRepository.findById(id).ifPresent(topic -> {
            topic.setStatus(0);
            topic.setUpdated_at(LocalDateTime.now());
            topicRepository.save(topic);
        });
    }

    public void restoreTopic(Integer id) {
        topicRepository.findById(id).ifPresent(topic -> {
            topic.setStatus(2);
            topic.setUpdated_at(LocalDateTime.now());
            topicRepository.save(topic);
        });
    }

    public void destroyTopic(Integer id) {
        topicRepository.deleteById(id);
    }
}
