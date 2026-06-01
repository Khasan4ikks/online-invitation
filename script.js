/* =====================================================
   Главный config сайта.
   Здесь проще всего менять имена, дату, адреса и ссылки.
   ===================================================== */
const config = {
  // Где менять имена пары.
  coupleNameHero: 'Азат + Залида',
  coupleNameFooter: 'Азат и Залида',

  // Где менять дату свадьбы. Формат ISO: YYYY-MM-DDTHH:mm:ss+TZ.
  weddingDate: '2026-08-23T16:00:00+03:00',
  weddingDateLabel: '23 августа 2026',

  // Где менять название площадки, адрес и описание.
  venueName: 'Царская усадьба',
  venueAddress: 'ул. Галактионова, 15, Арск',
  venueDescription: 'Элегантная площадка с торжественной атмосферой для нашего свадебного вечера.',

  // Где менять ссылку на Яндекс.Карты.
  yandexMapsUrl: 'https://yandex.ru/maps/?ll=49.874842%2C56.091110&z=17&pt=49.874842%2C56.091110%2Cpm2rdm&text=%D1%83%D0%BB%D0%B8%D1%86%D0%B0%20%D0%93%D0%B0%D0%BB%D0%B0%D0%BA%D1%82%D0%B8%D0%BE%D0%BD%D0%BE%D0%B2%D0%B0%2C%2015%2C%20%D0%90%D1%80%D1%81%D0%BA',
  yandexMapsEmbedUrl: 'https://yandex.ru/map-widget/v1/?ll=49.874842%2C56.091110&z=17&pt=49.874842%2C56.091110%2Cpm2rdm',

  // Где менять ссылку на Telegram-чат гостей.
  telegramChatUrl: 'https://t.me/your_wedding_chat',

  // Где менять Google Apps Script Web App URL для отправки анкеты.
  googleAppsScriptUrl: 'https://script.google.com/macros/s/AKfycbz-erPAruPh9M_xbKONuV-FXjrMozMJfn_wJVBmk63CMD7WLOl5hWy4hh4IOt3Bxawdww/exec',

  // Источник заявки, который будет записан в Google Sheets.
  source: 'wedding-invitation-site'
};

/* Фотографии карусели "Наша история".
   Где менять фотографии в будущем: добавьте новые файлы в images/carousel и добавьте их пути в этот массив.
   Сейчас подключены все изображения, найденные в папке images/carousel. */
const ourStoryImages = [
  'images/carousel/galery1-1.jpg',
  'images/carousel/galery1-2.jpg',
  'images/carousel/galery1-3.jpg'
];

/* Заполняет повторяющийся контент из config, чтобы не менять одно и то же в нескольких местах. */
function applyConfig() {
  document.querySelectorAll('[data-couple-name]').forEach((node) => {
    node.textContent = node.closest('footer') ? config.coupleNameFooter : config.coupleNameHero;
  });
  document.querySelectorAll('[data-wedding-date-label]').forEach((node) => { node.textContent = config.weddingDateLabel; });
  document.querySelectorAll('[data-venue-name]').forEach((node) => { node.textContent = config.venueName; });
  document.querySelectorAll('[data-venue-address]').forEach((node) => { node.textContent = config.venueAddress; });
  document.querySelectorAll('[data-venue-description]').forEach((node) => { node.textContent = config.venueDescription; });
  document.querySelectorAll('[data-yandex-map-link]').forEach((link) => { link.href = config.yandexMapsUrl; });
  document.querySelectorAll('[data-yandex-map-frame]').forEach((frame) => { frame.src = config.yandexMapsEmbedUrl; });
  document.querySelectorAll('[data-telegram-link]').forEach((link) => { link.href = config.telegramChatUrl; });
}

/* Карусель "Наша история": создает слайды из ourStoryImages, включает стрелки, точки, swipe и autoplay. */
function initOurStoryCarousel() {
  const carousel = document.querySelector('[data-story-carousel]');
  if (!carousel) return;

  const track = carousel.querySelector('[data-story-carousel-track]');
  const dots = carousel.querySelector('[data-story-carousel-dots]');
  const prevButton = carousel.querySelector('.story-carousel__button--prev');
  const nextButton = carousel.querySelector('.story-carousel__button--next');
  const hasMultipleSlides = ourStoryImages.length > 1;
  let currentIndex = 0;
  let autoplayTimer = null;
  let touchStartX = 0;

  track.innerHTML = ourStoryImages
    .map((src, index) => `<img class="story-carousel__slide" src="${src}" alt="Наша история, фото ${index + 1}" loading="${index === 0 ? 'eager' : 'lazy'}" />`)
    .join('');

  dots.innerHTML = ourStoryImages
    .map((_, index) => `<button class="story-carousel__dot" type="button" aria-label="Показать фото ${index + 1}"></button>`)
    .join('');

  const slides = Array.from(track.querySelectorAll('.story-carousel__slide'));
  const dotButtons = Array.from(dots.querySelectorAll('.story-carousel__dot'));

  if (ourStoryImages.length === 0) {
    carousel.hidden = true;
    return;
  }

  function stopAutoplay() {
    if (autoplayTimer) clearInterval(autoplayTimer);
    autoplayTimer = null;
  }

  function startAutoplay() {
    if (!hasMultipleSlides || autoplayTimer) return;
    autoplayTimer = setInterval(() => showSlide(currentIndex + 1), 4500);
  }

  function showSlide(nextIndex) {
    track.classList.add('is-moving');
    currentIndex = (nextIndex + slides.length) % slides.length;
    track.style.transform = `translateX(-${currentIndex * 100}%)`;
    dotButtons.forEach((dot, index) => {
      dot.classList.toggle('is-active', index === currentIndex);
      dot.setAttribute('aria-current', index === currentIndex ? 'true' : 'false');
    });
    window.setTimeout(() => track.classList.remove('is-moving'), 900);
  }

  if (!hasMultipleSlides) {
    prevButton.hidden = true;
    nextButton.hidden = true;
    dots.hidden = true;
    showSlide(0);
    return;
  }

  prevButton.addEventListener('click', () => {
    stopAutoplay();
    showSlide(currentIndex - 1);
    startAutoplay();
  });
  nextButton.addEventListener('click', () => {
    stopAutoplay();
    showSlide(currentIndex + 1);
    startAutoplay();
  });
  dotButtons.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      stopAutoplay();
      showSlide(index);
      startAutoplay();
    });
  });

  carousel.addEventListener('mouseenter', stopAutoplay);
  carousel.addEventListener('mouseleave', startAutoplay);
  carousel.addEventListener('touchstart', (event) => {
    stopAutoplay();
    touchStartX = event.touches[0].clientX;
  }, { passive: true });
  carousel.addEventListener('touchend', (event) => {
    const delta = event.changedTouches[0].clientX - touchStartX;
    if (Math.abs(delta) > 45) showSlide(delta < 0 ? currentIndex + 1 : currentIndex - 1);
    startAutoplay();
  });

  showSlide(0);
  startAutoplay();
}

/* Countdown: считает дни/часы/минуты/секунды до config.weddingDate и обновляет блок каждую секунду. */
function initCountdown() {
  const countdown = document.querySelector('[data-countdown]');
  if (!countdown) return;

  const weddingTime = new Date(config.weddingDate).getTime();
  const daysNode = countdown.querySelector('[data-days]');
  const hoursNode = countdown.querySelector('[data-hours]');
  const minutesNode = countdown.querySelector('[data-minutes]');
  const secondsNode = countdown.querySelector('[data-seconds]');
  const messageNode = document.querySelector('[data-countdown-message]');

  function renderCountdown() {
    const diff = weddingTime - Date.now();

    if (diff <= 0) {
      countdown.style.display = 'none';
      messageNode.textContent = 'Этот прекрасный день уже наступил. Спасибо, что были рядом с нами!';
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    daysNode.textContent = String(days).padStart(2, '0');
    hoursNode.textContent = String(hours).padStart(2, '0');
    minutesNode.textContent = String(minutes).padStart(2, '0');
    secondsNode.textContent = String(seconds).padStart(2, '0');
  }

  renderCountdown();
  setInterval(renderCountdown, 1000);
}

/* Календарь: строит месяц свадьбы и выделяет день свадьбы сердцем. */
function initCalendar() {
  const calendar = document.querySelector('[data-calendar]');
  const monthTitle = document.querySelector('[data-calendar-month]');
  if (!calendar || !monthTitle) return;

  const date = new Date(config.weddingDate);
  const year = date.getFullYear();
  const month = date.getMonth();
  const weddingDay = date.getDate();
  const monthName = date.toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' });
  const weekDays = ['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'вс'];
  const firstDay = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const offset = (firstDay.getDay() + 6) % 7;

  monthTitle.textContent = monthName.charAt(0).toUpperCase() + monthName.slice(1);
  calendar.innerHTML = '';

  weekDays.forEach((day) => calendar.insertAdjacentHTML('beforeend', `<span class="calendar__cell calendar__cell--head">${day}</span>`));
  for (let i = 0; i < offset; i += 1) calendar.insertAdjacentHTML('beforeend', '<span class="calendar__cell calendar__cell--empty"></span>');
  for (let day = 1; day <= daysInMonth; day += 1) {
    const className = day === weddingDay ? 'calendar__cell calendar__cell--wedding' : 'calendar__cell';
    calendar.insertAdjacentHTML('beforeend', `<span class="${className}">${day}</span>`);
  }
}

/* Анимация появления блоков: IntersectionObserver добавляет .is-visible, когда блок входит в экран. */
function initRevealAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.16 });

  document.querySelectorAll('.reveal').forEach((node) => observer.observe(node));
}

/* Тайминг: отдельный observer для поочередного появления карточек слева/справа при скролле. */
function initTimelineAnimations() {
  const items = document.querySelectorAll('[data-timeline-item]');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const item = entry.target;
        item.style.transitionDelay = `${Array.from(items).indexOf(item) * 140}ms`;
        item.classList.add('is-visible');
        observer.unobserve(item);
      }
    });
  }, { threshold: 0.28 });

  items.forEach((item) => observer.observe(item));
}

/* Форма RSVP: показывает поле пары, валидирует данные и запускает отправку анкеты. */
function initRsvpForm() {
  const form = document.querySelector('[data-rsvp-form]');
  if (!form) return;

  const attendanceOptions = form.querySelectorAll('input[name="attendance_status"]');
  const partnerField = form.querySelector('[data-partner-field]');
  const partnerInput = form.elements.partner_name;
  const submitButton = form.querySelector('[data-submit-button]');
  const message = form.querySelector('[data-form-message]');
  const fieldErrors = form.querySelectorAll('[data-error-for]');

  function getAttendanceStatus() {
    const checkedOption = form.querySelector('input[name="attendance_status"]:checked');
    return checkedOption ? checkedOption.value : '';
  }

  function setFieldError(fieldName, errorText) {
    const errorNode = form.querySelector(`[data-error-for="${fieldName}"]`);
    if (errorNode) errorNode.textContent = errorText;
  }

  function clearFormMessages() {
    fieldErrors.forEach((errorNode) => { errorNode.textContent = ''; });
    message.classList.remove('is-error');
    message.textContent = '';
  }

  function syncPartnerField() {
    const needsPartner = getAttendanceStatus() === 'Буду с парой/семьей';
    partnerField.classList.toggle('is-visible', needsPartner);
    partnerInput.required = needsPartner;
    if (!needsPartner) {
      partnerInput.value = '';
      setFieldError('partner_name', '');
    }
  }

  attendanceOptions.forEach((option) => option.addEventListener('change', syncPartnerField));
  syncPartnerField();

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    clearFormMessages();

    const payload = {
      submitted_at: new Date().toISOString(),
      guest_name: form.elements.guest_name.value.trim(),
      attendance_status: getAttendanceStatus(),
      partner_name: partnerInput.value.trim(),
      source: config.source
    };

    if (!payload.guest_name) {
      setFieldError('guest_name', 'Пожалуйста, укажите имя и фамилию.');
      form.elements.guest_name.focus();
      return;
    }
    if (!payload.attendance_status) {
      setFieldError('attendance_status', 'Пожалуйста, выберите статус присутствия.');
      return;
    }
    if (payload.attendance_status === 'Буду с парой/семьей' && !payload.partner_name) {
      setFieldError('partner_name', 'Пожалуйста, укажите имя и фамилию вашей пары.');
      partnerInput.focus();
      return;
    }

    await sendRsvp(payload, submitButton, message, form);
  });
}

/* Отправка анкеты: POST JSON в Google Apps Script Web App URL из config.googleAppsScriptUrl. */
async function sendRsvp(payload, submitButton, message, form) {
  if (config.googleAppsScriptUrl.includes('YOUR_DEPLOYMENT_ID')) {
    message.classList.add('is-error');
    message.textContent = 'Нужно указать Google Apps Script Web App URL в script.js.';
    return;
  }

  submitButton.disabled = true;
  submitButton.textContent = 'Отправляем…';

  try {
    const response = await fetch(config.googleAppsScriptUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload)
    });
    const result = await response.json();

    if (!response.ok || !result.ok) throw new Error(result.error || 'Не удалось сохранить ответ');

    form.reset();
    form.querySelector('[data-partner-field]').classList.remove('is-visible');
    form.elements.partner_name.required = false;
    message.textContent = 'Спасибо! Ваш ответ сохранён.';
  } catch (error) {
    message.classList.add('is-error');
    message.textContent = 'Не получилось отправить анкету. Попробуйте позже или напишите нам.';
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = 'Отправить';
  }
}

/* Запуск всех функций после загрузки HTML. */
document.addEventListener('DOMContentLoaded', () => {
  applyConfig();
  initCalendar();
  initCountdown();
  initOurStoryCarousel();
  initRevealAnimations();
  initTimelineAnimations();
  initRsvpForm();
});
