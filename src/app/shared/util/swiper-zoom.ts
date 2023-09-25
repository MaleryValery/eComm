import 'swiper/css/bundle';

async function loadZoomSwiper() {
  try {
    const SwiperModule = await import('swiper/bundle');
    const Swiper = SwiperModule.default;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const mySwiper = new Swiper('.my-swiper-zoom', {
      zoom: true,
      loop: true,
      spaceBetween: 50,
      navigation: {
        nextEl: '.swiper-button-next-zoom',
        prevEl: '.swiper-button-prev-zoom',
      },
    });
  } catch (error) {
    console.log('Error loading Swiper:', error);
  }
}

export default loadZoomSwiper;
