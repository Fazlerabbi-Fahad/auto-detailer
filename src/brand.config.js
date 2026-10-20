// Single place to edit defaults, prices, and demo flags.
// All prices below are SAMPLE values for the concept site.

const brand = {
  defaults: {
    name: "Glossline Mobile Detailing",
    city: "your city",
    state: "",
    phone: "",
    ig: "",
    accent: "7FD3FF",
  },

  // Demo / honesty flags. Turn both off once a client buys.
  conceptBanner: true,
  showPhotoNotes: true,

  motion: {
    // "off"    = always full motion (default for demos)
    // "soften" = when the visitor prefers reduced motion: gentler fades, no parallax, no smooth scroll
    // "strict" = when the visitor prefers reduced motion: no motion at all
    respectReducedMotion: "off",
  },

  // Formspree-compatible endpoint, e.g. "https://formspree.io/f/abcdwxyz".
  // Leave empty and bookings are logged to the browser console.
  formEndpoint: "",

  // Optional nearby towns. Leave empty to show only the prospect's city.
  serviceAreas: [],

  vehicleSizes: [
    { id: "sedan", label: "Sedan" },
    { id: "suv", label: "SUV" },
    { id: "truck", label: "Truck / Van" },
  ],

  packages: [
    {
      id: "express",
      name: "Express Exterior",
      image: "pkgExterior",
      duration: "1 hr",
      prices: { sedan: 69, suv: 79, truck: 89 },
      includes: [
        "Foam cannon pre-soak",
        "Two-bucket hand wash",
        "Wheels, tires and wells",
        "Streak-free glass",
        "Tire shine",
        "Spray sealant, 4 weeks",
      ],
    },
    {
      id: "interior",
      name: "Interior Detail",
      image: "pkgInterior",
      duration: "2 hrs",
      prices: { sedan: 129, suv: 149, truck: 169 },
      includes: [
        "Full vacuum, seats to trunk",
        "Steam clean vents and cupholders",
        "Dash, doors and console wiped down",
        "Leather clean and condition",
        "Floor mats scrubbed",
        "Interior glass",
      ],
    },
    {
      id: "full",
      name: "Full Detail",
      image: "pkgFull",
      duration: "3.5 hrs",
      popular: true,
      prices: { sedan: 199, suv: 229, truck: 259 },
      includes: [
        "Everything in Express Exterior",
        "Everything in Interior Detail",
        "Clay bar decontamination",
        "Hand-applied wax, 3 months",
        "Door jambs and trim dressed",
        "Final walk-around with you",
      ],
    },
    {
      id: "ceramic",
      name: "Ceramic Coating",
      image: "pkgCeramic",
      duration: "1 day",
      prices: { sedan: 699, suv: 799, truck: 899 },
      includes: [
        "Full wash and decontamination",
        "One-step paint correction",
        "Pro-grade ceramic, 3 years",
        "Wheels and glass coated",
        "Water beads right off",
        "Care guide and follow-up",
      ],
    },
  ],

  addOns: [
    { id: "pet", name: "Pet hair removal", price: 35 },
    { id: "engine", name: "Engine bay clean", price: 45 },
    { id: "headlights", name: "Headlight restoration", price: 60 },
    { id: "odor", name: "Odor treatment", price: 50 },
    { id: "clay", name: "Clay bar", price: 40 },
    { id: "shampoo", name: "Seat shampoo", price: 55 },
  ],
};

export default brand;
