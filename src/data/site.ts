/* ===========================================================================
   SODWORKS SITE CONTENT  —  EDIT THIS FILE
   ===========================================================================

   Everything the SodWorks showcase says about itself lives here. You do not
   need to touch any component to change the copy.

   REPLACE BEFORE SHOWING THIS TO A CLIENT:
     - contact.email      currently a sample address
     - contact.phone      currently a sample number
     - contact.instagram  currently a sample handle
     - studio.location    confirm this is how you want to describe the studio

   Once the contact details above are real, set `showSampleMarkers` to false.
   That switches off every "sample" badge across the site in one move.
   =========================================================================== */

export const showSampleMarkers = true;

export const site = {
  name: "SodWorks",
  wordmark: "SodWorks",

  /** Shown in the browser tab and in link previews. */
  meta: {
    title: "SodWorks — website concepts for real businesses",
    description:
      "A working catalogue of website concepts. Each one is a short visual story about a single business, built to be scrolled.",
  },

  studio: {
    location: "Chennai, Tamil Nadu",
    discipline: "Website design and build",
  },

  hero: {
    eyebrow: "Concept catalogue",
    headline: "Websites that tell the product's story.",
    standfirst:
      "Most small-business websites are a menu and a phone number. These are built the other way round: one product, taken apart on screen, so a visitor understands it before they have read a word.",
    primaryCta: { label: "See the catalogue", href: "#catalogue" },
    secondaryCta: { label: "How it works", href: "#approach" },
  },

  approach: {
    eyebrow: "How it works",
    heading: "One product. One story. One page.",
    steps: [
      {
        title: "Pick the one thing",
        body: "A café has a signature burger. A perfume house has one bottle. We build the page around that single object instead of a tour of everything.",
      },
      {
        title: "Take it apart",
        body: "Scrolling pulls the object into its parts and names them. The visitor learns what is in it by moving down the page, not by reading a list.",
      },
      {
        title: "Put the business behind it",
        body: "Menu, hours, address, booking. The story earns attention; the practical details are what turn it into a visit or an order.",
      },
    ],
  },

  contact: {
    eyebrow: "Enquiries",
    heading: "Want one of these for your business?",
    body: "Tell me the business and the one product worth building a page around. I will say whether it suits this treatment.",
    // ---- SAMPLE DETAILS — REPLACE ----
    email: "hello@sodworks.example",
    phone: "+91 00000 00000",
    instagram: "@sodworks.sample",
    // ----------------------------------
  },

  footer: {
    note: "A studio catalogue, not a template shop. Every concept is built for one business.",
  },
} as const;
