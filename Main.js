document.addEventListener('DOMContentLoaded', function () {
    function showMenu(toggleId, navId) {
        const toggle = document.getElementById(toggleId);
        const nav = document.getElementById(navId);
        if (!toggle || !nav) return;

        toggle.addEventListener('click', function () {
            nav.classList.toggle('show-menu');
            toggle.classList.toggle('show-icon');
            const isOpen = nav.classList.contains('show-menu');
            toggle.setAttribute('aria-expanded', isOpen);
        });
    }

    showMenu('nav-toggle', 'nav-menu');
    document.querySelectorAll('.card__read').forEach(function (link) {
        link.setAttribute('role', 'button');
    });

    const searchInput = document.getElementById('site-search');
    if (searchInput) {
        searchInput.addEventListener('keyup', function (e) {
            const query = e.target.value.toLowerCase();
            document.querySelectorAll('.card').forEach(function (card) {
                const title = card.querySelector('.card__title')?.textContent || '';
                const excerpt = card.querySelector('.card__excerpt')?.textContent || '';
                const visible = title.toLowerCase().includes(query) || excerpt.toLowerCase().includes(query);
                card.style.display = visible ? 'flex' : 'none';
            });
        });
    }

    const main = document.querySelector('main');
    if (main && !main.id) {
        main.id = 'main-content';
    }

        function initArticleGallery() {
            const articleImageEl = document.getElementById('article-image');
            if (!articleImageEl) return; 

            const galleryContainer = document.querySelector('.gallery-container');
            let imageUrls = [];
            if (galleryContainer && galleryContainer.dataset.imageUrls) {
                try {
                    imageUrls = JSON.parse(galleryContainer.dataset.imageUrls);
                } catch (e) {
                    console.error('Error parsing imageUrls data attribute:', e);
                    return;
                }
            } else {
                console.warn('No imageUrls data attribute found on .gallery-container');
                return;
            }

            // State
            let currentIndex = 0;
            let scale = 1;
            let translateX = 0;
            let translateY = 0;
            let isPanning = false;
            let startX = 0, startY = 0, pointerId = null;

            // Elements
            const prevBtn = document.getElementById('prev-btn');
            const nextBtn = document.getElementById('next-btn');
            const zoomBtn = document.getElementById('zoom-btn');
            const currentImageSpan = document.getElementById('current-image');
            const totalImagesSpan = document.getElementById('total-images');
            const thumbnailStrip = document.getElementById('thumbnail-strip');
            const lightbox = document.getElementById('lightbox');
            const lightboxImage = document.getElementById('lightbox-image');
            const lightboxClose = document.getElementById('lightbox-close');
            const zoomInBtn = document.getElementById('zoom-in');
            const zoomOutBtn = document.getElementById('zoom-out');
            const zoomResetBtn = document.getElementById('zoom-reset');

            function updateTransform() {
                lightboxImage.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
            }

            function updateButtons() {
                if (prevBtn) prevBtn.disabled = imageUrls.length <= 1;
                if (nextBtn) nextBtn.disabled = imageUrls.length <= 1;
            }

            function updateThumbnails() {
                document.querySelectorAll('.thumbnail').forEach((thumb, idx) => {
                    thumb.classList.toggle('active', idx === currentIndex);
                });
            }

            function updateImage(index) {
                if (imageUrls.length === 0) return;
                currentIndex = (index + imageUrls.length) % imageUrls.length;
                articleImageEl.src = imageUrls[currentIndex];
                if (currentImageSpan) currentImageSpan.textContent = currentIndex + 1;
                updateThumbnails();
                updateButtons();
            }

            function createThumbnails() {
                if (!thumbnailStrip) return;
                thumbnailStrip.innerHTML = '';
                if (totalImagesSpan) totalImagesSpan.textContent = imageUrls.length;
                imageUrls.forEach((url, idx) => {
                    const thumb = document.createElement('img');
                    thumb.src = url;
                    thumb.alt = `Image ${idx + 1}`;
                    thumb.className = 'thumbnail';
                    if (idx === 0) thumb.classList.add('active');
                    thumb.addEventListener('click', () => updateImage(idx));
                    thumbnailStrip.appendChild(thumb);
                });
                updateButtons();
            }

            // Lightbox func
            function setLightboxImage(index) {
                currentIndex = (index + imageUrls.length) % imageUrls.length;
                if (lightboxImage) {
                    lightboxImage.src = imageUrls[currentIndex];
                    scale = 1; translateX = 0; translateY = 0; updateTransform();
                }
            }

            function openLightbox(index) {
                setLightboxImage(index);
                if (!lightbox) return;
                lightbox.classList.add('open');
                lightbox.setAttribute('aria-hidden', 'false');
                scale = 1; translateX = 0; translateY = 0; updateTransform();
                if (lightboxClose) lightboxClose.focus();
            }

            function closeLightbox() {
                if (!lightbox) return;
                lightbox.classList.remove('open');
                lightbox.setAttribute('aria-hidden', 'true');
                if (lightboxImage) lightboxImage.src = '';
                scale = 1; translateX = 0; translateY = 0; updateTransform();
            }

            function prevLightbox() { setLightboxImage(currentIndex - 1); }
            function nextLightbox() { setLightboxImage(currentIndex + 1); }

            if (prevBtn) prevBtn.addEventListener('click', () => updateImage(currentIndex - 1));
            if (nextBtn) nextBtn.addEventListener('click', () => updateImage(currentIndex + 1));
            if (zoomBtn) zoomBtn.addEventListener('click', () => openLightbox(currentIndex));
            if (zoomInBtn) zoomInBtn.addEventListener('click', () => { scale = Math.min(5, scale * 1.2); updateTransform(); });
            if (zoomOutBtn) zoomOutBtn.addEventListener('click', () => { scale = Math.max(0.2, scale / 1.2); updateTransform(); });
            if (zoomResetBtn) zoomResetBtn.addEventListener('click', () => { scale = 1; translateX = 0; translateY = 0; updateTransform(); });
            if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
            if (lightbox) lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });

            document.addEventListener('keydown', (e) => {
                if (!lightbox || !lightbox.classList.contains('open')) return;
                if (e.key === 'Escape') { closeLightbox(); }
                if (e.key === 'ArrowLeft') { prevLightbox(); }
                if (e.key === 'ArrowRight') { nextLightbox(); }
            });

            if (lightboxImage) {
                lightboxImage.addEventListener('wheel', (e) => {
                    if (!lightbox.classList.contains('open')) return;
                    e.preventDefault();
                    const panSpeed = 1;
                    translateX -= e.deltaX * panSpeed;
                    translateY -= e.deltaY * panSpeed;
                    updateTransform();
                }, { passive: false });
            }


            let swipeStartX = 0, swipeStartY = 0, isSwiping = false, preventClick = false;
            const SWIPE_THRESHOLD = 40;

            function handleGallerySwipe(dx) {
                if (dx < -SWIPE_THRESHOLD) {
                    updateImage(currentIndex + 1);
                } else if (dx > SWIPE_THRESHOLD) {
                    updateImage(currentIndex - 1);
                }
                preventClick = true;
                setTimeout(() => { preventClick = false; }, 300);
            }

            articleImageEl.addEventListener('pointerdown', (e) => {
                swipeStartX = e.clientX; swipeStartY = e.clientY; isSwiping = false;
                articleImageEl.setPointerCapture(e.pointerId);
            });

            articleImageEl.addEventListener('pointermove', (e) => {
                const dx = e.clientX - swipeStartX; const dy = e.clientY - swipeStartY;
                if (Math.abs(dx) > 10 && Math.abs(dx) > Math.abs(dy)) isSwiping = true;
            });

            articleImageEl.addEventListener('pointerup', (e) => {
                try { articleImageEl.releasePointerCapture(e.pointerId); } catch (err) {}
                const dx = e.clientX - swipeStartX; const dy = e.clientY - swipeStartY;
                if (isSwiping && Math.abs(dx) > SWIPE_THRESHOLD && Math.abs(dx) > Math.abs(dy)) {
                    handleGallerySwipe(dx);
                }
            });

            articleImageEl.addEventListener('click', () => { if (!preventClick) openLightbox(currentIndex); });

            let lbSwipeStartX = 0, lbSwipeStartY = 0, lbIsSwiping = false, lbPreventClick = false;

            if (lightboxImage) {
                lightboxImage.addEventListener('pointerdown', (e) => {
                    lbSwipeStartX = e.clientX; lbSwipeStartY = e.clientY; lbIsSwiping = false;
                    if (scale > 1) {
                        e.preventDefault(); isPanning = true; pointerId = e.pointerId; startX = e.clientX; startY = e.clientY;
                        lightboxImage.setPointerCapture(pointerId); lightboxImage.style.cursor = 'grabbing';
                    } else {
                        lightboxImage.setPointerCapture(e.pointerId);
                    }
                });

                lightboxImage.addEventListener('pointermove', (e) => {
                    if (isPanning && e.pointerId === pointerId) {
                        const dx = e.clientX - startX; const dy = e.clientY - startY; startX = e.clientX; startY = e.clientY;
                        translateX += dx; translateY += dy; updateTransform(); return;
                    }
                    const dx = e.clientX - lbSwipeStartX; const dy = e.clientY - lbSwipeStartY;
                    if (Math.abs(dx) > 10 && Math.abs(dx) > Math.abs(dy)) lbIsSwiping = true;
                });

                lightboxImage.addEventListener('pointerup', (e) => {
                    if (isPanning && e.pointerId === pointerId) {
                        isPanning = false; try { lightboxImage.releasePointerCapture(pointerId); } catch (_) {}
                        pointerId = null; lightboxImage.style.cursor = 'grab'; return;
                    }
                    try { lightboxImage.releasePointerCapture(e.pointerId); } catch (_) {}
                    const dx = e.clientX - lbSwipeStartX; const dy = e.clientY - lbSwipeStartY;
                    if (lbIsSwiping && Math.abs(dx) > SWIPE_THRESHOLD && Math.abs(dx) > Math.abs(dy)) {
                        if (dx < -SWIPE_THRESHOLD) {
                            setLightboxImage(currentIndex + 1);
                        } else if (dx > SWIPE_THRESHOLD) {
                            setLightboxImage(currentIndex - 1);
                        }
                        lbPreventClick = true; setTimeout(() => { lbPreventClick = false; }, 300);
                    }
                });

                lightboxImage.addEventListener('click', (e) => {
                    if (lbPreventClick) return;
                    if (scale <= 1) {
                        const rect = lightboxImage.getBoundingClientRect();
                        const x = e.clientX - rect.left; const y = e.clientY - rect.top;
                        const px = (x / rect.width) * 100; const py = (y / rect.height) * 100;
                        lightboxImage.style.transformOrigin = `${px}% ${py}%`;
                        scale = 2.5; translateX = 0; translateY = 0; updateTransform();
                    } else {
                        scale = 1; translateX = 0; translateY = 0; lightboxImage.style.transformOrigin = 'center center'; updateTransform();
                    }
                });
            }

            createThumbnails();
            if (imageUrls.length > 0) updateImage(0);
        }

        initArticleGallery();
});
