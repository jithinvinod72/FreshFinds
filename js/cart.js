
    $(document).ready(function() {
        // Increase button click event
        $(".increase").on("click", function() {
            var $quantityInput = $(this).closest(".quantity-container").find(".quantity-amount");
            var currentValue = parseInt($quantityInput.val());
            $quantityInput.val(currentValue + 1);
        });

        // Decrease button click event
        $(".decrease").on("click", function() {
            var $quantityInput = $(this).closest(".quantity-container").find(".quantity-amount");
            var currentValue = parseInt($quantityInput.val());
            if (currentValue > 1) {
                $quantityInput.val(currentValue - 1);
            }
        });
    });