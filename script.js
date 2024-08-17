$(document).ready(function() {
    // المنتجات
    const products = [
        { id: 1, name: "ساعة فاخرة", price: 1999.99, image: "watch.jpg", category: "watches", badge: "جديد" },
        { id: 2, name: "قلادة ألماس", price: 2999.99, image: "https://img.freepik.com/free-photo/bust-showcase-jewelry-display-necklace-pendant-jewelry-lifestyle-fashion-accessories-mockup_460848-14309.jpg?t=st=1723760394~exp=1723763994~hmac=c5dbd773dd74018edd603942ff3065681d119708438bd323424d8377324b8f4e&w=900", category: "jewelry", badge: "حصري" },
        { id: 3, name: "حقيبة يد جلدية", price: 799.99, image: "https://img.freepik.com/free-photo/levitating-product-display-with-handbag_23-2149670639.jpg?t=st=1723760429~exp=1723764029~hmac=4c8e3619b76d21484a4badb6fe160853a971e9ba3d7483a0514f6108e7d51f7a&w=740", category: "bags" },
        { id: 4, name: "نظارة شمسية", price: 299.99, image: "https://img.freepik.com/free-photo/portrait-fashionable-boy-from_23-2148184634.jpg?t=st=1723760464~exp=1723764064~hmac=7eb2d9a7afe3a42580cb86dc6a5a50cb64bcba1a89d0fd0998928ee35c9c0f72&w=740", category: "accessories", badge: "خصم 20%" },
        { id: 5, name: "سوار ذهبي", price: 599.99, image: "https://img.freepik.com/free-photo/high-angle-hand-wearing-gold-bracelet_23-2149836442.jpg?t=st=1723760546~exp=1723764146~hmac=99db4402c7449d4f7e0c465ce262d5ea2afb4cbf04e4a5466c0a750aa131a2c6&w=740", category: "jewelry" },
        { id: 6, name: "محفظة أنيقة", price: 199.99, image: "https://img.freepik.com/free-photo/business-financial-concept-with-dollars-wallet-grey-surface-flat-lay_176474-6552.jpg?t=st=1723760610~exp=1723764210~hmac=2cf532ccb7a54e5c22ea73cd55ca197cd3422d74fab554f498a66c8a529eb289&w=740", category: "accessories" },
        // أضف المزيد من المنتجات هنا
    ];

    let cart = [];
    let currentFilter = 'all';
    let currentSort = 'featured';
    let productsPerPage = 8;
    let currentPage = 1;

    // عرض المنتجات
    function renderProducts() {
        const productGrid = $('#product-grid');
        productGrid.empty();

        let filteredProducts = products;
        if (currentFilter !== 'all') {
            filteredProducts = products.filter(product => product.category === currentFilter);
        }

        // الترتيب
        switch (currentSort) {
            case 'price-low-high':
                filteredProducts.sort((a, b) => a.price - b.price);
                break;
            case 'price-high-low':
                filteredProducts.sort((a, b) => b.price - a.price);
                break;
            case 'newest':
                filteredProducts.sort((a, b) => b.id - a.id);
                break;
        }

        const startIndex = (currentPage - 1) * productsPerPage;
        const endIndex = startIndex + productsPerPage;
        const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

        paginatedProducts.forEach(product => {
            const productCard = $(`
                <div class="product-card relative animated fadeInUp">
                    ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ''}
                    <img src="${product.image}" alt="${product.name}" class="product-image w-full">
                    <div class="p-4">
                        <h3 class="text-xl font-semibold">${product.name}</h3>
                        <p class="text-gray-600">${product.price.toFixed(2)} جنية</p>
                        <button class="add-to-cart mt-2" data-id="${product.id}">أضف إلى السلة</button>
                    </div>
                </div>
            `);
            productGrid.append(productCard);
        });

        updatePagination(filteredProducts.length);
    }

    // تحديث الترقيم
    function updatePagination(totalProducts) {
        const totalPages = Math.ceil(totalProducts / productsPerPage);
        $('#load-more').toggle(currentPage < totalPages);
    }

    // تحديث السلة
    function updateCart() {
        const cartCount = $('#cart-count');
        const cartItems = $('#cart-items');
        const cartTotal = $('#cart-total');

        cartCount.text(cart.length);
        cartItems.empty();

        let total = 0;
        cart.forEach(item => {
            const cartItem = $(`
                <div class="flex justify-between items-center mb-4">
                    <div>
                        <h4 class="font-semibold">${item.name}</h4>
                        <p class="text-gray-600">${item.price.toFixed(2)} جنية</p>
                    </div>
                    <button class="remove-from-cart text-red-500" data-id="${item.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `);
            cartItems.append(cartItem);
            total += item.price;
        });

        cartTotal.text(total.toFixed(2) + ' جنية');
    }

    // إضافة منتج إلى السلة
    $('#product-grid').on('click', '.add-to-cart', function() {
        const productId = $(this).data('id');
        const product = products.find(p => p.id === productId);
        cart.push(product);
        updateCart();

        Swal.fire({
            title: 'تمت الإضافة!',
            text: `تم إضافة ${product.name} إلى السلة`,
            icon: 'success',
            confirmButtonText: 'حسنًا'
        });

        gsap.from(this, {
            scale: 1.5,
            duration: 0.3,
            ease: "bounce.out"
        });
    });

    // إزالة منتج من السلة
    $('#cart-items').on('click', '.remove-from-cart', function() {
        const productId = $(this).data('id');
        cart = cart.filter(item => item.id !== productId);
        updateCart();
    });

    // فتح وإغلاق السلة
    $('#cart-icon').click(function() {
        $('#cart-sidebar').toggleClass('translate-x-full');
    });

    $('#close-cart').click(function() {
        $('#cart-sidebar').addClass('translate-x-full');
    });

    // تصفية المنتجات
    $('.filter-btn').click(function() {
        currentFilter = $(this).data('filter');
        currentPage = 1;
        $('.filter-btn').removeClass('active');
        $(this).addClass('active');
        renderProducts();
    });

    // ترتيب المنتجات
    $('#sort-select').change(function() {
        currentSort = $(this).val();
        renderProducts();
    });

    // تحميل المزيد من المنتجات
    $('#load-more').click(function() {
        currentPage++;
        renderProducts();
    });

    // نموذج الاتصال
    $('#contact-form').submit(function(e) {
        e.preventDefault();
        Swal.fire({
            title: 'شكرًا لك!',
            text: 'تم إرسال رسالتك بنجاح. سنتواصل معك قريبًا.',
            icon: 'success',
            confirmButtonText: 'حسنًا'
        });
        this.reset();
    });

    // الاشتراك في النشرة البريدية
    $('#newsletter-form').submit(function(e) {
        e.preventDefault();
        Swal.fire({
            title: 'تم الاشتراك!',
            text: 'شكرًا لاشتراكك في نشرتنا البريدية.',
            icon: 'success',
            confirmButtonText: 'حسنًا'
        });
        this.reset();
    });

    // زر التمرير لأعلى
    $(window).scroll(function() {
        if ($(this).scrollTop() > 300) {
            $('#scroll-to-top').addClass('visible');
        } else {
            $('#scroll-to-top').removeClass('visible');
        }
    });

    $('#scroll-to-top').click(function() {
        $('html, body').animate({scrollTop: 0}, 800);
    });

    // تهيئة Swiper للعروض والشهادات
    const offerSwiper = new Swiper('#offer-slider', {
        slidesPerView: 1,
        spaceBetween: 30,
        loop: true,
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        breakpoints: {
            640: {
                slidesPerView: 2,
            },
            768: {
                slidesPerView: 3,
            },
        }
    });

    const testimonialSwiper = new Swiper('#testimonial-slider', {
        slidesPerView: 1,
        spaceBetween: 30,
        loop: true,
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        breakpoints: {
            640: {
                slidesPerView: 2,
            },
            768: {
                slidesPerView: 3,
            },
        }
    });

    // تهيئة GSAP للحركات
    gsap.from(".hero-section h1", { opacity: 0, y: -50, duration: 1, ease: "power3.out" });
    gsap.from(".hero-section p", { opacity: 0, y: -30, duration: 1, delay: 0.3, ease: "power3.out" });
    gsap.from(".hero-section a", { opacity: 0, y: -20, duration: 1, delay: 0.6, ease: "power3.out" });

    // تهيئة ScrollTrigger للحركات عند التمرير
    gsap.registerPlugin(ScrollTrigger);

    gsap.utils.toArray('.category-card').forEach(card => {
        gsap.from(card, {
            opacity: 0,
            y: 50,
            duration: 0.8,
            scrollTrigger: {
                trigger: card,
                start: "top 80%"
            }
        });
    });

    // قائمة الجوال
    $('#mobile-menu-button').click(function() {
        $('#mobile-menu').slideToggle();
    });

    // تهيئة الصفحة
    renderProducts();
});