document.addEventListener('DOMContentLoaded', function () {
    // Mobile
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

    // Search
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

    // Skip to main
    const main = document.querySelector('main');
    if (main && !main.id) {
        main.id = 'main-content';
    }
});

