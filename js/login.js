$(document).ready(function() {
    // Open (or create) the database
    var open = indexedDB.open('UserDatabase', 1);

    // Create the schema
    open.onupgradeneeded = function() {
        var db = open.result;
        var store = db.createObjectStore('UserStore', {keyPath: 'id', autoIncrement: true});
        store.createIndex('emailIndex', 'email', {unique: true});
    };

    open.onsuccess = function() {
        // Start a new transaction
        var db = open.result;
        var tx = db.transaction('UserStore', 'readwrite');
        var store = tx.objectStore('UserStore');

        // Add submit event listener to the form
        $('#loginForm').submit(function(e) {
            e.preventDefault();
            var email = $(this).find('input[name="email"]').val();
            var password = $(this).find('input[name="password"]').val();

            // Save the user's data
            var userData = { email: email, password: password };
            store.put(userData);

            // Close the db when the transaction is done
            tx.oncomplete = function() {
                db.close();
            };

            // Provide a simple login feedback
            alert('Login information saved!');
        });
    };

    open.onerror = function() {
        console.error("Error", open.error);
    };
});
