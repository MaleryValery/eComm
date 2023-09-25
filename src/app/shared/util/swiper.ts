import 'swiper/css/bundle';

async function loadSwiper() {
  try {
    const SwiperModule = await import('swiper/bundle');
    const Swiper = SwiperModule.default;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const mySwiper = new Swiper('.my-swiper-regular', {
      direction: 'horizontal',
      loop: true,
      spaceBetween: 50,

      navigation: {
        nextEl: '.swiper-button-next-regular',
        prevEl: '.swiper-button-prev-regular',
      },
    });
  } catch (error) {
    console.log('Error loading Swiper:', error);
  }
}

export default loadSwiper;
