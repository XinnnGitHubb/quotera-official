/* ================= DATA PRODUK ================= */
const products = [
    {
        id: 1,
        name: "T-Shirt Unfinished Story",
        category: "pria",
        badge: "Baru",
        img: "Produk/Tshirt.png",
        gallery: [
            "Produk/Tshirt.png",
            "Produk/T%20shirt%20Studio.jpg",
            "Produk/T%20shirt%20studio%20use.jpg",
            "Produk/Depan.jpg"
        ],
        desc: "T-Shirt Unfinished Story menggunakan bahan cotton combed 24s yang nyaman dan cocok untuk pemakaian sehari-hari. Desain grafis khas Quotera memberi karakter pada potongan klasik yang mudah dipadukan."
    },
];

/* ================= STATE ================= */
let activeFloat = null;

/* ================= FLOAT WINDOW CONTROL ================= */
const overlay = document.getElementById("floatOverlay");

function openFloat(id, e) {
    if (e) e.preventDefault();
    const win = document.getElementById("float" + capitalize(id));
    if (!win) return;

    if (id === "katalog") renderProducts("katalog");

    // Ganti isi modal secara langsung agar tidak terjadi flash saat berpindah tab.
    document.querySelectorAll(".float-window").forEach(item => {
        item.classList.toggle("active", item === win);
    });
    win.classList.add("active");
    overlay.classList.add("active");
    if (!document.body.classList.contains("modal-open")) {
        document.body.classList.add("modal-open");
    }
    document.body.style.overflow = "hidden";
    activeFloat = id;

    updateNavActive(id);
}

function closeFloat() {
    document.querySelectorAll(".float-window").forEach(w => w.classList.remove("active"));
    overlay.classList.remove("active");
    document.body.style.overflow = "";
    if (document.body.classList.contains("modal-open")) {
        document.body.classList.remove("modal-open");
    }
    activeFloat = null;
    updateNavActive(null);
}

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function updateNavActive(id) {
    document.querySelectorAll(".nav-link").forEach(link => {
        const text = link.textContent.trim().toLowerCase();
        const isActive = (id === "home" && text === "home") ||
                         (id === "katalog" && text === "katalog") ||
                         (id === "tentang" && text === "tentang") ||
                         (id === "kontak" && text === "kontak");
        link.classList.toggle("active", isActive);
    });
}

overlay.addEventListener("click", closeFloat);

document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeFloat();
});

/* ================= RENDER PRODUK ================= */
function renderProducts(target = "katalog", filter = "all") {
    const gridId = target === "home" ? "productGridHome" : "productGrid";
    const productGrid = document.getElementById(gridId);
    if (!productGrid) return;

    productGrid.innerHTML = "";
    const filtered = filter === "all"
        ? products
        : products.filter(p => p.category === filter);

    const showCount = target === "home" ? 4 : filtered.length;

    filtered.slice(0, showCount).forEach(p => {
        const card = document.createElement("div");
        card.className = "product-card";
        card.style.cursor = "pointer";
        card.setAttribute("onclick", `openPemesanan(${p.id})`);
        card.innerHTML = `
            <div class="product-img ${p.id === 1 ? "product-img-artwork" : ""}" style="background-image:url('${p.img}')"></div>
            ${p.badge ? `<span class="product-badge">${p.badge}</span>` : ""}
            <div class="product-info">
                <h3>${p.name}</h3>
            </div>
        `;
        productGrid.appendChild(card);
    });

    if (target === "katalog") {
        document.querySelectorAll(".filter-btn").forEach(btn => {
            btn.classList.toggle("active", btn.dataset.filter === filter);
        });
    }
}

document.querySelectorAll(".filter-btn").forEach(btn => {
    btn.addEventListener("click", () => renderProducts("katalog", btn.dataset.filter));
});

/* ================= PEMESANAN PRODUK ================= */
function openPemesanan(id) {
    const p = products.find(prod => prod.id === id);
    if (!p) return;

    const body = document.getElementById("pemesananBody");
    const waText = `Halo Quotera, saya ingin bertanya tentang produk: ${p.name}`;
    const waLink = `https://wa.me/6281947828746?text=${encodeURIComponent(waText)}`;

    body.innerHTML = `
        <div class="pemesanan-produk">
            <div class="product-gallery" aria-label="Galeri foto ${p.name}">
                <div class="product-gallery-stage">
                    <img class="product-gallery-image" src="${p.gallery ? p.gallery[0] : p.img}" alt="${p.name}" id="productGalleryImage">
                    ${p.gallery && p.gallery.length > 1 ? `
                        <button class="gallery-arrow gallery-prev" type="button" aria-label="Foto sebelumnya" onclick="changeProductPhoto(-1)"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m15 18-6-6 6-6"/></svg></button>
                        <button class="gallery-arrow gallery-next" type="button" aria-label="Foto berikutnya" onclick="changeProductPhoto(1)"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 18 6-6-6-6"/></svg></button>
                    ` : ""}
                </div>
                ${p.gallery && p.gallery.length > 1 ? `
                    <div class="product-gallery-dots">
                        ${p.gallery.map((_, index) => `<button class="gallery-dot ${index === 0 ? "active" : ""}" type="button" aria-label="Lihat foto ${index + 1}" onclick="showProductPhoto(${index})"></button>`).join("")}
                    </div>
                ` : ""}
            </div>
            <div class="pemesanan-info">
                <span class="pemesanan-badge">${p.badge || "Tersedia"}</span>
                <h3>${p.name}</h3>
                <div class="pemesanan-desc">${p.desc}</div>
            </div>
        </div>

        <div class="pemesanan-metode">
            <h4>Pilih Metode Pemesanan</h4>

            <div class="metode-card offline">
                <div class="metode-icon">L</div>
                <div class="metode-info">
                    <strong>Ambil Langsung (Offline)</strong>
                    <span>Datang ke lokasi kami di Yogyakarta</span>
                </div>
                <div class="metode-wa">
                    <a href="${waLink}" target="_blank" class="btn btn-whatsapp btn-full">
                        Hubungi WhatsApp
                    </a>
                </div>
            </div>

            <div class="metode-card online">
                <div class="metode-icon">M</div>
                <div class="metode-info">
                    <strong>Checkout melalui Marketplace</strong>
                    <span>Anda akan diarahkan ke platform resmi untuk melihat toko dan menyelesaikan transaksi.</span>
                </div>
                <div class="metode-marketplace">
                    <a href="https://shopee.co.id" target="_blank" rel="noopener noreferrer" class="mkt-btn shopee">Lanjut ke Shopee</a>
                    <a href="https://tokopedia.com" target="_blank" rel="noopener noreferrer" class="mkt-btn tokopedia">Lanjut ke Tokopedia</a>
                    <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" class="mkt-btn tiktok">Lanjut ke TikTok Shop</a>
                </div>
            </div>
            <p class="marketplace-notice">Quotera tidak memproses pembayaran di website ini. Pembayaran dan checkout berlangsung di marketplace resmi agar terhindar dari penipuan dan kejadian yang tidak diinginkan.</p>
        </div>
    `;

    closeFloat();
    openFloat("pemesanan");
}

let currentProductPhoto = 0;

function showProductPhoto(index) {
    const product = products.find(item => item.id === 1);
    if (!product || !product.gallery) return;
    currentProductPhoto = (index + product.gallery.length) % product.gallery.length;

    const image = document.getElementById("productGalleryImage");
    if (image) {
        image.classList.add("changing");
        window.setTimeout(() => {
            image.src = product.gallery[currentProductPhoto];
            image.classList.remove("changing");
        }, 120);
    }

    document.querySelectorAll(".gallery-dot").forEach((dot, dotIndex) => {
        dot.classList.toggle("active", dotIndex === currentProductPhoto);
    });
}

function changeProductPhoto(direction) {
    showProductPhoto(currentProductPhoto + direction);
}

/* ================= SLIDESHOW ================= */
let currentSlide = 0;
const slides = document.querySelectorAll(".slide");
const dots = document.querySelectorAll(".dot");
const slideInterval = 5000;

function showSlide(index) {
    slides.forEach((s, i) => {
        s.classList.toggle("active", i === index);
    });
    dots.forEach((d, i) => {
        d.classList.toggle("active", i === index);
    });
    currentSlide = index;
}

function nextSlide() {
    const next = (currentSlide + 1) % slides.length;
    showSlide(next);
}

function prevSlide() {
    const prev = (currentSlide - 1 + slides.length) % slides.length;
    showSlide(prev);
}

dots.forEach((dot, index) => {
    dot.addEventListener("click", () => showSlide(index));
});

// Auto-play slideshow
setInterval(nextSlide, slideInterval);

/* ================= FORM KONTAK ================= */
document.getElementById("formKontak").addEventListener("submit", (e) => {
    e.preventDefault();
    const btn = e.target.querySelector("button[type='submit']");
    const original = btn.textContent;
    btn.textContent = "Mengirim...";
    btn.disabled = true;

    setTimeout(() => {
        alert("Terima kasih! Pesan kamu telah terkirim. Kami akan segera menghubungi kamu.");
        btn.textContent = original;
        btn.disabled = false;
        e.target.reset();
    }, 1200);
});

/* ================= NAVBAR SCROLL ================= */
const navbar = document.getElementById("navbar");
window.addEventListener("scroll", () => {
    if (window.scrollY > 20) {
        navbar.classList.add("scrolled");
    } else {
        navbar.classList.remove("scrolled");
    }
});

/* ================= MOBILE MENU ================= */
const btnMenu = document.getElementById("btnMenu");
const navLinks = document.querySelector(".nav-links");

btnMenu.addEventListener("click", () => {
    navLinks.classList.toggle("open");
});

document.querySelectorAll(".nav-link").forEach(link => {
    link.addEventListener("click", () => {
        navLinks.classList.remove("open");
    });
});

/* ================= INIT ================= */
window.addEventListener("DOMContentLoaded", () => {
    renderProducts("home");
});
