$(document).ready(function() {
    'use strict';

    // Initialize the testimonial slider
    var initTinySlider = function() {
        if ($('.testimonial-slider').length) {
            tns({
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

    function updateProfileIcon() {
        var isLoggedIn = localStorage.getItem('isLoggedIn');
        var profileIcon = $('#profile-icon');
        let logout = $('#logout-icon');
        if (isLoggedIn) {
            profileIcon.addClass('disabled');            
        } else {
            profileIcon.removeClass('disabled');
            logout.removeClass('disabled');
            profileIcon.attr('href', "login.html"); // Ensure it links to the login page if not logged in
        }
    }
    // Call updateProfileIcon to set up the icon link correctly
    updateProfileIcon();

    // Add item to cart functionality
    var addToCart = function() {
        $('.add-to-cart').click(function() {
            var name = $(this).data('name');
            var price = $(this).data('price');
            var cart = JSON.parse(localStorage.getItem('cart')) || [];
            var found = false;

            cart.forEach(function(item) {
                if (item.name === name) {
                    item.quantity++;
                    found = true;
                }
            });

            if (!found) {
                cart.push({ name: name, price: price, quantity: 1 });
            }

            localStorage.setItem('cart', JSON.stringify(cart));
            displayCart();
            updateCartTotal();
            alert(name + " added to cart.");
        });
    };

    // Remove item from cart functionality
    var removeFromCart = function() {
        $(document).on('click', '.remove-item', function() {
            var nameToRemove = $(this).data('name');
            var cart = JSON.parse(localStorage.getItem('cart')) || [];

            cart = cart.filter(item => item.name !== nameToRemove);
            localStorage.setItem('cart', JSON.stringify(cart));
            displayCart();
            updateCartTotal();
        });
    };

    // Function to display cart items on the cart page
    var displayCart = function() {
        var cart = JSON.parse(localStorage.getItem('cart')) || [];
        var $table = $('.site-blocks-table tbody');
        $table.empty();

        if (cart.length === 0) {
            $table.append('<tr><td colspan="6">No products in cart</td></tr>');
        } else {
            cart.forEach(function(item) {
                var $row = $('<tr>').append(
                    $('<td class="product-thumbnail">').append('<img src="path_to_image" alt="Image" class="img-fluid">'),
                    $('<td class="product-name">').text(item.name),
                    $('<td>').text('$' + item.price),
                    $('<td>').append(
                        $('<div class="input-group mb-3 d-flex align-items-center quantity-container" style="max-width: 120px;">').append(
                            $('<div class="input-group-prepend">').append(
                                $('<button class="btn btn-outline-black decrease" type="button">').text('−')
                            ),
                            $('<input type="text" class="form-control text-center quantity-amount" readonly>').val(item.quantity),
                            $('<div class="input-group-append">').append(
                                $('<button class="btn btn-outline-black increase" type="button">').text('+')
                            )
                        )
                    ),
                    $('<td>').text('$' + (item.price * item.quantity).toFixed(2)),
                    $('<td>').append($('<button class="btn btn-black btn-sm remove-item" data-name="' + item.name + '">').text('X'))
                );
                $table.append($row);
            });
        }
    };

    // Function to update the total cost of the cart
    var updateCartTotal = function() {
        var cart = JSON.parse(localStorage.getItem('cart')) || [];
        var total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
        $('#cart-total').text('$' + total.toFixed(2));
    };

    // Quantity update handlers
    var setupQuantityUpdateHandlers = function() {
        $(document).on('click', '.increase, .decrease', function() {
            var $input = $(this).closest('.quantity-container').find('.quantity-amount');
            var currentQuantity = parseInt($input.val(), 10);
            var newQuantity = $(this).hasClass('increase') ? currentQuantity + 1 : currentQuantity - 1;
            newQuantity = newQuantity > 0 ? newQuantity : 1;  // Prevent quantity from going below 1

            var name = $(this).closest('tr').find('.product-name').text();
            var cart = JSON.parse(localStorage.getItem('cart')) || [];
            cart.forEach(function(item) {
                if (item.name === name) {
                    item.quantity = newQuantity;
                }
            });

            localStorage.setItem('cart', JSON.stringify(cart));
            $input.val(newQuantity);
            displayCart();
            updateCartTotal();
        });
    };

    // Logout functionality
    var setupLogout = function() {
        $('#logout-icon').click(function(event) {
            event.preventDefault();
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('userEmail');
            window.location.href = 'index.html';
            alert("Logged out successfully");
        });
    };

    // Initial calls
    initTinySlider();
    addToCart();
    removeFromCart();
    setupQuantityUpdateHandlers();
    setupLogout();

    if (window.location.pathname.endsWith('cart.html')) {
        displayCart();
        updateCartTotal();
    }
});
