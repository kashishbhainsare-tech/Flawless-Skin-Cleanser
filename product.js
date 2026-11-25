
let products = [];
let currentProduct = null;

/* =========================================================
   LOAD PRODUCT JSON
========================================================= */

let params = new URLSearchParams(window.location.search);

let productId = params.get("id");
let source = params.get("source") || "home";

let jsonFile = "product.json";

if (source === "shop") {
    jsonFile = "shop.json";
}

fetch(jsonFile)
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {

        products = data;

        loadProduct();

    })
    .catch(function(error) {

        console.log("Product JSON Error:", error);

    });

/* =========================================================
   LOAD SELECTED PRODUCT
========================================================= */

function loadProduct() {

    if (!productId) {
        console.log("Product ID not found");
        return;
    }

    let product = products.find(function(item) {

        return item.id == productId;

    });

    if (!product) {

        console.log("Product not found:", productId);
        return;

    }

    currentProduct = product;

    /* ================= IMAGE ================= */

    let productImage = document.getElementById("productImage");

    if (productImage) {

        productImage.src = product.image;
        productImage.alt = product.name;

    }

    /* ================= CATEGORY ================= */

    let category = document.getElementById("productCategory");

    if (category) {
        category.textContent = product.category;
    }

    let categoryText = document.getElementById("productCategoryText");

    if (categoryText) {
        categoryText.textContent = product.category;
    }

    let categoryBottom =
        document.getElementById("productCategoryBottom");

    if (categoryBottom) {
        categoryBottom.textContent = product.category;
    }

    /* ================= NAME ================= */

    let productName = document.getElementById("productName");

    if (productName) {
        productName.textContent = product.name;
    }

    let productNameBread =
        document.getElementById("productNameBread");

    if (productNameBread) {
        productNameBread.textContent = product.name;
    }

    /* ================= PRICE ================= */

    let productPrice =
        document.getElementById("productPrice");

    if (productPrice) {
        productPrice.textContent = product.price;
    }

    /* ================= REVIEW PRODUCT NAME ================= */

    let reviewProductName =
        document.getElementById("reviewProductName");

    if (reviewProductName) {
        reviewProductName.textContent = product.name;
    }

    /* ================= DESCRIPTION ================= */

    let description =
        document.getElementById("productDescription");

    if (description) {
        description.textContent = product.description || "";
    }

    /* ================= RATING ================= */

    loadRating(product);

    /* ================= REVIEWS ================= */

    loadReviews(product);

    /* ================= RELATED PRODUCTS ================= */

    loadRelatedProducts(product);

    /* ================= TABS ================= */

    setupProductTabs();

    /* ================= REVIEW FORM ================= */

    setupReviewForm();

    /* =====================================================
       ADD TO CART BUTTON
    ===================================================== */

    let addButton =
        document.getElementById("addProductCart");

    if (addButton) {

        addButton.type = "button";

        addButton.addEventListener("click", function(event) {

            event.preventDefault();
            event.stopPropagation();
            event.stopImmediatePropagation();

            let quantityInput =
                document.getElementById("productQuantity");

            let quantity =
                Number(quantityInput?.value) || 1;

            if (quantity < 1) {
                quantity = 1;
            }

            /* ADD PRODUCT */

            addProductToCart(product, quantity);

        });
    }

    /* ================= CART COUNT ================= */

    updateProductPageCartCount();

}

/* =========================================================
   PRODUCT RATING
========================================================= */

function loadRating(product) {

    let ratingBox =
        document.getElementById("productRating");


    if (!ratingBox) {
        return;
    }

    let rating =
        Number(product.rating) || 0;

    let reviewCount =
        Number(product.reviewCount) || 0;

    let stars = "";

    for (let i = 1; i <= 5; i++) {

        if (i <= Math.round(rating)) {

            stars +=
                '<i class="bi bi-star-fill"></i>';

        } else {

            stars +=
                '<i class="bi bi-star"></i>';

        }

    }

    ratingBox.innerHTML = `

        <span class="text-warning me-2">

            ${stars}

        </span>

        <span class="text-secondary">

            ${rating} (${reviewCount} reviews)

        </span>

    `;

}

/* =========================================================
   REVIEWS
========================================================= */

function loadReviews(product) {

    let reviewBox =
        document.getElementById("productReviews");


    if (!reviewBox) {
        return;
    }

    let reviews =
        product.reviews || [];

    reviewBox.innerHTML = "";

    if (reviews.length === 0) {

        reviewBox.innerHTML = `

            <p class="text-secondary">

                No reviews yet.

            </p>

        `;
        return;
    }

    reviews.forEach(function(review) {

        let stars = "";

        for (let i = 1; i <= 5; i++) {

            if (i <= Number(review.rating)) {

                stars +=
                    '<i class="bi bi-star-fill"></i>';

            } else {

                stars +=
                    '<i class="bi bi-star"></i>';
            }
        }

        reviewBox.innerHTML += `

            <div class="border-bottom pb-4 mb-4">

                <div class="d-flex
                            justify-content-between
                            align-items-center
                            flex-wrap">

                    <h6 class="mb-2">

                        ${review.name}

                    </h6>

                    <div class="text-warning">

                        ${stars}

                    </div>

                </div>

                <p class="text-secondary mb-0">

                    ${review.comment}

                </p>

            </div>

        `;

    });

}

/* =========================================================
   DESCRIPTION / REVIEWS TABS
========================================================= */

function setupProductTabs() {

    let descriptionTab =
        document.getElementById("descriptionTab");

    let reviewsTab =
        document.getElementById("reviewsTab");

    let descriptionContent =
        document.getElementById("descriptionContent");

    let reviewsContent =
        document.getElementById("reviewsContent");

    if (
        !descriptionTab ||
        !reviewsTab ||
        !descriptionContent ||
        !reviewsContent
    ) {

        return;

    }

    descriptionTab.addEventListener("click", function() {

        descriptionTab.classList.add("active");

        reviewsTab.classList.remove("active");


        descriptionContent.style.display = "block";

        reviewsContent.style.display = "none";

    });

    reviewsTab.addEventListener("click", function() {

        reviewsTab.classList.add("active");

        descriptionTab.classList.remove("active");
        descriptionContent.style.display = "none";

        reviewsContent.style.display = "block";
    });
}

/* =========================================================
   REVIEW FORM
========================================================= */

function setupReviewForm() {

    let reviewForm =
        document.getElementById("reviewForm");

    if (!reviewForm) {
        return;
    }

    let stars =
        document.querySelectorAll("#ratingStars span");

    let ratingRequired =
        document.getElementById("ratingRequired");

    /* ================= STAR CLICK ================= */

    stars.forEach(function(star) {

        star.addEventListener("click", function() {

            let selectedRating =
                Number(star.dataset.rating);

            stars.forEach(function(item) {

                let itemRating =
                    Number(item.dataset.rating);

                if (itemRating <= selectedRating) {

                    item.textContent = "★";

                    item.classList.add("active");

                } else {

                    item.textContent = "☆";

                    item.classList.remove("active");

                }
            });

            if (ratingRequired) {

                ratingRequired.value =
                    selectedRating;

            }

        });

    });

    /* ================= FORM SUBMIT ================= */

    reviewForm.addEventListener("submit", function(event) {

        event.preventDefault();

        if (
            ratingRequired &&
            !ratingRequired.value
        ) {

            ratingRequired.setCustomValidity(
                "Please select a rating."
            );

        } else if (ratingRequired) {

            ratingRequired.setCustomValidity("");

        }

        if (!reviewForm.checkValidity()) {

            reviewForm.reportValidity();

            return;

        }

        alert(
            "Thank you! Your review has been submitted."
        );

        reviewForm.reset();


        stars.forEach(function(star) {

            star.textContent = "☆";

            star.classList.remove("active");

        });

        if (ratingRequired) {

            ratingRequired.value = "";

        }

    });

}

/* =========================================================
   ADD PRODUCT TO CART
========================================================= */

function addProductToCart(product, quantity) {

    let cart =
        JSON.parse(
            localStorage.getItem("flawlessCart")
        ) || [];

    /* ================= CHECK EXISTING PRODUCT ================= */

    let existing =
        cart.find(function(item) {

            return item.id == product.id;

        });

    if (existing) {

        existing.quantity =
            Number(existing.quantity || 0) +
            quantity;

    } else {

        cart.push({

            id: product.id,

            name: product.name,

            price: product.price,

            image: product.image,

            category: product.category,

            quantity: quantity

        });

    }

    /* ================= SAVE CART ================= */

    localStorage.setItem(
        "flawlessCart",
        JSON.stringify(cart)
    );

    /* ================= UPDATE NAVBAR COUNT ================= */

    updateProductPageCartCount();

    /* ================= OPEN CART DRAWER ================= */

    openCartDrawer();

}

/* =========================================================
   CART COUNT
========================================================= */

function updateProductPageCartCount() {

    let cart =
        JSON.parse(
            localStorage.getItem("flawlessCart")
        ) || [];

    let count =
        cart.reduce(function(total, item) {

            return total +
                Number(item.quantity || 0);

        }, 0);

    let cartCount =
        document.getElementById("cartCount");

    if (cartCount) {

        cartCount.textContent = count;

    }

    /* Also update drawer count */

    let drawerCount =
        document.getElementById("cartDrawerCount");

    if (drawerCount) {

        drawerCount.textContent = count;
    }
}

/* =========================================================
   RELATED PRODUCTS
========================================================= */

function loadRelatedProducts(currentProduct) {

    let container =
        document.getElementById("relatedProducts");

    if (!container) {
        return;
    }

    let relatedProducts =
        products.filter(function(item) {

            return (
                item.id != currentProduct.id &&
                item.category == currentProduct.category
            );

        });

    /* ================= FALLBACK ================= */

    if (relatedProducts.length < 2) {

        relatedProducts =
            products.filter(function(item) {

                return item.id != currentProduct.id;

            });
    }
    /* ONLY 2 */

    relatedProducts =
        relatedProducts.slice(0, 2);

    container.innerHTML = "";

    /* ================= CREATE PRODUCTS ================= */

    relatedProducts.forEach(function(item) {

        container.innerHTML += `

            <div class="col-lg-3 col-md-6 col-12">

                <div class="related-product-card">

                    <a
                        href="product.html?id=${item.id}"
                        class="text-decoration-none">

                        <div class="related-product-image">

                            <img
                                src="${item.image}"
                                alt="${item.name}">

                        </div>

                        <p class="related-category">

                            ${item.category}

                        </p>

                        <h3 class="related-name">

                            ${item.name}

                        </h3>

                        <p class="related-price">

                            ${item.price}

                        </p>

                    </a>

                </div>

            </div>

        `;

    });

}

/* =========================================================
   OPEN CART DRAWER
========================================================= */

function openCartDrawer() {

    let drawer =
        document.getElementById("cartDrawer");


    let overlay =
        document.getElementById("cartOverlay");


    if (!drawer || !overlay) {

        console.log(
            "Cart drawer HTML not found in product.html"
        );

        return;

    }

    /* OPEN */

    drawer.classList.add("show");

    overlay.classList.add("show");

    /* LOAD CART */

    loadCartDrawer();

}

/* =========================================================
   CLOSE CART DRAWER
========================================================= */

function closeCartDrawer() {

    let drawer =
        document.getElementById("cartDrawer");

    let overlay =
        document.getElementById("cartOverlay");

    if (drawer) {

        drawer.classList.remove("show");

    }

    if (overlay) {

        overlay.classList.remove("show");

    }

}

/* =========================================================
   CLOSE CART BUTTON
========================================================= */

document.addEventListener("DOMContentLoaded", function() {

    let closeButton =
        document.getElementById("closeCart");

    if (closeButton) {

        closeButton.addEventListener(
            "click",
            function() {

                closeCartDrawer();

            }
        );

    }

});

/* =========================================================
   LOAD CART DRAWER
========================================================= */
function loadCartDrawer() {

    let cart =
        JSON.parse(
            localStorage.getItem("flawlessCart")
        ) || [];

    let cartItems =
        document.getElementById("cartItems");

    let subtotal =
        document.getElementById("cartSubtotal");

    let total =
        document.getElementById("cartTotal");

    let drawerCount =
        document.getElementById("cartDrawerCount");

    if (!cartItems) {
        return;
    }

    cartItems.innerHTML = "";

    let totalAmount = 0;
    let totalQuantity = 0;

    /* ================= EMPTY CART ================= */

    if (cart.length === 0) {

        cartItems.innerHTML = `
            <div class="empty-cart">
                <p>Your cart is empty.</p>
            </div>
        `;

    }

    /* ================= CART PRODUCTS ================= */

    cart.forEach(function(item) {

        let price =
            parseFloat(
                String(item.price)
                    .replace("$", "")
            ) || 0;

        let quantity =
            Number(item.quantity) || 1;

        totalAmount += price * quantity;
        totalQuantity += quantity;

        cartItems.innerHTML += `

            <div class="cart-item">

                <img
                    src="${item.image}"
                    alt="${item.name}"
                    class="cart-product-image"
                >

                <div class="cart-item-info">

                    <div class="cart-item-name">
                        ${item.name}
                    </div>

                    <div class="cart-item-price">
                        $${price.toFixed(2)}
                    </div>

                    <button
                        type="button"
                         class="remove-cart-item"
                        onclick="removeCartItem(${item.id})"
                    >
                        REMOVE
                    </button>

                </div>

                <div class="cart-quantity-box">

                    <button
                        type="button"
                        onclick="changeCartQuantity(${item.id}, 1)"
                    >
                        +
                    </button>

                    <span>
                        ${quantity}
                    </span>

                    <button
                        type="button"
                        onclick="changeCartQuantity(${item.id}, -1)"
                    >
                        −
                    </button>

                </div>

            </div>

        `;

    });

    /* ================= TOTAL ================= */

    if (subtotal) {

        subtotal.textContent =
            "$" + totalAmount.toFixed(2);

    }

    if (total) {

        total.textContent =
            "$" + totalAmount.toFixed(2);

    }

    if (drawerCount) {

        drawerCount.textContent =
            totalQuantity;

    }

    /* ================= CART COUNT ================= */

    updateProductPageCartCount();

}

    /* ================= NAVBAR COUNT ================= */

    let cartCount =
        document.getElementById("cartCount");

    if (cartCount) {

        cartCount.textContent =
            totalQuantity;

    }

/* =========================================================
   CHANGE CART QUANTITY
========================================================= */

function changeCartQuantity(id, change) {

    let cart =
        JSON.parse(
            localStorage.getItem("flawlessCart")
        ) || [];

    let item =
        cart.find(function(product) {

            return product.id == id;

        });

    if (!item) {
        return;
    }

    item.quantity =
        Number(item.quantity) + change;

    if (item.quantity <= 0) {

        cart =
            cart.filter(function(product) {

                return product.id != id;

            });
    }

    localStorage.setItem(
        "flawlessCart",
        JSON.stringify(cart)
    );

    updateProductPageCartCount();

    loadCartDrawer();

}

/* =========================================================
   REMOVE CART ITEM
========================================================= */

function removeCartItem(id) {

    let cart =
        JSON.parse(
            localStorage.getItem("flawlessCart")
        ) || [];
    cart =
        cart.filter(function(item) {

            return item.id != id;

        });

    localStorage.setItem(
        "flawlessCart",
        JSON.stringify(cart)
    );

    updateProductPageCartCount();

    loadCartDrawer();

}
/* =========================================================
   CART DRAWER EVENTS
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        /* ================= CLOSE ARROW ================= */

        let closeButton =
            document.getElementById("closeCart");

        let overlay =
            document.getElementById("cartOverlay");

        if (closeButton) {

            closeButton.addEventListener(
                "click",
                function() {

                    closeCartDrawer();

                }
            );

        }

        /* ================= OVERLAY ================= */

        if (overlay) {

            overlay.addEventListener(
                "click",
                function() {

                    closeCartDrawer();

                }
            );

        }

        /* ================= CART COUNT ================= */

        updateProductPageCartCount();

    }
);