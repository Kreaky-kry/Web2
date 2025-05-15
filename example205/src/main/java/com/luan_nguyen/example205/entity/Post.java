package com.luan_nguyen.example205.entity;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "Post")
public class Post {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(columnDefinition = "int(20) unsigned")
    private Integer id;

    @Column(columnDefinition = "int(10) unsigned", nullable = true)
    private Integer topic_id;

    @Column(nullable = false, length = 1000, columnDefinition = "varchar(1000) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci")
    private String title;

    @Column(nullable = false, length = 1000, columnDefinition = "varchar(1000) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci")
    private String slug;

    @Column(nullable = false, columnDefinition = "longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci")
    private String detail;

    @Column(length = 1000, columnDefinition = "varchar(1000) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci", nullable = true)
    private String image;

    @Column(nullable = false, length = 10, columnDefinition = "varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci default 'post'")
    private String type;

    @Column(columnDefinition = "tinytext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci", nullable = true)
    private String description;

    @Column(nullable = false, columnDefinition = "int(10) unsigned")
    private Integer created_by;

    @Column(columnDefinition = "int(10) unsigned", nullable = true)
    private Integer updated_by;

    @Column(nullable = false, columnDefinition = "tinyint(3) unsigned default 2")
    private Integer status;

    @Column(nullable = false)
    private LocalDateTime created_at;

    @Column(nullable = true)
    private LocalDateTime updated_at;

    // Relationships
    @ManyToOne
    @JoinColumn(name = "topic_id", columnDefinition = "int(10) unsigned", insertable = false, updatable = false)
    @JsonIgnore
    private Topic topic;
}