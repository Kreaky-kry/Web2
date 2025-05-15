package com.luan_nguyen.example205.entity;

import java.time.LocalDateTime;
import java.util.List;

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
@Table(name = "Topic")
public class Topic {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(columnDefinition = "int(20) unsigned")
    private Integer id;

    @Column(nullable = false, length = 1000, columnDefinition = "varchar(1000) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci")
    private String name;

    @Column(nullable = false, length = 1000, columnDefinition = "varchar(1000) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci")
    private String slug;

    @Column(nullable = false, columnDefinition = "int(10) unsigned default 0")
    private Integer sort_order;

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
    @OneToMany(mappedBy = "topic", cascade = CascadeType.ALL)
    private List<Post> posts;
}