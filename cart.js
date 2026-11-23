let products = [];

/* ================= LOAD PRODUCT JSON ================= */

fetch("product.json")
    .then(response => response.json())
    .then(data => {

        products = data;

        loadProduct();

        updateCartCount();

        loadRelatedProducts();

    })
    .catch(error => {

        console.log("Product JSON Error:", error);

    });

/* ================= LOAD SELECTED PRODUCT ================= */

function loadProduct() {

    let params = new URLSearchParams(
        window.location.search
    );

    let productId = params.get("id");

    if (!productId) {

        console.log("Product ID not found");

        return;

    }

    let product = products.find(
        item => item.id == productId
    );

    if (!product) {

        console.log("Product not found:", productId);

        return;
    }

    /* ================= PRODUCT IMAGE ================= */

    let productImage =
        document.getElementById("productImage");

    if (productImage) {

        productImage.src = product.image;

        productImage.alt = product.name;

    }

    /* ================= CATEGORY ================= */

    let productCategory =
        document.getElementById("productCategory");

    if (productCategory) {

        productCategory.textContent =
            product.category;

    }

    let productCategoryText =
        document.getElementById("productCategoryText");

    if (productCategoryText) {

        productCategoryText.textContent =
            product.category;

    }

    let productCategoryBottom =
        document.getElementById("productCategoryBottom");

    if (productCategoryBottom) {

        productCategoryBottom.textContent =
            product.category;

    }

    /* ================= NAME ================= */

    let productName =
        document.getElementById("productName");

    if (productName) {

        productName.textContent =
            product.name;

    }

    let productNameBread =
        document.getElementById("productNameBread");

    if (productNameBread) {

        productNameBread.textContent =
            product.name;

    }

    /* ================= PRICE ================= */

    let productPrice =
        document.getElementById("productPrice");

    if (productPrice) {

        productPrice.textContent =
            product.price;

    }

    /* ================= ADD TO CART ================= */

    let addButton =
        document.getElementById("addProductCart");

    if (addButton) {

        addButton.addEventListener(
            "click",
            function () {

                let quantityInput =
                    document.getElementById(
                        "productQuantity"
                    );

                let quantity =
                    Number(
                        quantityInput.value
                    ) || 1;


                addProductToCart(
                    product,
                    quantity
                );

            }
        );

    }

}

/* ================= RELATED PRODUCTS ================= */

function loadRelatedProducts() {

    let relatedContainer =
        document.getElementById(
            "relatedProducts"
        );

    if (!relatedContainer) {

        return;

    }

    /* Current product ID */

    let params =
        new URLSearchParams(
            window.location.search
        );

    let currentId =
        params.get("id");

    /* Current product */

    let currentProduct =
        products.find(
            item => item.id == currentId
        );

    if (!currentProduct) {

        return;

    }

    /* Same category products */

    let relatedProducts =
        products.filter(
            function (item) {

                return (
                    item.id != currentProduct.id &&
                    item.category ==
                    currentProduct.category
                );

            }
        );

    /* Agar same category me kam products hain */

    if (relatedProducts.length < 2) {

        relatedProducts =
            products.filter(
                function (item) {

                    return item.id != currentProduct.id;

                }
            );
    }

    /* Sirf 2 products */

    relatedProducts =
        relatedProducts.slice(0, 2);

    /* Empty container */

    relatedContainer.innerHTML = "";

    /* Show related products */

    relatedProducts.forEach(
        function (item) {

            let card =
                document.createElement("div");

            card.className =
                "col-lg-3 col-md-6";

            card.innerHTML = `

                <div class="related-product-card">

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

                </div>
            `;

            /* Product par click */

            card.addEventListener(
                "click",
                function () {

                    window.location.href =
                        "cart.html?id=" +
                        item.id;
                }
            );

            relatedContainer.appendChild(card);
        }
    );
}
/* ================= ADD PRODUCT TO CART ================= */

function addProductToCart(product, quantity) {

    let cart =
        JSON.parse(
            localStorage.getItem(
                "flawlessCart"
            )
        ) || [];

    let existing =
        cart.find(
            item => item.id == product.id
        );

    if (existing) {

        existing.quantity =
            Number(existing.quantity || 0)
            + quantity;
    }

    else {

        cart.push({

            id: product.id,

            name: product.name,

            price: product.price,

            image: product.image,

            quantity: quantity

        });
    }

    localStorage.setItem(
        "flawlessCart",
        JSON.stringify(cart)
    );

    updateCartCount();

    /* OPEN ACTUAL CART PAGE */

    window.location.href =
        "cart.html";

}

/* ================= CART COUNT ================= */

function updateCartCount() {

    let cart =
        JSON.parse(
            localStorage.getItem(
                "flawlessCart"
            )
        ) || [];

    let count =
        cart.reduce(
            function (total, item) {

                return total +
                    Number(
                        item.quantity || 0
                    );
            },
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

}
/* ================= DESCRIPTION / REVIEWS TAB ================= */

let descriptionTab =
    document.getElementById("descriptionTab");

let reviewsTab =
    document.getElementById("reviewsTab");

let descriptionContent =
    document.getElementById("descriptionContent");

let reviewsContent =
    document.getElementById("reviewsContent");


if (
    descriptionTab &&
    reviewsTab &&
    descriptionContent &&
    reviewsContent
) {

    descriptionTab.addEventListener(
        "click",
        function () {

            descriptionTab.classList.add("active");

            reviewsTab.classList.remove("active");

            descriptionContent.style.display =
                "block";

            reviewsContent.style.display =
                "none";

        }
    );

    reviewsTab.addEventListener(
        "click",
        function () {

            reviewsTab.classList.add("active");

            descriptionTab.classList.remove("active");

            descriptionContent.style.display =
                "none";

            reviewsContent.style.display =
                "block";
        }
    );

}

/* ================= REVIEW PRODUCT NAME ================= */

let reviewProductName =
    document.getElementById(
        "reviewProductName"
    );

if (
    reviewProductName &&
    typeof product !== "undefined"
) {

    reviewProductName.textContent =
        product.name;

}

/* ================= RATING STARS ================= */

let ratingStars =
    document.querySelectorAll(
        "#ratingStars span"
    );

ratingStars.forEach(
    function (star) {

        star.addEventListener(
            "click",
            function () {

                let rating =
                    Number(
                        this.getAttribute(
                            "data-rating"
                        )
                    );

                ratingStars.forEach(
                    function (item) {

                        let itemRating =
                            Number(
                                item.getAttribute(
                                    "data-rating"
                                )
                            );

                        if (
                            itemRating <= rating
                        ) {

                            item.textContent = "★";

                            item.classList.add(
                                "active"
                            );

                        }
                        else {

                            item.textContent = "☆";

                            item.classList.remove(
                                "active"
                            );

                        }

                    }
                );

            }
        );

    }
);
const ratingRequired = document.getElementById("ratingRequired");

document.querySelectorAll("#ratingStars span").forEach(star => {

    star.addEventListener("click", function () {

        const rating = this.dataset.rating;

        ratingRequired.value = rating;

        document.querySelectorAll("#ratingStars span").forEach(s => {
            s.textContent = "☆";
        });

        for (let i = 0; i < rating; i++) {
            document.querySelectorAll("#ratingStars span")[i].textContent = "★";
        }

    });

});
