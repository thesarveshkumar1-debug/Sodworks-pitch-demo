/* ===========================================================================
   CAFÉ DEMO CONTENT  —  EDIT THIS FILE
   ===========================================================================

   Every word, price and detail on the café demo page lives here.

   THIS IS ALL SAMPLE CONTENT. "Burger & Filter" is an invented café used to
   show the concept. Nothing here describes a real business.

   TO FIT A REAL CAFÉ, REPLACE:
     - identity.name, identity.tagline, identity.blurb
     - menu[]              their actual items and prices
     - visit.address / visit.hours / visit.phone / visit.instagram
     - burger.layers[]     the real ingredients of their signature item

   Keep `isSample` true until every field above is real. It drives the notice
   bar at the top of the page.
   =========================================================================== */

export const isSample = true;

export const cafe = {
  identity: {
    name: "ABC Cafe",
    tagline: "Burgers, and the coffee that follows.",
    blurb:
      "A small kitchen doing two things properly: a short burger menu cooked to order, and filter coffee decocted the slow way. No buffet, no fusion, no thirty-item card.",
    /** Shown in the browser tab for the demo. */
    metaTitle: "ABC Cafe — a SodWorks café concept",
    metaDescription:
      "A SodWorks concept demo for a café. Sample content throughout.",
  },

  /** The signature item the whole page is built around. */
  burger: {
    eyebrow: "The signature",
    name: "The Filter House Chicken",
    standfirst:
      "One burger, built in six layers. Everything below is made when you order it.",

    /* -------------------------------------------------------------------
       WORKING PLAN — not final.

       These six layers come from reading the reference photographs. They are
       provisional: all six will be cut from a single generated exploded
       composition, and the grouping is confirmed or changed only after that
       composition has been reviewed.

       Deliberately six, not eight: the cheese is melted into the chicken's
       coating and the sauce is spread on the bun faces, so neither can be
       lifted away as its own slice without looking wrong.

       `asset` is the transparent PNG this layer is waiting for. The files
       belong in public/burger/layers/. Nothing reads them yet — the burger
       area is a static preview until all six are in place. The full
       specification is in docs/burger-assets.md.
       ------------------------------------------------------------------- */
    layers: [
      {
        asset: "top-bun.webp",
        name: "Top bun",
        note: "Brioche, glazed and toasted, sauce on the underside",
      },
      {
        asset: "onion.webp",
        name: "Red onion",
        note: "Sliced into rings, raw",
      },
      {
        asset: "tomato.webp",
        name: "Tomato",
        note: "Two thick slices, lightly salted",
      },
      {
        asset: "lettuce.webp",
        name: "Lettuce",
        note: "Green leaf, kept cold until it is built",
      },
      {
        asset: "patty-cheese.webp",
        name: "Chicken patty with cheese",
        note: "Thigh fillet, fried to order, cheddar melted over it",
      },
      {
        asset: "bottom-bun.webp",
        name: "Bottom bun",
        note: "Toasted, sauce spread to the edge",
      },
    ],

    /** Kept for reference; the scene now renders the layers directly. */
    preview: {
      src: "/burger/reference-assembled.jpg",
      width: 1024,
      height: 768,
      alt: "The Filter House Chicken burger, assembled",
      notice:
        "The scroll-apart sequence returns once the six layered images are ready.",
    },
  },

  /** The second food sequence, directly below the burger. */
  pizza: {
    eyebrow: "From the oven",
    name: "Tandoori Paneer",
    standfirst:
      "Three layers, and a twelve-inch base stretched by hand every morning.",

    /* `asset` is the layer image in public/pizza/layers/. Three, not four:
       the sauce layer was generated and dropped — see src/data/pizza-layout.ts
       for why. */
    layers: [
      {
        asset: "toppings.webp",
        name: "Paneer and vegetables",
        note: "Tandoori paneer, red onion, capsicum, sweet corn, coriander",
      },
      {
        asset: "mozzarella.webp",
        name: "Mozzarella",
        note: "Taken to the edge, blistered under the heat",
      },
      {
        asset: "crust.webp",
        name: "The base",
        note: "Stretched by hand, baked until the rim blisters",
      },
    ],
  },

  /** The third scroll sequence: a cappuccino poured on the shoreline. */
  coffee: {
    eyebrow: "The house pour",
    name: "Shoreline Cappuccino",
    price: "₹180",
    note: "Sample product and price. Replace in src/data/cafe.ts when the café details are final.",

    /* Three beats, tracked to the pour. Each one is readable on its own, and
       all three render together when motion is off or JavaScript never runs. */
    beats: [
      {
        label: "The brew begins",
        heading: "Ground the moment you order",
        body: "Beans from the Shevaroy hills, ground fresh and tamped by hand. The glass goes under warm, never cold.",
        items: [
          "Double shot espresso",
          "Steamed whole milk",
          "A finger of milk foam",
        ],
      },
      {
        label: "The pour",
        heading: "Twenty-five seconds, no longer",
        body: "The shot runs dark, then slows to a honey crawl and stops. Pulled straight into the glass so you can watch it build.",
        items: [
          "Grind, fine",
          "Tamp, level",
          "Extract, 25 seconds",
          "Steam the milk to 60°",
        ],
      },
      {
        label: "The finished cup",
        heading: "Carry it to the rail",
        body: "Dense crema, warm milk, a clean finish. Best drunk standing up, while the water is still bright.",
        items: [
          "Served all day",
          "Decaf on request",
        ],
      },
    ],
  },

  menu: [
    {
      section: "Burgers",
      note: "Served with masala fries.",
      items: [
        { name: "The Filter House Chicken", price: "₹260", note: "The signature" },
        { name: "Paneer & Pepper", price: "₹240", note: "Vegetarian" },
        { name: "Mushroom & Cheese", price: "₹250", note: "Vegetarian" },
        { name: "Double Chicken", price: "₹380", note: "Two patties" },
      ],
    },
    {
      section: "Pizza",
      note: "Twelve inches, hand stretched.",
      items: [
        { name: "Tandoori Paneer", price: "₹380", note: "The signature" },
        { name: "Corn & Capsicum", price: "₹320", note: "" },
        { name: "Margherita", price: "₹280", note: "" },
      ],
    },
    {
      section: "Coffee",
      note: "Decoction made fresh twice a day.",
      items: [
        { name: "Filter coffee", price: "₹60", note: "" },
        { name: "Filter coffee, strong", price: "₹70", note: "" },
        { name: "Black coffee", price: "₹80", note: "" },
        { name: "Iced filter", price: "₹110", note: "" },
      ],
    },
    {
      section: "Alongside",
      note: "",
      items: [
        { name: "Masala fries", price: "₹120", note: "" },
        { name: "Rose milk", price: "₹90", note: "" },
        { name: "Sukku malli", price: "₹60", note: "Dry ginger and coriander" },
      ],
    },
  ],

  visit: {
    eyebrow: "Visit",
    heading: "Where to find it",
    address: ["00 Sample Street", "Area name", "Chennai 600000"],
    hours: [
      { days: "Monday to Thursday", time: "11:00 — 22:00" },
      { days: "Friday to Sunday", time: "11:00 — 23:00" },
    ],
    phone: "+91 00000 00000",
    instagram: "@sample.handle",
    closing: "Kitchen stops thirty minutes before closing.",
  },
} as const;
