import 'swiper/css/bundle';

async function loadSwiper() {
  try {
    const SwiperModule = await import('swiper/bundle');
    const Swiper = SwiperModule.default;

    const mySwiper = new Swiper('.mySwiper', {
      direction: 'horizontal',
      loop: true,
      spaceBetween: 50,

      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
    });
    console.log(mySwiper);
  } catch (error) {
    console.error('Error loading Swiper:', error);
  }
}

export default loadSwiper;
