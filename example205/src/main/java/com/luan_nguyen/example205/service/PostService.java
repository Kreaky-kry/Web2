package com.luan_nguyen.example205.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.luan_nguyen.example205.entity.Post;
import com.luan_nguyen.example205.repository.PostRepository;

@Service

public class PostService {
    @Autowired
    private PostRepository postRepository;

    public Post createPost(Post post) {
        post.setCreated_at(LocalDateTime.now());
        post.setStatus(2); // Default status is active
        if (post.getType() == null || post.getType().isEmpty()) {
            post.setType("post"); // Default type is "post"
        }
        return postRepository.save(post);
    }

    public Optional<Post> getPostById(Integer postId) {
        return postRepository.findById(postId);
    }

    public List<Post> getAllPosts() {
        return postRepository.findAll();
    }

    public List<Post> getAllActivePosts() {
        return postRepository.findByStatus(2);
    }

    public List<Post> getTrashPosts() {
        return postRepository.findByStatus(0);
    }

    public List<Post> getPostsByType(String type) {
        return postRepository.findByType(type);
    }

    public List<Post> getPostsByTopicId(Integer topicId) {
        return postRepository.findByTopicId(topicId);
    }

    public Optional<Post> updatePost(Post post) {
        return getPostById(post.getId()).map(existingPost -> {
            existingPost.setTopic_id(post.getTopic_id());
            existingPost.setTitle(post.getTitle());
            existingPost.setSlug(post.getSlug());
            existingPost.setDetail(post.getDetail());
            existingPost.setImage(post.getImage());
            existingPost.setType(post.getType());
            existingPost.setDescription(post.getDescription());
            existingPost.setUpdated_by(post.getUpdated_by());
            existingPost.setUpdated_at(LocalDateTime.now());
            return postRepository.save(existingPost);
        });
    }

    public void deletePost(Integer postId) {
        getPostById(postId).ifPresent(post -> {
            post.setStatus(0); // Move to trash
            post.setUpdated_at(LocalDateTime.now());
            postRepository.save(post);
        });
    }

    public void restorePost(Integer postId) {
        getPostById(postId).ifPresent(post -> {
            post.setStatus(2); // Restore to active
            post.setUpdated_at(LocalDateTime.now());
            postRepository.save(post);
        });
    }

    public void destroyPost(Integer postId) {
        postRepository.deleteById(postId);
    }
}
