async function fetchPosts() {
    try {
        // Fetch posts from the API
        const response = await fetch('http://localhost:9090/api/Posts');
        const posts = await response.json();

        // Get the container where the posts will be displayed
        const postContainer = document.getElementById('post-container');

        // Clear the container before adding new posts
        postContainer.innerHTML = ''; 

        // Loop through the posts and add them to the container
        posts.forEach(post => {
            // Create a div for each post with the Bootstrap column classes
            const postDiv = document.createElement('div');
            postDiv.classList.add('col');  // Using Bootstrap grid system

            // Create the full Base64 image string
            const base64Image = `data:image/jpeg;base64,${post.image_path}`; // Ensure the MIME type matches the image format

            // Create HTML structure for each post, matching your provided div structure
            postDiv.innerHTML = `
                <div class="card h-100 bg-white border-1 border-info rounded-4 p-2">
                    <a class="text-white text-decoration-none" href="javascript:void(0);" class="card-text">
                        <img src="${base64Image}" width="100" height="300" class="card-img-top rounded-4 shadow-lg" alt="Post Image">
                        <div class="card-body">
                            <h5 class="card-title text-black">${post.title}</h5>
                            <p class="card-text text-body">${post.description}</p>
                        </div>
                    </a>
                    <div class="card-footer rounded-5 border-0 mb-2">
                        <small class="text-body">Category: ${post.category}</small>
                    </div>
                </div>
            `;

            // Add an event listener to the div for navigating to the post details
            postDiv.addEventListener('click', function() {
                // Store the post ID in localStorage or pass it via URL
                localStorage.setItem('postId', post.post_id);
                console.log(localStorage.getItem('postId'));

                // Navigate to the postview.html page
                window.location.href = 'post.html';
            });

            // Add the post to the container
            postContainer.appendChild(postDiv);
        });
    } catch (error) {
        console.error('Error fetching posts:', error);
    }
}

// Call the fetchPosts function when the page loads
window.onload = fetchPosts;
