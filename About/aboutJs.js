document.getElementById('menu-toggle').addEventListener('click', function() {
    document.querySelector('.nav-links').classList.toggle('show');
});

function goToPage() {
    window.location.href = "../index.html";
}