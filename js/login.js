$(document).ready(function () {
    // Toggle to Signup Form
    $("#signupform").click(function (e) {
        e.preventDefault();
        $(".login-wrapper").hide();
        $(".signup-wrapper").show();
    });

    // Toggle back to Login Form
    $("#showLogin").click(function (e) {
        e.preventDefault();
        $(".signup-wrapper").hide();
        $(".login-wrapper").show();
    });

    // IndexedDB Setup
    let db;
    const request = indexedDB.open("FreshFindsDB", 1);
    request.onupgradeneeded = function(event) {
        db = event.target.result;
        if (!db.objectStoreNames.contains('users')) {
            db.createObjectStore('users', { keyPath: 'email' });
        }
    };
    request.onsuccess = function(event) {
        db = event.target.result;
    };
    request.onerror = function(event) {
        console.error('Database error:', event.target.error.message);
    };

    // Handling Signup
    $('#signup').click(function(e) {
        e.preventDefault();
        const username = $('#username').val();
        const email = $('#signupEmail').val().trim().toLowerCase();
        const password = $('#signupPassword').val();
        const confirmPassword = $('#confirmPassword').val();

        if (password !== confirmPassword) {
            alert('Passwords do not match!');
            return;
        }

        const user = { username, email, password };
        const transaction = db.transaction(['users'], 'readwrite');
        transaction.onerror = function(event) {
            console.error("Transaction error:", event.target.error.message);
        };
        const objectStore = transaction.objectStore('users');
        const addRequest = objectStore.add(user);

        addRequest.onsuccess = function() {
            localStorage.setItem('username', username);
            localStorage.setItem('isLoggedIn', 'true');
            alert('Signup successful!');
            window.location.href = 'index.html'; 
        };
        addRequest.onerror = function(e) {
            alert('Signup failed: ' + e.target.error.message);
        };
    });

    // Login functionality
    $('#login').click(function(e) {
        e.preventDefault();
        const email = $('#exampleInputEmail1').val().trim().toLowerCase();
        const password = $('#password').val();

        const transaction = db.transaction(['users'], 'readonly');
        const objectStore = transaction.objectStore('users');
        const request = objectStore.get(email);

        request.onsuccess = function(event) {
            const user = request.result;
            if (user && user.password === password) {
                localStorage.setItem('username', user.email);
                localStorage.setItem('isLoggedIn', 'true');
                alert('Login successful!');
                window.location.href = 'index.html'; 
            } else {
                alert('Login failed: Check your email or password.');
            }
        };
        request.onerror = function(e) {
            console.error('Error fetching user:', e.target.error.message);
            alert('Login failed: Unable to access the database.');
        };
    });
});
