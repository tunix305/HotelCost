export const PhotoService = {
  async getImages() {
    return [
      {
        itemImageSrc: "https://picsum.photos/640/480?random=1",
        thumbnailImageSrc: "https://picsum.photos/150/100?random=1",
        alt: "Image 1",
      },
      {
        itemImageSrc: "https://picsum.photos/640/480?random=2",
        thumbnailImageSrc: "https://picsum.photos/150/100?random=2",
        alt: "Image 2",
      },
      {
        itemImageSrc: "https://picsum.photos/640/480?random=3",
        thumbnailImageSrc: "https://picsum.photos/150/100?random=3",
        alt: "Image 3",
      },
    ];
  },
};
