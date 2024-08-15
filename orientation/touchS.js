// document.getElementById('menu-toggle').addEventListener('click', function() {
//     document.querySelector('.nav-links').classList.toggle('show');
// });
  

//    EmailJS'i başlatma
//     emailjs.init("I5xh24QAMgmpppdnp"); // Kullanıcı ID'nizi buraya girin

//      Form gönderme işlemi
//     document.getElementById('contact-form').addEventListener('submit', function(event) {
//         event.preventDefault();

//          Formu EmailJS'e gönderme
//         emailjs.sendForm('service_6qpinms', 'template_xsa2xxh', this)
//             .then(function(response) {
//                 alert('Mesajınız başarıyla gönderildi!');
//                 document.getElementById('contact-form').reset(); // Formu sıfırlama
//             }, function(error) {
//                 alert('Mesajınız gönderilirken bir hata oluştu: ' + JSON.stringify(error));
//             });
//     })


document.getElementById('menu-toggle').addEventListener('click', function() {
    document.querySelector('.nav-links').classList.toggle('show');
});

// EmailJS'i başlatma
emailjs.init("I5xh24QAMgmpppdnp"); // Kullanıcı ID'nizi buraya girin

// Form gönderme işlemi
document.getElementById('contact-form').addEventListener('submit', function(event) {
    event.preventDefault();

    // Formu EmailJS'e gönderme
    emailjs.sendForm('service_6qpinms', 'template_xsa2xxh', this)
        .then(function(response) {
            // Başarı mesajını göster
            const successMessage = document.getElementById('success-message');
            successMessage.style.display = 'block';

            // 3 saniye sonra ana sayfaya yönlendir
            setTimeout(function() {
                window.location.href = "../index.html"; // Ana sayfaya yönlendirme
            }, 3000);
        }, function(error) {
            alert('Mesajınız gönderilirken bir hata oluştu: ' + JSON.stringify(error));
        });
});
