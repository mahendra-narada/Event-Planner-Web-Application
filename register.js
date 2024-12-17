// Register
async function registerUser() {
    // Prepare user object
    const User = {
        first_name: document.getElementById('firstName').value,
        last_name: document.getElementById('lastName').value,
        birth_date: document.getElementById('birthday').value.toString(),
        email: document.getElementById('email').value,
        password: document.getElementById('password').value,
        contact: document.getElementById('contact').value
    };

    // Call the API using fetch
    try {
        const response = await fetch('http://localhost:9090/api/RegisterUser', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(User)
        });

        alert(await response.json().message);
    } catch (error) {
        alert('Error registering user');
        console.error('Error:', error);
    }
}