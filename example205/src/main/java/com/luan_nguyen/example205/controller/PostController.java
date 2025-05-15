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

import com.luan_nguyen.example205.entity.Post;
import com.luan_nguyen.example205.service.PostService;

@RestController
@RequestMapping("/api/posts")
@CrossOrigin(origins = "http://localhost:3000")

public class PostController {
    @Autowired
    private PostService postService;

    @PostMapping("/create")
    public ResponseEntity<Post> createPost(@RequestBody Post post) {
        return new ResponseEntity<>(postService.createPost(post), HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Post> getPostById(@PathVariable("id") Integer id) {
        return postService.getPostById(id)
                .map(post -> new ResponseEntity<>(post, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @GetMapping
    public ResponseEntity<List<Post>> getAllPosts() {
        return new ResponseEntity<>(postService.getAllPosts(), HttpStatus.OK);
    }

    @GetMapping("/active")
    public ResponseEntity<List<Post>> getAllActivePosts() {
        return new ResponseEntity<>(postService.getAllActivePosts(), HttpStatus.OK);
    }

    @GetMapping("/trash")
    public ResponseEntity<List<Post>> getTrashPosts() {
        return new ResponseEntity<>(postService.getTrashPosts(), HttpStatus.OK);
    }

    @GetMapping("/type/{type}")
    public ResponseEntity<List<Post>> getPostsByType(@PathVariable("type") String type) {
        return new ResponseEntity<>(postService.getPostsByType(type), HttpStatus.OK);
    }

    @GetMapping("/topic/{topicId}")
    public ResponseEntity<List<Post>> getPostsByTopicId(@PathVariable("topicId") Integer topicId) {
        return new ResponseEntity<>(postService.getPostsByTopicId(topicId), HttpStatus.OK);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Post> updatePost(@PathVariable("id") Integer id, @RequestBody Post post) {
        post.setId(id);
        return postService.updatePost(post)
                .map(updatedPost -> new ResponseEntity<>(updatedPost, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<HttpStatus> deletePost(@PathVariable("id") Integer id) {
        postService.deletePost(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @PutMapping("/restore/{id}")
    public ResponseEntity<HttpStatus> restorePost(@PathVariable("id") Integer id) {
        postService.restorePost(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @DeleteMapping("/destroy/{id}")
    public ResponseEntity<HttpStatus> destroyPost(@PathVariable("id") Integer id) {
        postService.destroyPost(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
