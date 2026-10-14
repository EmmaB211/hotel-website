import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// DEMO DATA — replace with real hotel content via the admin dashboard.
const demoImages = {
  roomStandard: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=1600&auto=format&fit=crop",
  roomDeluxe: "https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=1600&auto=format&fit=crop",
  roomExecutive: "https://images.unsplash.com/photo-1568495248636-6432b97bd949?q=80&w=1600&auto=format&fit=crop",
  roomFamily: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=1600&auto=format&fit=crop",
  roomSuite: "https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=1600&auto=format&fit=crop",
  pool: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1600&auto=format&fit=crop",
  gym: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1600&auto=format&fit=crop",
  spa: "https://images.unsplash.com/photo-1600334129128-685c5582fd35?q=80&w=1600&auto=format&fit=crop",
  restaurant: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=1600&auto=format&fit=crop",
  bar: "https://images.unsplash.com/photo-1470337458703-46ad1756a187?q=80&w=1600&auto=format&fit=crop",
  conference: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?q=80&w=1600&auto=format&fit=crop",
  garden: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=1600&auto=format&fit=crop",
  parking: "https://images.unsplash.com/photo-1506521781263-d8422e82f27a?q=80&w=1600&auto=format&fit=crop",
  laundry: "https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?q=80&w=1600&auto=format&fit=crop",
  lobby: "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?q=80&w=1600&auto=format&fit=crop",
  exterior: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1600&auto=format&fit=crop",
  market: "https://images.unsplash.com/photo-1533900298318-6b8da08a523e?q=80&w=1600&auto=format&fit=crop",
  nature: "https://images.unsplash.com/photo-1516426122078-c23e76319801?q=80&w=1600&auto=format&fit=crop",
  culture: "https://images.unsplash.com/photo-1523805009345-7448845a9e53?q=80&w=1600&auto=format&fit=crop",
  portrait1: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400&auto=format&fit=crop",
  portrait2: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=400&auto=format&fit=crop",
  portrait3: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&auto=format&fit=crop",
  portrait4: "https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?q=80&w=400&auto=format&fit=crop",
};

async function main() {
  console.log("Seeding database with demo data...");

  // --- Admin user ---
  const passwordHash = await bcrypt.hash("ChangeMe123!", 12);
  await prisma.user.upsert({
    where: { email: "admin@liragrandhotel.com" },
    update: {},
    create: {
      name: "Hotel Administrator",
      email: "admin@liragrandhotel.com",
      passwordHash,
      role: "SUPER_ADMIN",
    },
  });

  // --- Rooms ---
  const roomsData = [
    {
      slug: "standard-room",
      name: "Standard Room",
      category: "Standard",
      description:
        "A cozy and comfortable room ideal for solo travelers or couples, featuring modern amenities and warm decor inspired by Northern Uganda.",
      shortSummary: "Comfortable and affordable, perfect for short stays.",
      pricePerNight: 150000,
      maxAdults: 2,
      maxChildren: 1,
      bedType: "Queen Bed",
      sizeSqm: 22,
      totalUnits: 10,
      isFeatured: false,
      images: [demoImages.roomStandard],
      amenities: ["Wi-Fi", "Air Conditioning", "TV", "Private Bathroom", "Hot Shower"],
    },
    {
      slug: "deluxe-room",
      name: "Deluxe Room",
      category: "Deluxe",
      description:
        "Spacious and elegantly furnished, the Deluxe Room offers extra comfort with a work desk and premium bedding for business and leisure travelers.",
      shortSummary: "Extra space and comfort for business or leisure.",
      pricePerNight: 220000,
      maxAdults: 2,
      maxChildren: 2,
      bedType: "King Bed",
      sizeSqm: 28,
      totalUnits: 8,
      isFeatured: true,
      images: [demoImages.roomDeluxe],
      amenities: ["Wi-Fi", "Air Conditioning", "TV", "Private Bathroom", "Hot Shower", "Work Desk", "Wardrobe"],
    },
    {
      slug: "executive-room",
      name: "Executive Room",
      category: "Executive",
      description:
        "Designed for the discerning business traveler, the Executive Room includes a lounge area, premium amenities, and complimentary breakfast.",
      shortSummary: "Premium comfort with a dedicated lounge area.",
      pricePerNight: 320000,
      maxAdults: 2,
      maxChildren: 2,
      bedType: "King Bed",
      sizeSqm: 34,
      totalUnits: 6,
      isFeatured: true,
      images: [demoImages.roomExecutive],
      amenities: [
        "Wi-Fi",
        "Air Conditioning",
        "TV",
        "Private Bathroom",
        "Hot Shower",
        "Work Desk",
        "Wardrobe",
        "Breakfast",
        "Room Service",
      ],
    },
    {
      slug: "family-room",
      name: "Family Room",
      category: "Family",
      description:
        "A generously sized room with additional sleeping arrangements, perfect for families visiting Lira City together.",
      shortSummary: "Spacious accommodation for the whole family.",
      pricePerNight: 280000,
      maxAdults: 4,
      maxChildren: 2,
      bedType: "2 Queen Beds",
      sizeSqm: 38,
      totalUnits: 6,
      isFeatured: false,
      images: [demoImages.roomFamily],
      amenities: ["Wi-Fi", "Air Conditioning", "TV", "Private Bathroom", "Hot Shower", "Wardrobe", "Breakfast"],
    },
    {
      slug: "suite",
      name: "Suite",
      category: "Suite",
      description:
        "Our most luxurious accommodation featuring a separate living area, premium furnishings, and panoramic views over Lira City.",
      shortSummary: "The ultimate in comfort, space, and luxury.",
      pricePerNight: 450000,
      maxAdults: 3,
      maxChildren: 2,
      bedType: "King Bed + Sofa Bed",
      sizeSqm: 55,
      totalUnits: 4,
      isFeatured: true,
      images: [demoImages.roomSuite],
      amenities: [
        "Wi-Fi",
        "Air Conditioning",
        "TV",
        "Private Bathroom",
        "Hot Shower",
        "Work Desk",
        "Wardrobe",
        "Breakfast",
        "Room Service",
      ],
    },
  ];

  for (const room of roomsData) {
    const { images, amenities, ...roomFields } = room;
    const created = await prisma.room.upsert({
      where: { slug: room.slug },
      update: {},
      create: {
        ...roomFields,
        images: { create: images.map((url, i) => ({ url, position: i, alt: room.name })) },
        amenities: { create: amenities.map((name) => ({ name })) },
      },
    });
    console.log(`Room ready: ${created.name}`);
  }

  // --- Facilities ---
  const facilitiesData = [
    { slug: "swimming-pool", name: "Swimming Pool", description: "An outdoor pool with sun loungers for relaxation.", icon: "pool", openingHours: "7:00 AM – 7:00 PM", image: demoImages.pool },
    { slug: "gym", name: "Gym", description: "Fully equipped fitness center for guests of all levels.", icon: "gym", openingHours: "6:00 AM – 9:00 PM", image: demoImages.gym },
    { slug: "spa", name: "Spa", description: "Relaxing spa treatments and massage services.", icon: "spa", openingHours: "9:00 AM – 8:00 PM", image: demoImages.spa },
    { slug: "restaurant", name: "Restaurant", description: "Serving local and international cuisine all day.", icon: "restaurant", openingHours: "6:00 AM – 10:30 PM", image: demoImages.restaurant },
    { slug: "bar", name: "Bar", description: "Relax with a curated selection of drinks and cocktails.", icon: "bar", openingHours: "11:00 AM – 12:00 AM", image: demoImages.bar },
    { slug: "conference-hall", name: "Conference Hall", description: "Spacious halls for meetings, seminars, and events.", icon: "conference", openingHours: "By appointment", image: demoImages.conference },
    { slug: "garden", name: "Garden", description: "Beautifully landscaped gardens for outdoor relaxation.", icon: "garden", openingHours: "Open 24 hours", image: demoImages.garden },
    { slug: "parking", name: "Parking", description: "Secure on-site parking for all guests.", icon: "parking", openingHours: "Open 24 hours", image: demoImages.parking },
  ];

  for (const facility of facilitiesData) {
    const { image, ...fields } = facility;
    await prisma.facility.upsert({
      where: { slug: facility.slug },
      update: {},
      create: {
        ...fields,
        images: { create: [{ url: image, alt: facility.name }] },
      },
    });
  }
  console.log(`Seeded ${facilitiesData.length} facilities`);

  // --- Menu items ---
  const menuItemsData = [
    { name: "Rolex Wrap", description: "Classic Ugandan street food — eggs rolled in chapati with vegetables.", category: "BREAKFAST", price: 12000, image: demoImages.restaurant },
    { name: "Continental Breakfast", description: "Toast, eggs, sausages, fruit, and coffee or tea.", category: "BREAKFAST", price: 25000, image: demoImages.restaurant },
    { name: "Chicken Samosas", description: "Crispy pastries filled with spiced minced chicken.", category: "STARTERS", price: 15000, image: demoImages.restaurant },
    { name: "Vegetable Spring Rolls", description: "Fresh vegetables wrapped and lightly fried.", category: "STARTERS", price: 14000, image: demoImages.restaurant },
    { name: "Grilled Tilapia", description: "Fresh tilapia grilled with local spices, served with rice.", category: "MAIN_COURSE", price: 38000, image: demoImages.restaurant },
    { name: "Malakwang with Millet Bread", description: "Traditional Northern Ugandan vegetable stew with millet bread.", category: "LOCAL_CUISINE", price: 30000, image: demoImages.restaurant },
    { name: "Gnut Sauce with Sweet Potatoes", description: "Groundnut sauce served with steamed sweet potatoes.", category: "LOCAL_CUISINE", price: 28000, image: demoImages.restaurant },
    { name: "Beef Steak & Chips", description: "Grilled beef steak served with seasoned fries.", category: "INTERNATIONAL_CUISINE", price: 42000, image: demoImages.restaurant },
    { name: "Chocolate Lava Cake", description: "Warm chocolate cake with a molten center.", category: "DESSERTS", price: 18000, image: demoImages.restaurant },
    { name: "Fresh Passion Juice", description: "Freshly squeezed local passion fruit juice.", category: "BEVERAGES", price: 8000, image: demoImages.bar },
  ] as const;

  for (const item of menuItemsData) {
    await prisma.menuItem.upsert({
      where: { id: `demo-${item.name.replace(/\s+/g, "-").toLowerCase()}` },
      update: {},
      create: { id: `demo-${item.name.replace(/\s+/g, "-").toLowerCase()}`, ...item },
    });
  }
  console.log(`Seeded ${menuItemsData.length} menu items`);

  // --- Gallery images (15) ---
  const galleryData = [
    { url: demoImages.exterior, category: "HOTEL" },
    { url: demoImages.lobby, category: "HOTEL" },
    { url: demoImages.roomStandard, category: "ROOMS" },
    { url: demoImages.roomDeluxe, category: "ROOMS" },
    { url: demoImages.roomSuite, category: "ROOMS" },
    { url: demoImages.restaurant, category: "RESTAURANT" },
    { url: demoImages.bar, category: "RESTAURANT" },
    { url: demoImages.pool, category: "SWIMMING_POOL" },
    { url: demoImages.gym, category: "GYM" },
    { url: demoImages.conference, category: "CONFERENCE" },
    { url: demoImages.conference, category: "EVENTS" },
    { url: demoImages.garden, category: "GARDEN" },
    { url: demoImages.nature, category: "SURROUNDINGS" },
    { url: demoImages.market, category: "TOURISM" },
    { url: demoImages.culture, category: "TOURISM" },
  ] as const;

  await prisma.galleryImage.deleteMany({ where: { isDemo: true } });
  await prisma.galleryImage.createMany({
    data: galleryData.map((g) => ({ url: g.url, category: g.category, alt: "Lira Grand Hotel" })),
  });
  console.log(`Seeded ${galleryData.length} gallery images`);

  // --- Tourist attractions (6) ---
  const attractionsData = [
    {
      slug: "lira-main-market",
      name: "Lira Main Market",
      description: "A vibrant local market showcasing fresh produce, crafts, and everyday Northern Ugandan life. (Demo content — verify details.)",
      location: "Lira City Centre",
      distanceFromHotel: "2 km",
      travelTime: "5 minutes",
      thingsToDo: ["Shopping", "Photography", "Local Food"],
      image: demoImages.market,
    },
    {
      slug: "boke-cultural-site",
      name: "Boke Cultural Site",
      description: "A site of cultural significance for the Lango community. (Demo content — verify details.)",
      location: "Lira District",
      distanceFromHotel: "15 km",
      travelTime: "25 minutes",
      thingsToDo: ["Cultural Tours", "Storytelling"],
      image: demoImages.culture,
    },
    {
      slug: "lake-kwania",
      name: "Lake Kwania",
      description: "A scenic lake known for fishing and birdwatching. (Demo content — verify details.)",
      location: "Near Lira District",
      distanceFromHotel: "45 km",
      travelTime: "1 hour",
      thingsToDo: ["Boat Rides", "Birdwatching", "Fishing"],
      image: demoImages.nature,
    },
    {
      slug: "otino-waa-community",
      name: "Otino Waa Community Experience",
      description: "A community-based tourism initiative offering cultural exchange. (Demo content — verify details.)",
      location: "Lira District",
      distanceFromHotel: "20 km",
      travelTime: "30 minutes",
      thingsToDo: ["Community Visits", "Local Crafts"],
      image: demoImages.culture,
    },
    {
      slug: "murchison-falls-day-trip",
      name: "Murchison Falls National Park (Day Trip)",
      description: "Uganda's largest national park, home to the powerful Murchison Falls. (Demo content — verify details.)",
      location: "Northern Uganda",
      distanceFromHotel: "150 km",
      travelTime: "2.5 hours",
      thingsToDo: ["Game Drives", "Boat Cruise", "Waterfall Hike"],
      image: demoImages.nature,
    },
    {
      slug: "lira-historical-sites",
      name: "Lira Historical Sites",
      description: "Various sites reflecting the history and resilience of the Lira community. (Demo content — verify details.)",
      location: "Lira City",
      distanceFromHotel: "5 km",
      travelTime: "10 minutes",
      thingsToDo: ["Guided Tours", "Photography"],
      image: demoImages.culture,
    },
  ];

  for (const attraction of attractionsData) {
    await prisma.touristAttraction.upsert({
      where: { slug: attraction.slug },
      update: {},
      create: attraction,
    });
  }
  console.log(`Seeded ${attractionsData.length} tourist attractions`);

  // --- Testimonials (4) ---
  const testimonialsData = [
    { guestName: "Grace Akello", rating: 5, review: "Wonderful stay! The staff were incredibly welcoming and the rooms were spotless.", profileImage: demoImages.portrait1 },
    { guestName: "David Okello", rating: 5, review: "Best hotel in Lira City. Great food and the pool area is beautiful.", profileImage: demoImages.portrait2 },
    { guestName: "Sarah Nabirye", rating: 4, review: "Comfortable rooms and excellent location. Will definitely come back.", profileImage: demoImages.portrait3 },
    { guestName: "James Opio", rating: 5, review: "Hosted our conference here — the event team was very professional.", profileImage: demoImages.portrait4 },
  ];

  await prisma.testimonial.deleteMany({ where: { isDemo: true } });
  await prisma.testimonial.createMany({
    data: testimonialsData.map((t) => ({ ...t, isApproved: true })),
  });
  console.log(`Seeded ${testimonialsData.length} testimonials`);

  // --- Special offers (3) ---
  const now = new Date();
  const in90Days = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000);

  const offersData = [
    {
      slug: "weekend-getaway",
      title: "Weekend Getaway Package",
      description: "Enjoy two nights in a Deluxe Room with complimentary breakfast and late checkout.",
      originalPrice: 500000,
      discountedPrice: 400000,
      validFrom: now,
      validTo: in90Days,
      terms: "Valid Friday–Sunday only. Subject to availability.",
      image: demoImages.roomDeluxe,
    },
    {
      slug: "family-package",
      title: "Family Fun Package",
      description: "Family Room for 3 nights with free breakfast for children under 12.",
      originalPrice: 900000,
      discountedPrice: 750000,
      validFrom: now,
      validTo: in90Days,
      terms: "Valid for stays of 3 nights or more.",
      image: demoImages.roomFamily,
    },
    {
      slug: "corporate-rate",
      title: "Corporate Rate",
      description: "Special discounted rates for corporate travelers booking 5+ room-nights.",
      originalPrice: 320000,
      discountedPrice: 260000,
      validFrom: now,
      validTo: in90Days,
      terms: "Requires company registration details at booking.",
      image: demoImages.roomExecutive,
    },
  ];

  for (const offer of offersData) {
    await prisma.specialOffer.upsert({
      where: { slug: offer.slug },
      update: {},
      create: offer,
    });
  }
  console.log(`Seeded ${offersData.length} special offers`);

  // --- Conference halls ---
  const hallsData = [
    {
      slug: "savannah-hall",
      name: "Savannah Hall",
      description: "Our largest conference hall, suitable for large seminars and weddings.",
      capacity: 200,
      seatingArrangements: ["Theatre", "Classroom", "Banquet"],
      equipment: ["Projector", "Sound System", "Wi-Fi", "Microphones"],
      image: demoImages.conference,
    },
    {
      slug: "boardroom",
      name: "Executive Boardroom",
      description: "An intimate space ideal for board meetings and small workshops.",
      capacity: 20,
      seatingArrangements: ["Boardroom", "U-Shape"],
      equipment: ["Projector", "Wi-Fi", "Whiteboard"],
      image: demoImages.conference,
    },
  ];

  for (const hall of hallsData) {
    await prisma.conferenceHall.upsert({
      where: { slug: hall.slug },
      update: {},
      create: hall,
    });
  }
  console.log(`Seeded ${hallsData.length} conference halls`);

  console.log("Seeding complete.");
  console.log("First admin login: admin@liragrandhotel.com / ChangeMe123! (change this immediately)");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
