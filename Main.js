document.addEventListener('DOMContentLoaded', function () {
    // Mobile menu toggle
    function showMenu(toggleId, navId) {
        const toggle = document.getElementById(toggleId);
        const nav = document.getElementById(navId);
        if (!toggle || !nav) return;

        toggle.addEventListener('click', function () {
            nav.classList.toggle('show-menu');
            toggle.classList.toggle('show-icon');
            // Announce menu state change for accessibility
            const isOpen = nav.classList.contains('show-menu');
            toggle.setAttribute('aria-expanded', isOpen);
        });
    }

    showMenu('nav-toggle', 'nav-menu');

    // Allow links to navigate normally; remove preventDefault so href works
    document.querySelectorAll('.card__read').forEach(function (link) {
        link.setAttribute('role', 'button');
    });

    // Search functionality (simple client-side filter)
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

    // Skip to main content link for accessibility
    const main = document.querySelector('main');
    if (main && !main.id) {
        main.id = 'main-content';
    }
});
