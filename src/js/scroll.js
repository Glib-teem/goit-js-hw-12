const scrollBtn = document.getElementById('scrollToTop');

// Показує кнопку при прокрутці
window.addEventListener('scroll', () => {
  if (window.scrollY > 400) {
    scrollBtn.classList.remove('is-hidden');
  } else {
    scrollBtn.classList.add('is-hidden');
  }
});

// Плавна прокрутка нагору
scrollBtn.addEventListener('click', () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
});
