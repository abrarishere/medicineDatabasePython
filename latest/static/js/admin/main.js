const sidebar = document.getElementById('sidebar');
const sidebarToggle = document.getElementById('sidebarToggle');
const backdrop = document.getElementById('backdrop');

sidebarToggle.addEventListener('click', () => {
    sidebar.classList.toggle('-translate-x-full');
    backdrop.classList.toggle('hidden');
});

backdrop.addEventListener('click', () => {
    sidebar.classList.add('-translate-x-full');
    backdrop.classList.add('hidden');
});

window.addEventListener('resize', () => {
    if (window.innerWidth > 1024) {
        sidebar.classList.remove('-translate-x-full');
        backdrop.classList.add('hidden');
    }
});
