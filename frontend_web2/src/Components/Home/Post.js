import axios from 'axios';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ip } from '../../api/Api';

const Post = () => {
    const [posts, setPosts] = useState([]);

    const fetchPosts = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/posts`);
            console.log('Fetched posts:', response.data);
            setPosts(response.data || []);
        } catch (error) {
            console.error('Error fetching posts', error);
            setPosts([]);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    // Lấy 3 bài viết đầu tiên
    const displayedPosts = posts.slice(0, 3);

    return (
        <div className='container'>
            
        </div>
    );
};

export default Post;
