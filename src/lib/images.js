// Single source of truth for every photo on the site.
// All photos are royalty-free from Unsplash (unsplash.com/license). Swap files in /public/images
// with the client's own work and keep the same keys.

const images = {
  hero: {
    src: "/images/hero.jpg",
    alt: "Water beading on the dark paint of a freshly detailed car door",
    w: 2000,
    h: 1333,
  },
  pkgExterior: {
    src: "/images/pkg-exterior.jpg",
    alt: "Grey car covered in thick white foam during an exterior wash",
    w: 1200,
    h: 800,
  },
  pkgInterior: {
    src: "/images/pkg-interior.jpg",
    alt: "Clean black and grey leather car interior after detailing",
    w: 1200,
    h: 800,
  },
  pkgFull: {
    src: "/images/pkg-full.jpg",
    alt: "Detailer hand-waxing the hood of a car",
    w: 1200,
    h: 800,
  },
  pkgCeramic: {
    src: "/images/pkg-ceramic.jpg",
    alt: "Tight water beads sitting on a coated metallic grey hood",
    w: 1200,
    h: 800,
  },
  baInteriorBefore: {
    src: "/images/ba-interior-before.jpg",
    alt: "Before: mud-stained fabric front seats",
    w: 1600,
    h: 1067,
  },
  baInteriorAfter: {
    src: "/images/ba-interior-after.jpg",
    alt: "After: spotless leather seats and center console",
    w: 1600,
    h: 1067,
  },
  baPaintBefore: {
    src: "/images/ba-paint-before.jpg",
    alt: "Before: SUV paint caked in dried mud and road film",
    w: 1600,
    h: 1067,
  },
  baPaintAfter: {
    src: "/images/ba-paint-after.jpg",
    alt: "After: deep glossy black paint with water beading on the hood",
    w: 1600,
    h: 2000,
  },
  galPolisher: {
    src: "/images/gal-polisher.jpg",
    alt: "Orbital polisher correcting the clear coat on a blue hood",
    w: 1200,
    h: 800,
  },
  galWheel: {
    src: "/images/gal-wheel.jpg",
    alt: "Gloved hand scrubbing a tire and wheel with a detailing brush",
    w: 1200,
    h: 800,
  },
  galInterior: {
    src: "/images/gal-interior.jpg",
    alt: "Detailer brushing dust out of a dashboard",
    w: 1200,
    h: 800,
  },
  galFinished: {
    src: "/images/gal-finished.jpg",
    alt: "Finished black sedan with a mirror-like shine",
    w: 1200,
    h: 800,
  },
  galFoam: {
    src: "/images/gal-foam.jpg",
    alt: "Foam sliding down the hood and grille of a black Mercedes",
    w: 2000,
    h: 3000,
  },
  galHandwash: {
    src: "/images/gal-handwash.jpg",
    alt: "Microfiber wash mitt gliding over a soapy dark BMW hood",
    w: 2000,
    h: 3000,
  },
  detailer: {
    src: "/images/detailer.jpg",
    alt: "Detailer hand-washing a car with a sponge in a driveway",
    w: 1400,
    h: 933,
  },
};

export default images;
