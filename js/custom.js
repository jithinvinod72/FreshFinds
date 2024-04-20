$(document).ready(function() {
    'use strict';

    var tinyslider = function() {
        if ($('.testimonial-slider').length) {
            var slider = tns({
                container: '.testimonial-slider',
                items: 1,
                axis: "horizontal",
                controlsContainer: "#testimonial-nav",
                swipeAngle: false,
                speed: 700,
                nav: true,
                controls: true,
                autoplay: true,
                autoplayHoverPause: true,
                autoplayTimeout: 3500,
                autoplayButtonOutput: false
            });
        }
    };
    tinyslider();

    // Function to add item to cart
    $('.add-to-cart').click(function() {
        var name = $(this).data('name');
        var price = $(this).data('price');
        var cart = JSON.parse(localStorage.getItem('cart')) || [];
        var found = false;

        // Check if the product is already in the cart
        cart.forEach(function(item) {
            if (item.name === name) {
                item.quantity++;
                found = true;
            }
        });

        if (!found) {
            cart.push({ name: name, price: price, quantity: 1 });
        }

        // Update localStorage
        localStorage.setItem('cart', JSON.stringify(cart));
        alert(name + " added to cart.");
    });

	$(document).on('click', '.remove-item', function() {
		var nameToRemove = $(this).data('name');
		var cart = JSON.parse(localStorage.getItem('cart')) || [];
	
		// Filter out the item to be removed
		cart = cart.filter(item => item.name !== nameToRemove);
	
		// Update the cart in localStorage
		localStorage.setItem('cart', JSON.stringify(cart));
	
		// Update the cart display
		displayCart();
		updateCartTotal(); // Make sure this function is defined to update the total
	});

    // Function to display cart items on the cart page
    if (window.location.pathname.endsWith('cart.html')) {
        displayCart();
    } 

	function displayCart() {
		var cart = JSON.parse(localStorage.getItem('cart')) || [];
		var $table = $('.site-blocks-table tbody');
		$table.empty();
	
		if (cart.length === 0) {
			$table.append('<tr><td colspan="6">No products in cart</td></tr>');
		} else {
			cart.forEach(function(item, index) {
				$table.append('<tr>' +
					'<td class="product-thumbnail"><img src="path_to_image" alt="Image" class="img-fluid"></td>' +
					'<td class="product-name">' + item.name + '</td>' +
					'<td>$' + item.price + '</td>' +
					'<td>' +
					'<div class="input-group mb-3 d-flex align-items-center quantity-container" style="max-width: 120px;">' +
					'<div class="input-group-prepend">' +
					'<button class="btn btn-outline-black decrease" type="button">&minus;</button>' +
					'</div>' +
					'<input type="text" class="form-control text-center quantity-amount" value="' + item.quantity + '" readonly>' +
					'<div class="input-group-append">' +
					'<button class="btn btn-outline-black increase" type="button">&plus;</button>' +
					'</div>' +
					'</div>' +
					'</td>' +
					'<td>$' + (item.price * item.quantity).toFixed(2) + '</td>' +
					'<td><button class="btn btn-black btn-sm remove-item" data-name="' + item.name + '">X</button></td>' +
					'</tr>');
			});
		}
	}

	function updateCartTotal() {
		var cart = JSON.parse(localStorage.getItem('cart')) || [];
		var total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
		$('#cart-total').text('$' + total.toFixed(2));
	}
	  
	  // Call updateCartTotal wherever needed to ensure the total updates appropriately
	  $('.add-to-cart').click(function() {
		// existing add to cart logic...
		updateCartTotal();
	  });
	  
	  $(document).on('click', '.increase, .decrease, .remove-item', function() {
		// Adjust quantity or remove item logic...
		updateCartTotal();
	  });
	  
	  // On initial load
	  updateCartTotal();
	  
      var logoutIcon = document.getElementById('logout-icon');
	  logoutIcon.addEventListener('click', function(event) {
        event.preventDefault(); // Prevent default anchor click behavior

        // Implement logout logic here
        localStorage.removeItem('currentlyLoggedIn');  // Assuming you use localStorage for session tracking
        localStorage.removeItem('userEmail'); // Clear user email or any other stored user data

        // Optionally, inform your server about the logout for server-side session invalidation
        // This can be done with a fetch/AJAX request if needed (omitted here for simplicity)

        // Redirect to the login page or home page after logout
        window.location.href = 'index.html'; // Modify as necessary for your site's URL structure
    });

	updateProfileIcon();

    function updateProfileIcon() {
        var isLoggedIn = localStorage.getItem('currentlyLoggedIn');
        var profileIcon = document.getElementById('profile-icon');
        
        if (isLoggedIn) {
            // Disable the profile icon
            profileIcon.classList.add('disabled');
            profileIcon.href = "#";  // Removing any actionable link
            profileIcon.onclick = function() { return false; };  // Preventing default action
        } else {
            // Enable the profile icon if needed
            profileIcon.classList.remove('disabled');
            profileIcon.href = "login.html";  // Link to the login page
            profileIcon.onclick = null;  // Removing the onclick handler
        }
    }
    
    window.checkLogin = function() {
        // Prevent the link from being followed if logged in
        return !localStorage.getItem('currentlyLoggedIn');
    };
	  
});
