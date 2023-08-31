import 'swiper/css/bundle';

async function loadSwiper() {
  try {
    const SwiperModule = await import('swiper/bundle');
    const Swiper = SwiperModule.default;

    const mySwiper = new Swiper('.mySwiper', {
      // zoom: true,
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      zoom: {
        maxRatio: 1.3,
        minRatio: 1,
      },
    });
    console.log(mySwiper);
  } catch (error) {
    console.error('Error loading Swiper:', error);
  }
}

export default loadSwiper;
