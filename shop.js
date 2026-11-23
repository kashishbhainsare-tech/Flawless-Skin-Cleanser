let products = [];
let currentProducts = [];

let currentPage = 1;
let productsPerPage = 12;

/* =========================================================
   LOAD PRODUCTS
========================================================= */

fetch("shop.json")

    .then(response => response.json())

    .then(data => {

        products = data;

        currentProducts = [...products];

        currentPage = 1;

        showProducts(currentProducts);

        updateCartCount();

        /* SORTING */

        let sorting =
            document.getElementById("sorting");

        if (sorting) {

            sorting.addEventListener(
                "change",
                function () {

                    sortProducts(this.value);

                }
            );

        }

    })

    .catch(error => {

        console.log("JSON Error:", error);

    });

/* =========================================================
   SHOW PRODUCTS
========================================================= */

function showProducts(productList) {

    let productBox =
        document.getElementById("shopProducts");

    if (!productBox) {

        return;

    }

    productBox.innerHTML = "";

    /* PAGINATION */

    let start =
        (currentPage - 1) *
        productsPerPage;

    let end =
        start +
        productsPerPage;

    let pageProducts =
        productList.slice(start, end);

    /* SHOW PRODUCTS */

    pageProducts.forEach(product => {

        productBox.innerHTML += `

            <div class="col-12 col-sm-6 col-lg-4 mb-5">

                <div class="position-relative product-card">

                    <a
                        href="product.html?id=${product.id}"
                        class="text-decoration-none">

                        <img
                            src="${product.image}"
                            class="img-fluid w-100"
                            alt="${product.name}">
                    </a>

                    <div
                        class="add-cart-wrapper
                               position-absolute
                               top-0
                               end-0
                               m-3
                               d-flex
                               align-items-center">

                        <span
                            class="add-cart-text
                                   bg-dark
                                   text-white
                                   px-3
                                   py-2
                                   small">

                            Add to cart

                        </span>

                        <button
                            type="button"
                            onclick="addToCart(${product.id})"
                            class="add-cart-btn
                                   bg-white
                                   border-0
                                   rounded-circle
                                   shadow-sm
                                   d-flex
                                   align-items-center
                                   justify-content-center">

                            <i class="bi bi-bag-fill"></i>

                        </button>

                    </div>

                </div>

                <a
                    href="product.html?id=${product.id}"
                    class="text-decoration-none text-dark">

                    <p
                        class="text-secondary
                               mt-3
                               mb-2
                               small">

                        ${product.category}

                    </p>

                    <h6
                        class="fw-normal
                               mb-2">

                        ${product.name}

                    </h6>

                    <p
                        class="fw-semibold
                               mb-0">

                        ${product.price}

                    </p>

                </a>

            </div>

        `;

    });

    /* RESULT TEXT */

    updateResultText(productList);

    /* PAGINATION */

    updatePagination(productList);

}

/* =========================================================
   RESULT TEXT
========================================================= */

function updateResultText(productList) {

    let resultText =
        document.getElementById("resultCount");

    if (!resultText) {

        return;

    }

    let total =
        productList.length;

    if (total === 0) {

        resultText.textContent =
            "Showing 0 results";

        return;
    }

    let start =
        (currentPage - 1) *
        productsPerPage + 1;

    let end =
        Math.min(
            currentPage *
            productsPerPage,
            total
        );

    resultText.textContent =
        "Showing " +
        start +
        "–" +
        end +
        " of " +
        total +
        " results";

}

/* =========================================================
   PAGINATION
========================================================= */

function updatePagination(productList) {

    let pagination =
        document.getElementById("pagination");

    if (!pagination) {

        return;

    }

    pagination.innerHTML = "";

    let totalPages =
        Math.ceil(
            productList.length /
            productsPerPage
        );

    /* ONLY ONE PAGE */

    if (totalPages <= 1) {

        return;

    }

    /* PREVIOUS */

    if (currentPage > 1) {

        pagination.innerHTML += `

            <button
                type="button"
                class="page-btn"
                onclick="goToPage(${currentPage - 1})">
                ←
            </button>

        `;

    }

    /* PAGE NUMBERS */

    for (
        let i = 1;
        i <= totalPages;
        i++
    ) {

        pagination.innerHTML += `

            <button
                type="button"
                class="page-btn
                       ${i === currentPage ? "active" : ""}"
                onclick="goToPage(${i})">

                ${i}

            </button>

        `;

    }

    /* NEXT */

    if (currentPage < totalPages) {

        pagination.innerHTML += `

            <button
                type="button"
                class="page-btn"
                onclick="goToPage(${currentPage + 1})">
                →
            </button>

        `;

    }

}

/* =========================================================
   GO TO PAGE
========================================================= */

function goToPage(page) {

    let totalPages =
        Math.ceil(
            currentProducts.length /
            productsPerPage
        );

    if (
        page < 1 ||
        page > totalPages
    ) {

        return;

    }

    currentPage = page;

    showProducts(currentProducts);

    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });

}

/* =========================================================
   GET PRICE
========================================================= */

function getPrice(product) {

    let price =
        product.price;

    if (typeof price === "number") {

        return price;

    }

    price = String(price)

        .replace("$", "")

        .replace(",", "")

        .split("–")[0]

        .split("-")[0]

        .trim();

    return parseFloat(price) || 0;

}

/* =========================================================
   SORT PRODUCTS
========================================================= */

function sortProducts(value) {

    let sortedProducts =
        [...currentProducts];

    /* DEFAULT */

    if (value === "default") {

        sortedProducts =
            [...products];
    }

    /* POPULARITY */

    else if (value === "popularity") {

        sortedProducts.sort(
            (a, b) =>
                (b.popularity || 0) -
                (a.popularity || 0)
        );

    }
    /* RATING */

    else if (value === "rating") {

        sortedProducts.sort(
            (a, b) =>
                (b.rating || 0) -
                (a.rating || 0)
        );

    }
    /* LATEST */

    else if (value === "latest") {

        sortedProducts.sort(
            (a, b) =>
                new Date(b.date || 0) -
                new Date(a.date || 0)
        );

    }
    /* PRICE LOW TO HIGH */

    else if (value === "price-low") {

        sortedProducts.sort(
            (a, b) =>
                getPrice(a) -
                getPrice(b)
        );

    }
    /* PRICE HIGH TO LOW */

    else if (value === "price-high") {

        sortedProducts.sort(
            (a, b) =>
                getPrice(b) -
                getPrice(a)
        );

    }

    currentProducts =
        sortedProducts;

    currentPage = 1;

    showProducts(
        currentProducts
    );

}

/* =========================================================
   PRICE SLIDER
========================================================= */

let minPrice =
    document.getElementById("minPrice");

let maxPrice =
    document.getElementById("maxPrice");

let minPriceText =
    document.getElementById("minPriceText");

let maxPriceText =
    document.getElementById("maxPriceText");

/* MIN PRICE */

if (minPrice) {

    minPrice.addEventListener(
        "input",
        function () {

            if (
                maxPrice &&
                Number(minPrice.value) >
                Number(maxPrice.value)
            ) {

                minPrice.value =
                    maxPrice.value;

            }

            if (minPriceText) {

                minPriceText.textContent =
                    minPrice.value;
            }
        }
    );

}

/* MAX PRICE */

if (maxPrice) {

    maxPrice.addEventListener(
        "input",
        function () {

            if (
                minPrice &&
                Number(maxPrice.value) <
                Number(minPrice.value)
            ) {

                maxPrice.value =
                    minPrice.value;

            }

            if (maxPriceText) {

                maxPriceText.textContent =
                    maxPrice.value;
            }
        }
    );
}

/* =========================================================
   PRICE FILTER
========================================================= */

let filterBtn =
    document.getElementById("filterBtn");

if (filterBtn) {

    filterBtn.addEventListener(
        "click",
        function () {

            let min =
                Number(
                    minPrice.value
                );

            let max =
                Number(
                    maxPrice.value
                );

            currentProducts =
                products.filter(
                    function (product) {

                        let price =
                            getPrice(product);

                        return (
                            price >= min &&
                            price <= max
                        );
                    }
                );

            currentPage = 1;

            showProducts(
                currentProducts
            );
        }
    );
}

/* =========================================================
   ADD TO CART
========================================================= */

function addToCart(id) {

    let product =
        products.find(
            p => p.id == id
        );

    if (!product) {

        console.log(
            "Product not found:",
            id
        );

        return;

    }

    let cart =
        JSON.parse(
            localStorage.getItem(
                "flawlessCart"
            )
        ) || [];

    let existing =
        cart.find(
            item => item.id == id
        );

    if (existing) {

        existing.quantity++;

    }

    else {

        cart.push({

            id: product.id,

            name: product.name,

            price: product.price,

            image: product.image,

            quantity: 1

        });
    }

    localStorage.setItem(
        "flawlessCart",
        JSON.stringify(cart)
    );

    updateCartCount();

    renderCart();

    openCartDrawer();

}

/* =========================================================
   UPDATE CART COUNT
========================================================= */

function updateCartCount() {

    let cart =
        JSON.parse(
            localStorage.getItem(
                "flawlessCart"
            )
        ) || [];

    let count =
        cart.reduce(
            (total, item) =>
                total +
                Number(
                    item.quantity || 0
                ),
            0
        );

    let cartCount =
        document.getElementById(
            "cartCount"
        );

    if (cartCount) {

        cartCount.textContent =
            count;
    }

    let cartDrawerCount =
        document.getElementById(
            "cartDrawerCount"
        );

    if (cartDrawerCount) {

        cartDrawerCount.textContent =
            count;
    }
}

/* =========================================================
   OPEN CART
========================================================= */

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

        cartDrawer.classList.add(
            "open"
        );
    }

    if (cartOverlay) {

        cartOverlay.classList.add(
            "show"
        );

    }

    renderCart();

}

/* =========================================================
   CLOSE CART
========================================================= */

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

        cartDrawer.classList.remove(
            "open"
        );

    }

    if (cartOverlay) {

        cartOverlay.classList.remove(
            "show"
        );

    }

}

/* =========================================================
   RENDER CART
========================================================= */

function renderCart() {

    let cart =
        JSON.parse(
            localStorage.getItem(
                "flawlessCart"
            )
        ) || [];

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

    if (!cartItems) {

        return;

    }

    cartItems.innerHTML = "";

    let subtotal = 0;

    let totalQuantity = 0;

    /* EMPTY CART */

    if (cart.length === 0) {

        cartItems.innerHTML = `

            <div class="text-center p-5">

                <i class="bi bi-bag
                          fs-1
                          text-secondary">
                </i>

                <p class="text-secondary mt-3">

                    Your cart is empty.

                </p>

            </div>

        `;

    }

    /* CART PRODUCTS */

    cart.forEach(item => {

        let price =
            parseFloat(

                String(item.price)

                    .replace("$", "")

                    .replace(",", "")

                    .split("–")[0]

                    .split("-")[0]

                    .trim()

            ) || 0;

        let quantity =
            Number(
                item.quantity
            ) || 1;

        let itemTotal =
            price *
            quantity;

        subtotal +=
            itemTotal;

        totalQuantity +=
            quantity;

        cartItems.innerHTML += `

            <div class="cart-item">

                <div class="d-flex gap-3 p-3">

                    <img
                        src="${item.image}"
                        alt="${item.name}"
                        width="90"
                        height="90"
                        class="rounded object-fit-cover">

                    <div class="flex-grow-1">

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

                        <button
                            type="button"
                            class="border-0
                                   bg-transparent
                                   p-0
                                   text-danger
                                   small"
                            onclick="removeFromCart(${item.id})">

                            REMOVE

                        </button>

                    </div>

                    <!-- QUANTITY -->

                    <div class="cart-quantity">

                        <button
                            type="button"
                            onclick="increaseQuantity(${item.id})">
                            +
                        </button>

                        <span>

                            ${quantity}

                        </span>

                        <button
                            type="button"
                            onclick="decreaseQuantity(${item.id})">
                            −
                        </button>

                    </div>

                </div>

            </div>

        `;

    });

    /* TOTAL */

    if (cartSubtotal) {

        cartSubtotal.textContent =
            "$" +
            subtotal.toFixed(2);

    }

    if (cartTotal) {

        cartTotal.textContent =
            "$" +
            subtotal.toFixed(2);

    }

    if (cartDrawerCount) {

        cartDrawerCount.textContent =
            totalQuantity;
    }
}

/* =========================================================
   INCREASE QUANTITY
========================================================= */

function increaseQuantity(id) {

    let cart =
        JSON.parse(
            localStorage.getItem(
                "flawlessCart"
            )
        ) || [];

    let item =
        cart.find(
            item => item.id == id
        );

    if (item) {

        item.quantity =
            Number(item.quantity) + 1;

    }

    localStorage.setItem(
        "flawlessCart",
        JSON.stringify(cart)
    );

    updateCartCount();

    renderCart();

}

/* =========================================================
   DECREASE QUANTITY
========================================================= */

function decreaseQuantity(id) {

    let cart =
        JSON.parse(
            localStorage.getItem(
                "flawlessCart"
            )
        ) || [];

    let item =
        cart.find(
            item => item.id == id
        );

    if (item) {

        item.quantity =
            Number(item.quantity) - 1;

        if (item.quantity <= 0) {

            cart =
                cart.filter(
                    item => item.id != id
                );
        }
    }

    localStorage.setItem(
        "flawlessCart",
        JSON.stringify(cart)
    );

    updateCartCount();

    renderCart();
}

/* =========================================================
   REMOVE PRODUCT
========================================================= */

function removeFromCart(id) {

    let cart =
        JSON.parse(
            localStorage.getItem(
                "flawlessCart"
            )
        ) || [];

    cart =
        cart.filter(
            item => item.id != id
        );

    localStorage.setItem(
        "flawlessCart",
        JSON.stringify(cart)
    );

    updateCartCount();

    renderCart();

}
/* =========================================================
   CLOSE BUTTON + OVERLAY
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

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

        /* LOAD EXISTING CART */

        updateCartCount();

        renderCart();

    }
);

/* =========================================================
   CART BUTTON
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        let cartBtn =
            document.getElementById(
                "cartBtn"
            );

        if (cartBtn) {

            cartBtn.addEventListener(
                "click",
                function () {

                    openCartDrawer();

                }
            );

        }

    }
);
function updateNavbarCart() {

    let cart = JSON.parse(localStorage.getItem("flawlessCart")) || [];

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

    document.getElementById("cartPrice").textContent =
        "$" + total.toFixed(2);

    document.getElementById("cartCount").textContent = count;
}
updateNavbarCart();

document.getElementById("cartPrice").addEventListener("click", function () {
    document.getElementById("cartBtn").click();
});