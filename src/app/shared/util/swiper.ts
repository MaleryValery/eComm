import 'swiper/css/bundle';

async function loadSwiper() {
  try {
    const SwiperModule = await import('swiper/bundle');
    const Swiper = SwiperModule.default;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const mySwiper = new Swiper('.mySwiper', {
      direction: 'horizontal',
      loop: true,
      spaceBetween: 30,

      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
    });
  } catch (error) {
    console.log('Error loading Swiper:', error);
  }
}

export default loadSwiper;
