async function fetchPostDetail() {
    const postId = localStorage.getItem('postId'); // Get the post ID
    const userId = localStorage.getItem('userId'); // Get the logged-in user's ID

    if (!postId) {
        document.getElementById('post-detail').innerText = 'No post found!';
        return;
    }

    try {
        const response = await fetch(`http://localhost:9090/api/posts/${postId}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        
        const post = await response.json(); // Get post details

        // Get the container to display the post details
        const postDetailContainer = document.getElementById('post-detail');

        // Create the full Base64 image string
        const base64Image = `data:image/jpeg;base64,${post.image_path}`;

        // Create HTML structure for the post
        postDetailContainer.innerHTML = `  
            <h2 class="post-title">${post.title}</h2>
            <img src="${base64Image}" alt="Post Image" class="img-fluid my-2 rounded-4">
            <p class="post-content">${post.description}</p>
            <p class="post-category">Category: ${post.category}</p>
            <p class="post-contact">Contact: ${post.contact}</p>
        `;
        console.log(post.user_id);
        console.log(userId);
        
        
        // Check if the current user is the owner of the post
        if (post.user_id == userId) { // Compare post owner ID with current user ID
            document.getElementById('DELETE').style.display = 'block'; // Show delete button
            document.getElementById('UPDATE').style.display = 'block';
        }

    } catch (error) {
        console.error('Error fetching post details:', error);
        document.getElementById('post-detail').innerText = 'Error fetching post details!';
    }

    // Event listener for the delete button
    document.getElementById('DELETE').addEventListener('click', async function () {
        const confirmed = confirm("Are you sure you want to delete this post?");
        if (confirmed) {
            try {
                const response = await fetch(`http://localhost:9090/api/DeletePost/${postId}`, {
                    method: 'DELETE',
                });
                if (!response.ok) {
                    throw new Error('Failed to delete post');
                }
                alert("Post deleted successfully");
                window.location.href = 'posts.html'; // Redirect after deletion
            } catch (error) {
                console.error('Error deleting post:', error);
                alert('Error deleting post');
            }
        }
    });

    document.getElementById('UPDATE').addEventListener('click', async function () {
         
        window.location.href = "update.html";
        
    });
}

// Fetch post details when the page loads
fetchPostDetail();
