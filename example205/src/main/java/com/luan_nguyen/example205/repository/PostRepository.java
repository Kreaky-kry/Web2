package com.luan_nguyen.example205.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.luan_nguyen.example205.entity.Post;

@Repository
public interface PostRepository extends JpaRepository<Post, Integer> {
    List<Post> findByStatus(Integer status);

    List<Post> findByType(String type);

    List<Post> findByTopicId(Integer topicId);

    List<Post> findByTypeAndStatus(String type, Integer status);
}