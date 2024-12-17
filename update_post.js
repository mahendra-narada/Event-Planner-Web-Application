document.getElementById('bookingForm').addEventListener('submit', async function(event) {
    event.preventDefault(); // Prevent the default form submission

    // Get the form element reference
    const form = this; // 'this' refers to the form in the event handler context

    // Get form data
    const formData = new FormData(form);
    const imageFile = formData.get('image');

    // Validate form data (optional)
    const title = formData.get('title');
    const description = formData.get('description'); // Use 'description' to match the HTML
    const category = formData.get('category');

    if (!title || !description || !category) {
        document.getElementById('message').innerText = 'Please fill out all fields.';
        return;
    }

    // Convert the image to Base64
    if (imageFile) {
        const reader = new FileReader();
        reader.onloadend = async function() {
            // Get the Base64 string without the prefix
            const base64String = reader.result.replace(/^data:image\/[a-z]+;base64,/, '');

            // Prepare data to send to the server
            const postData = {
                title: title,
                description: description,
                user_id: parseInt(localStorage.getItem('userId'), 10), // Ensure it's the correct field
                image_path: base64String,
                contact: formData.get('contact'),
                category: category
            };

            const postId = parseInt(localStorage.getItem('postId'), 10); // Get post ID

            // Send the data to the API
            try {
                const response = await fetch(`http://localhost:9090/api/UpDate/${postId}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(postData),
                });

                if (response.ok) {
                    const result = await response.json();
                    document.getElementById('message').innerText = result.message; // Show success message
                    form.reset(); // Clear the form
                } else {
                    throw new Error('Failed to update post');
                }
            } catch (error) {
                console.error('Error updating post:', error);
                document.getElementById('message').innerText = 'Error updating post. Please try again.';
            }
        };
        reader.readAsDataURL(imageFile); // Read the image file as a data URL
    } else {
        document.getElementById('message').innerText = 'Please select an image.';
    }
});



document.addEventListener('DOMContentLoaded', async function() {
    const postId = localStorage.getItem('postId'); // Get post ID from localStorage

    if (postId) {
        try {
            const response = await fetch(`http://localhost:9090/api/posts/${postId}`); // Adjust the endpoint as needed
            if (response.ok) {
                const postData = await response.json(); // Assume the API returns post data as JSON
                
                // If your API returns the image path, you can also display it
                // For example, if the image path is stored in `image_path`
                if (postData.image_path) {
                    const img = document.createElement('img');
                    img.src = `data:image/jpeg;base64,${postData.image_path}`; // Adjust as per your image data
                    img.alt = 'Post Image';
                    img.style.width = '100%';
                    img.classList.add("rounded-4") // Style as needed
                    img.classList.add("mb-3") // Style as needed
                    document.getElementById('message').appendChild(img); // Append the image to the message div
                }

                // Populate form fields with post data
                document.getElementById('title').value = postData.title;
                document.getElementById('description').value = postData.description;
                document.getElementById('category').value = postData.category;
                document.getElementById('contact').value = postData.contact;

                
            } else {
                throw new Error('Failed to load post details');
            }
        } catch (error) {
            console.error('Error fetching post details:', error);
            document.getElementById('message').innerText = 'Error loading post details. Please try again.';
        }
    } else {
        document.getElementById('message').innerText = 'No post ID found.';
    }
});