let products = [];

/* =====================================================
   LOAD PRODUCTS
===================================================== */

fetch("product.json")
    .then(response => response.json())
    .then(data => {

        products = data;

        showNewArrivals();
        showMostLoved();

        updateCartCount();
        renderCart();

    })
    .catch(error => {

        console.log("Product JSON Error:", error);

    });

/* =====================================================
   NEW ARRIVALS
===================================================== */

function showNewArrivals() {

    let productBox =
        document.getElementById("newArrivals");

    if (!productBox) {
        return;
    }

    productBox.innerHTML = "";

    products.slice(0, 8).forEach(product => {

        productBox.innerHTML += `

            <div class="col-12 col-sm-6 col-lg-3">

                <div class="position-relative product-card">

                    <!-- PRODUCT IMAGE -->

                    <a href="product.html?id=${product.id}&source=index">

                        <img
                            src="${product.image}"
                            class="img-fluid w-100"
                            alt="${product.name}">

                    </a>

                    <!-- ADD TO CART -->

                    <div
                        class="add-cart-wrapper
                               position-absolute top-0 end-0
                               m-3 d-flex align-items-center">

                        <span
                            class="add-cart-text
                                   bg-dark text-white
                                   px-3 py-2 small">

                            Add to cart

                        </span>

                        <button
                            type="button"
                            onclick="addToCart(${product.id})"
                            class="add-cart-btn
                                   bg-white border-0
                                   rounded-circle shadow-sm
                                   d-flex align-items-center
                                   justify-content-center">

                            <i class="bi bi-bag-fill"></i>

                        </button>

                    </div>

                </div>

                <!-- CATEGORY -->

                <p
                    class="text-secondary
                           mt-3 mb-2 small">

                    ${product.category}

                </p>

                <!-- PRODUCT NAME -->

                <h6 class="fw-normal mb-2">

                    <a
                        href="product.html?id=${product.id}&source=index"
                        class="text-dark text-decoration-none">

                        ${product.name}

                    </a>

                </h6>

                <!-- PRICE -->

                <p class="fw-semibold mb-0">

                    ${product.price}

                </p>

            </div>

        `;

    });

}

/* =====================================================
   MOST LOVED PRODUCTS
===================================================== */

function showMostLoved() {

    let lovedBox =
        document.getElementById("mostLovedProducts");

    if (!lovedBox) {
        return;
    }

    lovedBox.innerHTML = "";

    products.slice(8, 12).forEach(product => {

        lovedBox.innerHTML += `

            <div class="col-12 col-sm-6 col-lg-3">

                <div class="position-relative product-card">

                    <!-- PRODUCT IMAGE -->

                    <a href="product.html?id=${product.id}&source=index">

                        <img
                            src="${product.image}"
                            class="img-fluid w-100"
                            alt="${product.name}">

                    </a>

                    <!-- ADD TO CART -->

                    <div
                        class="add-cart-wrapper
                               position-absolute top-0 end-0
                               m-3 d-flex align-items-center">

                        <span
                            class="add-cart-text
                                   bg-dark text-white
                                   px-3 py-2 small">

                            Add to cart

                        </span>

                        <button
                            type="button"
                            onclick="addToCart(${product.id})"
                            class="add-cart-btn
                                   bg-white border-0
                                   rounded-circle shadow-sm
                                   d-flex align-items-center
                                   justify-content-center">

                            <i class="bi bi-bag-fill"></i>

                        </button>

                    </div>

                </div>

                <!-- CATEGORY -->

                <p
                    class="text-secondary
                           mt-3 mb-2 small">

                    ${product.category}

                </p>

                <!-- PRODUCT NAME -->

                <h6 class="fw-normal mb-2">

                    <a
                        href="product.html?id=${product.id}&source=index"
                        class="text-dark text-decoration-none">

                        ${product.name}

                    </a>

                </h6>

                <!-- PRICE -->

                <p class="fw-semibold mb-0">

                    ${product.price}

                </p>

            </div>

        `;

    });

}

/* =====================================================
   GET PRICE
===================================================== */

function getCartPrice(price) {

    if (typeof price === "number") {
        return price;
    }

    return parseFloat(
        String(price)
            .replace("$", "")
            .replace(",", "")
            .split("–")[0]
            .split("-")[0]
            .trim()
    ) || 0;

}

/* =====================================================
   GET CART
===================================================== */

function getCart() {

    try {

        let cart =
            JSON.parse(
                localStorage.getItem("flawlessCart")
            );

        if (!Array.isArray(cart)) {
            return [];
        }

        return cart;

    }
    catch (error) {

        console.log("Cart Error:", error);

        return [];

    }

}

/* =====================================================
   SAVE CART
===================================================== */

function saveCart(cart) {

    localStorage.setItem(
        "flawlessCart",
        JSON.stringify(cart)
    );

}

/* =====================================================
   ADD TO CART
===================================================== */

function addToCart(id) {

    let product =
        products.find(
            product => product.id == id
        );

    if (!product) {

        console.log(
            "Product not found:",
            id
        );

        return;

    }

    let cart = getCart();

    let existing =
        cart.find(
            item => item.id == id
        );

    if (existing) {

        existing.quantity =
            Number(existing.quantity || 0) + 1;

    }
    else {

        cart.push({

            id: product.id,

            name: product.name,

            price: product.price,

            image: product.image,

            category: product.category,

            quantity: 1

        });

    }

    saveCart(cart);

    updateCartCount();

    renderCart();

    openCartDrawer();

}

/* =====================================================
   UPDATE CART COUNT
===================================================== */

function updateCartCount() {

    let cart = getCart();

    let count =
        cart.reduce(
            (total, item) => {

                return total +
                    Number(
                        item.quantity || 0
                    );

            },
            0
        );

    let cartCount =
        document.getElementById("cartCount");

    if (cartCount) {

        cartCount.textContent = count;

    }

    let cartDrawerCount =
        document.getElementById(
            "cartDrawerCount"
        );

    if (cartDrawerCount) {

        cartDrawerCount.textContent = count;
    }

}

/* =====================================================
   OPEN CART DRAWER
===================================================== */

function openCartDrawer() {

    let cartDrawer =
        document.getElementById(
            "cartDrawer"
        );

    let cartOverlay =
        document.getElementById(
            "cartOverlay"
        );

    if (cartDrawer) {

        cartDrawer.classList.add("open");

    }

    if (cartOverlay) {

        cartOverlay.classList.add("show");

    }

    renderCart();

}

/* =====================================================
   CLOSE CART DRAWER
===================================================== */

function closeCartDrawer() {

    let cartDrawer =
        document.getElementById(
            "cartDrawer"
        );

    let cartOverlay =
        document.getElementById(
            "cartOverlay"
        );

    if (cartDrawer) {

        cartDrawer.classList.remove("open");

    }

    if (cartOverlay) {

        cartOverlay.classList.remove("show");

    }

}

/* =====================================================
   RENDER CART
===================================================== */

function renderCart() {

    let cart = getCart();

    let cartItems =
        document.getElementById(
            "cartItems"
        );

    let cartSubtotal =
        document.getElementById(
            "cartSubtotal"
        );

    let cartTotal =
        document.getElementById(
            "cartTotal"
        );

    let cartDrawerCount =
        document.getElementById(
            "cartDrawerCount"
        );

    let freeShippingAmount =
        document.getElementById(
            "freeShippingAmount"
        );

    if (!cartItems) {
        return;
    }

    cartItems.innerHTML = "";

    let subtotal = 0;

    let totalQuantity = 0;

    /* =================================================
       EMPTY CART
    ================================================= */

    if (cart.length === 0) {

        cartItems.innerHTML = `

            <div class="text-center p-5">

                <i
                    class="bi bi-bag
                           fs-1 text-secondary">
                </i>

                <p
                    class="text-secondary
                           mt-3 mb-0">

                    Your cart is empty.

                </p>

            </div>

        `;

    }

    /* =================================================
       CART PRODUCTS
    ================================================= */

    cart.forEach(item => {

        let price =
            getCartPrice(item.price);

        let quantity =
            Number(item.quantity) || 1;

        let itemTotal =
            price * quantity;

        subtotal += itemTotal;

        totalQuantity += quantity;

        cartItems.innerHTML += `

            <div class="cart-item">

                <div
                    class="d-flex
                           gap-3 p-3">

                    <!-- IMAGE -->

                    <img
                        src="${item.image}"
                        alt="${item.name}"
                        width="80"
                        height="80"
                        class="rounded
                               object-fit-cover">

                    <!-- PRODUCT INFO -->

                    <div
                        class="flex-grow-1">

                        <h6
                            class="mb-2
                                   fw-semibold">

                            ${item.name}

                        </h6>

                        <p
                            class="mb-2
                                   text-dark">

                            $${price.toFixed(2)}

                        </p>

                        <!-- REMOVE -->

                        <button
                            type="button"
                            class="remove-cart-item"
                            onclick="removeFromCart('${item.id}')">

                            REMOVE

                        </button>

                    </div>

                    <!-- QUANTITY -->

                    <div
                        class="cart-quantity
                               d-flex
                               align-items-center
                               gap-2">

                        <button
                            type="button"
                            onclick="increaseQuantity('${item.id}')">
                            +
                        </button>

                        <span>

                            ${quantity}

                        </span>

                        <button
                            type="button"
                            onclick="decreaseQuantity('${item.id}')">
                            − 
                        </button>

                    </div>

                </div>

            </div>

        `;

    });

    /* =================================================
       SUBTOTAL
    ================================================= */

    if (cartSubtotal) {

        cartSubtotal.textContent =
            "$" +
            subtotal.toFixed(2);

    }

    /* =================================================
       TOTAL
    ================================================= */

    if (cartTotal) {

        cartTotal.textContent =
            "$" +
            subtotal.toFixed(2);

    }

    /* =================================================
       DRAWER COUNT
    ================================================= */

    if (cartDrawerCount) {

        cartDrawerCount.textContent =
            totalQuantity;

    }

    /* =================================================
       FREE SHIPPING
    ================================================= */

    if (freeShippingAmount) {

        let freeShippingLimit = 1000;

        let remaining =
            freeShippingLimit - subtotal;

        if (remaining > 0) {

            freeShippingAmount.textContent =
                "$" +
                remaining.toFixed(2);

        }
        else {

            freeShippingAmount.textContent =
                "$0.00";

        }

    }

}

/* =====================================================
   INCREASE QUANTITY
===================================================== */

function increaseQuantity(id) {

    let cart = getCart();

    let item =
        cart.find(
            item => item.id == id
        );

    if (item) {

        item.quantity =
            Number(item.quantity || 0) + 1;

    }

    saveCart(cart);

    updateCartCount();

    renderCart();

}

/* =====================================================
   DECREASE QUANTITY
===================================================== */

function decreaseQuantity(id) {

    let cart = getCart();

    let item =
        cart.find(
            item => item.id == id
        );

    if (item) {

        item.quantity =
            Number(item.quantity || 0) - 1;

        if (item.quantity <= 0) {

            cart =
                cart.filter(
                    item => item.id != id
                );
        }
    }

    saveCart(cart);

    updateCartCount();

    renderCart();

}

/* =====================================================
   REMOVE PRODUCT
===================================================== */

function removeFromCart(id) {

    let cart = getCart();

    cart =
        cart.filter(
            item => item.id != id
        );

    saveCart(cart);

    updateCartCount();

    renderCart();

}

/* =====================================================
   CART BUTTONS
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        /* ================= CLOSE BUTTON ================= */

        let closeCart =
            document.getElementById(
                "closeCart"
            );

        if (closeCart) {

            closeCart.addEventListener(
                "click",
                closeCartDrawer
            );

        }

        /* ================= OVERLAY ================= */

        let cartOverlay =
            document.getElementById(
                "cartOverlay"
            );

        if (cartOverlay) {

            cartOverlay.addEventListener(
                "click",
                closeCartDrawer
            );
        }

        /* ================= CART ICON ================= */

        let cartIcon =
            document.getElementById(
                "cartIcon"
            );

        if (cartIcon) {

            cartIcon.addEventListener(
                "click",
                openCartDrawer
            );
        }

        /* ================= CART BUTTON ================= */

        let cartBtn =
            document.getElementById(
                "cartBtn"
            );

        if (cartBtn) {

            cartBtn.addEventListener(
                "click",
                openCartDrawer
            );

        }

        /* ================= LOAD CART ================= */

        updateCartCount();

        renderCart();

    }
);

/* =====================================================
   UPDATE NAVBAR CART
===================================================== */

function updateNavbarCart() {

    let cart =
        JSON.parse(
            localStorage.getItem("flawlessCart")
        ) || [];

    let total = 0;
    let count = 0;

    cart.forEach(function (item) {

        let price = parseFloat(
            String(item.price).replace(/[^0-9.]/g, "")
        );

        let quantity = Number(item.quantity) || 1;

        total += price * quantity;
        count += quantity;

    });

    let cartPrice =
        document.getElementById("cartPrice");

    let cartCount =
        document.getElementById("cartCount");

    if (cartPrice) {

        cartPrice.textContent =
            "$" + total.toFixed(2);

    }

    if (cartCount) {

        cartCount.textContent = count;

    }

}

document.addEventListener(
    "DOMContentLoaded",
    function () {

        updateNavbarCart();

        let cartPrice =
            document.getElementById("cartPrice");

        if (cartPrice) {

            cartPrice.addEventListener(
                "click",
                function () {

                    let cartBtn =
                        document.getElementById("cartBtn");

                    if (cartBtn) {
                        cartBtn.click();
                    }

                }
            );

        }

    }
);