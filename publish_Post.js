document.getElementById('bookingForm').addEventListener('submit', async function(event) {
    event.preventDefault(); // Prevent the default form submission

    // Get the form element reference
    const form = this; // 'this' refers to the form in the event handler context

    // Get form data
    const formData = new FormData(form);
    const imageFile = formData.get('image'); // Ensure 'image' is the correct field name
    
    // Log the form data to check if values are populated correctly
    console.log(formData.get('title'));        // Check if title is retrieved
    console.log(formData.get('description'));  // Check if description is retrieved
    console.log(formData.get('category'));     // Check if category is retrieved
    console.log(formData.get('contact'));      // Check if contact is retrieved

    // Ensure non-empty string values for all fields
    if (!formData.get('title') || !formData.get('description') || !formData.get('category') || !formData.get('contact')) {
        document.getElementById('message').innerText = 'Please fill in all required fields.';
        return;
    }

    // Convert the image to Base64
    let base64Image = '';
    if (imageFile) {
        const reader = new FileReader();
        reader.onloadend = async function() {
            // Remove the "data:image/jpeg;base64," part from the Base64 string
            const base64String = reader.result.replace(/^data:image\/[a-z]+;base64,/, '');

            // Prepare data to send to the server
            const postData = {
                title: formData.get('title'),
                description: formData.get('description'),
                user_id: parseInt(localStorage.getItem('userId'), 10), // Ensure it's an integer
                image_path: base64String, // Send only the Base64 part without the prefix
                category: formData.get('category'),
                contact: formData.get('contact')
            };

            // Send the data to the API
            try {
                const response = await fetch('http://localhost:9090/api/NewPost', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(postData),
                });

                const result = await response.json();
                document.getElementById('message').innerText = result.message; // Show success message

                // Clear the form after successful submission
                form.reset(); // Reset the form
            } catch (error) {
                console.error('Error uploading post:', error);
                document.getElementById('message').innerText = 'Error uploading post. Please try again.';
            }
        };
        reader.readAsDataURL(imageFile); // Read the image file as a data URL
    } else {
        document.getElementById('message').innerText = 'Please select an image.';
    }
});
