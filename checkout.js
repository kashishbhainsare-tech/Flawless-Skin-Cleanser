document.addEventListener("DOMContentLoaded", function () {

    let cart = JSON.parse(localStorage.getItem("flawlessCart")) || [];

    const productBox = document.getElementById("checkoutProducts");

    const subtotalElement = document.getElementById("subtotal");
    const totalElement = document.getElementById("total");
    const placeOrderTotal = document.getElementById("placeOrderTotal");

    const couponButton = document.getElementById("couponButton");
    const couponBox = document.getElementById("couponBox");
    const applyCoupon = document.getElementById("applyCoupon");

    const couponSuccess = document.getElementById("couponSuccess");
    const discountRow = document.getElementById("discountRow");
    const removeCoupon = document.getElementById("removeCoupon");

    let discount = 0;

    /* ================= DISPLAY CART ================= */

    function displayCart() {

        productBox.innerHTML = "";

        if (cart.length === 0) {

            productBox.innerHTML = `
                <div class="empty-checkout">
                    Your cart is empty.
                </div>
            `;

            updateTotal();
            return;
        }

        cart.forEach(function (product, index) {

            let quantity = product.quantity || 1;

            let price = parseFloat(
                String(product.price).replace("$", "")
            );

            let itemTotal = price * quantity;


            let item = document.createElement("div");

            item.className = "checkout-product";

            item.innerHTML = `

                <div class="product-image">

                    <img
                        src="${product.image}"
                        alt="${product.name}"
                        onerror="this.style.display='none'">

                    <span class="quantity-badge">
                        ${quantity}
                    </span>

                </div>

                <div class="product-name">
                    ${product.name}
                </div>

                <div class="product-price">
                    $${itemTotal.toFixed(2)}
                </div>

            `;

            productBox.appendChild(item);

        });

        updateTotal();
    }

    /* ================= TOTAL ================= */

    function updateTotal() {

        let subtotal = 0;

        cart.forEach(function (product) {

            let quantity = product.quantity || 1;

            let price = parseFloat(
                String(product.price).replace("$", "")
            );

            subtotal += price * quantity;

        });

        let total = subtotal - discount;

        if (total < 0) {
            total = 0;
        }

        subtotalElement.textContent =
            "$" + subtotal.toFixed(2);

        totalElement.textContent =
            "$" + total.toFixed(2);

        placeOrderTotal.textContent =
            "$" + total.toFixed(2);
    }

    /* ================= COUPON BOX ================= */

    couponButton.addEventListener("click", function () {

        couponBox.classList.toggle("d-none");

    });

    /* ================= APPLY COUPON ================= */

    applyCoupon.addEventListener("click", function () {

        let code = document
            .getElementById("couponInput")
            .value
            .trim()
            .toLowerCase();

        if (code === "cart10" || code === "welcome10") {

            discount = 10;

            document.getElementById("couponName").textContent =
                code;

            discountRow.classList.remove("d-none");

            couponSuccess.classList.remove("d-none");

            updateTotal();

        } else {

            alert("Invalid coupon code.");

        }

    });

    /* ================= REMOVE COUPON ================= */

    removeCoupon.addEventListener("click", function () {

        discount = 0;

        discountRow.classList.add("d-none");

        couponSuccess.classList.add("d-none");

        updateTotal();

    });

    /* ================= PLACE ORDER ================= */

    document
        .getElementById("placeOrder")
        .addEventListener("click", function () {

            if (cart.length === 0) {

                alert("Your cart is empty.");

                return;
            }

            let firstName =
                document.getElementById("firstName").value.trim();

            let email =
                document.getElementById("email").value.trim();

            let address =
                document.getElementById("address").value.trim();

            if (
                firstName === "" ||
                email === "" ||
                address === ""
            ) {

                alert(
                    "Please fill the required billing details."
                );

                return;
            }

            alert(
                "Order placed successfully!"
            );

        });

    /* ================= LOAD ================= */

    displayCart();

});