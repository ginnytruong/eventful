import admin from "firebase-admin";
import { readFileSync } from "fs";

const serviceAccount = JSON.parse(
  readFileSync(
    "./event-platform-v1-firebase-adminsdk-l1oqu-b75625ae09.json",
    "utf8"
  )
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

const events = [
  {
    creatorID: "V8Ltg4DDS5eIcz3m7e2DVzGnn2G3",
    title: "Join the Living Room Session with Doja Cat",
    location: "Los Angeles, CA",
    startDateTime: new Date("2024-12-10T20:00:00"),
    endDateTime: new Date("2024-12-10T23:00:00"),
    description:
      "Join us for an unforgettable night with Doja Cat as she performs her biggest hits live.",
    price: 120,
    imageUrl:
      "https://a0.muscache.com/im/pictures/hosting/Hosting-U3RheVN1cHBseUxpc3Rpbmc6MTEyNjMyMzc5Mzc2MTc3OTEzMg%3D%3D/original/8a39953f-f158-4cc2-a112-aa4079e0fca8.jpeg?im_w=1440&im_q=highq",
  },
  {
    creatorID: "V8Ltg4DDS5eIcz3m7e2DVzGnn2G3",
    title: "Visit Prince’s Purple Rain house",
    location: "Los Angeles, CA",
    startDateTime: new Date("2024-12-10T20:00:00"),
    endDateTime: new Date("2024-12-10T23:00:00"),
    description:
      "Visit the actual Purple Rain house. See The Kid’s basement bedroom, where your dreams actually come true.",
    price: 120,
    imageUrl:
      "https://a0.muscache.com/im/pictures/hosting/Hosting-U3RheVN1cHBseUxpc3Rpbmc6MTEzMTA4OTQ5ODA0MDcwMTE4Mw%3D%3D/original/a766e0e9-1e6f-4b88-b8d5-ce12375c6de8.png?im_w=2560&im_q=highq",
  },
  {
    creatorID: "V8Ltg4DDS5eIcz3m7e2DVzGnn2G3",
    title: "Polly Pocket Experience Pop-Up",
    location: "New York, NY",
    startDateTime: new Date("2024-11-15T10:00:00"),
    endDateTime: new Date("2024-11-15T18:00:00"),
    description:
      "Step into a whimsical world of Polly Pocket! This interactive pop-up features life-size playsets.",
    price: 25,
    imageUrl:
      "https://a0.muscache.com/im/pictures/hosting/Hosting-U3RheVN1cHBseUxpc3Rpbmc6MTE3NzY2MTYzNDg4MjE2ODY1Nw%3D%3D/original/a332d020-4315-4f63-af71-444d46474939.png?im_w=1440&im_q=highq",
  },
  {
    creatorID: "V8Ltg4DDS5eIcz3m7e2DVzGnn2G3",
    title: "Design your Incredibles Supersuit",
    location: "Los Angeles, California, United States",
    startDateTime: new Date("2024-11-15T10:00:00"),
    endDateTime: new Date("2024-11-15T18:00:00"),
    description:
      "Visit my office for your design consultation. Step into my (very tasteful) shoes and dream up your own Supersuit. Customise your suit for fabulous functionality. Assemble your actual suit with my (very expensive) collection of materials.",
    price: 25,
    imageUrl:
      "https://a0.muscache.com/im/pictures/hosting/Hosting-U3RheVN1cHBseUxpc3Rpbmc6MTE0ODQ2MDI1NTE4MDMzOTQ4MQ%3D%3D/original/c92634d0-4964-439a-905d-b9129af14d34.jpeg?im_w=2560&im_q=highq",
  },
  {
    creatorID: "V8Ltg4DDS5eIcz3m7e2DVzGnn2G3",
    title: "Drift off in the Up house",
    location: "Abiquiu, New Mexico, United States",
    startDateTime: new Date("2024-11-15T10:00:00"),
    endDateTime: new Date("2024-11-15T18:00:00"),
    description:
      "Visit at my house – it’s the one with the balloons! My house has over 8,000 balloons floating from the top of it. Ha!",
    price: 25,
    imageUrl:
      "https://a0.muscache.com/im/pictures/hosting/Hosting-U3RheVN1cHBseUxpc3Rpbmc6MTEyNjE4NTg5MzIzNjI0NjI2MA%3D%3D/original/e6b26733-2c15-47d9-b097-6968b39bb697.jpeg?im_w=2560&im_q=highq",
  },
  {
    creatorID: "V8Ltg4DDS5eIcz3m7e2DVzGnn2G3",
    title: "Shrek’s Swamp",
    location: "Highland Council, United Kingdom",
    startDateTime: new Date("2024-11-15T10:00:00"),
    endDateTime: new Date("2024-11-15T18:00:00"),
    description:
      "Relax in the soft glow of earwax candlelight. Shrek’s really added a lot of cosy touches here. Eat a parfait (everybody likes a parfait!). I guarantee there are no onions involved. Swap stories around a late-night campfire.",
    price: 25,
    imageUrl:
      "https://a0.muscache.com/im/pictures/miso/Hosting-881808599061267756/original/b16970cf-1d55-4edd-bb1f-e1735d0a228e.jpeg?im_w=2560&im_q=highq",
  },
  {
    creatorID: "V8Ltg4DDS5eIcz3m7e2DVzGnn2G3",
    title: "Barbie’s Malibu DreamHouse, Ken’s Way",
    location: "Malibu, California, United States",
    startDateTime: new Date("2024-11-15T10:00:00"),
    endDateTime: new Date("2024-11-15T18:00:00"),
    description:
      "Welcome to my Kendom! While Barbie is away, she has handed over the keys to her Malibu DreamHouse this summer and my room could be yours for the night. I’ve added a few touches to bring some much-needed Kenergy to the newly renovated and iconic Malibu DreamHouse. Placed perfectly above the beach with panoramic views, this life-size toy pink mansion is a dream come true!",
    price: 25,
    imageUrl:
      "https://a0.muscache.com/im/pictures/miso/Hosting-857387972692815761/original/d106e0ef-f825-4ff8-baf7-86256a54fbd5.jpeg?im_w=2560&im_q=highq",
  },
  {
    creatorID: "V8Ltg4DDS5eIcz3m7e2DVzGnn2G3",
    title: "Friends Themed Trivia Night",
    location: "Chicago, IL",
    startDateTime: new Date("2024-11-20T19:00:00"),
    endDateTime: new Date("2024-11-20T22:00:00"),
    description:
      "Gather your friends and test your knowledge on the beloved sitcom, Friends.",
    price: 10,
    imageUrl:
      "https://static.wikia.nocookie.net/friends/images/7/74/Monica%27s_apt_2.png/revision/latest?cb=20110723170201",
  },
  {
    creatorID: "V8Ltg4DDS5eIcz3m7e2DVzGnn2G3",
    title: "Harry Potter Escape Room Adventure",
    location: "Orlando, FL",
    startDateTime: new Date("2024-12-05T16:00:00"),
    endDateTime: new Date("2024-12-05T18:00:00"),
    description:
      "Join fellow wizards for a magical escape room experience based on the Harry Potter universe.",
    price: 50,
    imageUrl:
      "https://en.vogue.me/wp-content/uploads/2024/06/promo-harry-potter.jpg",
  },
  {
    creatorID: "V8Ltg4DDS5eIcz3m7e2DVzGnn2G3",
    title: "Marvel Superhero Costume Party",
    location: "Austin, TX",
    startDateTime: new Date("2024-11-25T21:00:00"),
    endDateTime: new Date("2024-11-26T02:00:00"),
    description:
      "Put on your best superhero costume and join us for an epic night of dancing and Marvel-themed fun!",
    price: 30,
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/en/1/19/Marvel_Universe_%28Civil_War%29.jpg",
  },
  {
    creatorID: "V8Ltg4DDS5eIcz3m7e2DVzGnn2G3",
    title: "K-Pop Dance Workshop with BTS Choreographer",
    location: "San Francisco, CA",
    startDateTime: new Date("2024-12-01T14:00:00"),
    endDateTime: new Date("2024-12-01T17:00:00"),
    description:
      "Learn the latest K-Pop dance moves from a professional choreographer who has worked with BTS!",
    price: 65,
    imageUrl:
      "https://m.media-amazon.com/images/M/MV5BOGZiMTE4MjYtZGU5YS00YTgwLWI0YzYtMTY5OGY1ODBiZjUzXkEyXkFqcGc@._V1_.jpg",
  },
  {
    creatorID: "V8Ltg4DDS5eIcz3m7e2DVzGnn2G3",
    title: "The Office Trivia and Bingo Night",
    location: "Philadelphia, PA",
    startDateTime: new Date("2024-11-29T18:00:00"),
    endDateTime: new Date("2024-11-29T21:00:00"),
    description:
      "Join us for a night of laughs and fun with trivia and bingo games themed around The Office.",
    price: 15,
    imageUrl:
      "https://people.com/thmb/smqKWDXa6NFWc7b6QzgJ7Q48K20=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc():focal(999x0:1001x2)/the-office-e1031c9574194f6b9bc5cc02de64918b.jpg",
  },
  {
    creatorID: "V8Ltg4DDS5eIcz3m7e2DVzGnn2G3",
    title: "Disney Villains Night at the Theme Park",
    location: "Anaheim, CA",
    startDateTime: new Date("2024-12-15T18:00:00"),
    endDateTime: new Date("2024-12-15T23:00:00"),
    description:
      "Celebrate your favorite Disney villains with themed attractions and exclusive merchandise at the theme park!",
    price: 99,
    imageUrl:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTLjphdNtwxjavBkYT9m3LPi2ZlPIRoDQi-tw&s",
  },
  {
    creatorID: "V8Ltg4DDS5eIcz3m7e2DVzGnn2G3",
    title: "Taylor Swift Dance Party",
    location: "Nashville, TN",
    startDateTime: new Date("2024-11-12T20:00:00"),
    endDateTime: new Date("2024-11-12T23:00:00"),
    description:
      "Dance the night away to all of Taylor Swift's hits at this epic dance party!",
    price: 40,
    imageUrl:
      "https://i.guim.co.uk/img/media/29e9d1c242ea444f2287886ea1002b8f14d595b0/0_31_3180_1909/master/3180.jpg?width=465&dpr=1&s=none",
  },
  {
    creatorID: "V8Ltg4DDS5eIcz3m7e2DVzGnn2G3",
    title: "Stranger Things Upside Down Experience",
    location: "Atlanta, GA",
    startDateTime: new Date("2024-12-20T10:00:00"),
    endDateTime: new Date("2024-12-20T20:00:00"),
    description:
      "Enter the Upside Down and explore this immersive experience based on Stranger Things!",
    price: 55,
    imageUrl:
      "https://www.timeoutabudhabi.com/cloud/timeoutabudhabi/2022/06/04/Intl-Stranger-Things-Prison1.jpg",
  },
  {
    creatorID: "V8Ltg4DDS5eIcz3m7e2DVzGnn2G3",
    title: "SpongeBob SquarePants Pop-Up Cafe",
    location: "Las Vegas, NV",
    startDateTime: new Date("2024-11-05T10:00:00"),
    endDateTime: new Date("2024-11-05T18:00:00"),
    description:
      "Join us for a day of fun and food inspired by the underwater world of SpongeBob!",
    price: 30,
    imageUrl:
      "https://cdn.apartmenttherapy.info/image/upload/v1615748062/at/news-culture/2021-03/vrbo-paramount-living.jpg",
  },
  {
    creatorID: "V8Ltg4DDS5eIcz3m7e2DVzGnn2G3",
    title: "Pokémon Go Community Day",
    location: "Seattle, WA",
    startDateTime: new Date("2024-11-10T12:00:00"),
    endDateTime: new Date("2024-11-10T17:00:00"),
    description:
      "Catch Pokémon with fellow trainers and enjoy exclusive bonuses during Community Day!",
    price: 0,
    imageUrl:
      "https://lh3.googleusercontent.com/RGShDyVofSODXIJ0eQ9umAID8tCw9KdqBFrtgCEdrxjJijG1qZBryfECP9IRV1MOJhCk4Za4VYB34DE-hnPesZNNVYMwgHKs9KrNue3LNJRJuw=e365-w1920",
  },
  {
    creatorID: "V8Ltg4DDS5eIcz3m7e2DVzGnn2G3",
    title: "Game of Thrones Feast",
    location: "Boston, MA",
    startDateTime: new Date("2024-12-08T18:00:00"),
    endDateTime: new Date("2024-12-08T21:00:00"),
    description:
      "Feast like a king or queen at this immersive dining experience inspired by Game of Thrones!",
    price: 85,
    imageUrl:
      "https://pyxis.nymag.com/v1/imgs/551/7fb/8b60668e47728a986625ec73a3482e6712-09-got-food-1.1x.rsocial.w1200.jpg",
  },
  {
    creatorID: "V8Ltg4DDS5eIcz3m7e2DVzGnn2G3",
    title: "The Mandalorian Escape Room",
    location: "Dallas, TX",
    startDateTime: new Date("2024-12-12T16:00:00"),
    endDateTime: new Date("2024-12-12T19:00:00"),
    description:
      "Join fellow fans for an escape room adventure themed around The Mandalorian!",
    price: 50,
    imageUrl:
      "https://m.media-amazon.com/images/M/MV5BMTIzNGJmYzgtYzNiZi00N2ZmLTlkZTQtMmUyNGVhNGE0YTMzXkEyXkFqcGc@._V1_.jpg",
  },
  {
    creatorID: "V8Ltg4DDS5eIcz3m7e2DVzGnn2G3",
    title: "Avatar: The Experience",
    location: "San Diego, CA",
    startDateTime: new Date("2024-11-22T10:00:00"),
    endDateTime: new Date("2024-11-22T18:00:00"),
    description:
      "Explore the world of Pandora with immersive activities and exhibits at Avatar: The Experience!",
    price: 60,
    imageUrl:
      "https://www.cnet.com/a/img/resize/05ddcebef02ed2db237bb6ecabc40255a94b10bb/hub/2019/01/11/b251bf04-5bf8-469a-be8d-79489551460b/avatar-2009.jpg?auto=webp&fit=crop&height=675&width=1200",
  },
  {
    creatorID: "V8Ltg4DDS5eIcz3m7e2DVzGnn2G3",
    title: "The Great British Bake Off Bake Along",
    location: "London, UK",
    startDateTime: new Date("2024-12-03T14:00:00"),
    endDateTime: new Date("2024-12-03T17:00:00"),
    description:
      "Join us for a virtual bake-along inspired by The Great British Bake Off. Bake and share your creations!",
    price: 20,
    imageUrl:
      "https://akns-images.eonline.com/eol_images/Entire_Site/2021027/rs_1024x759-210127175437-1024-great-british-bake-off-paul-hollywood.jpg?fit=around%7C1024:759&output-quality=90&crop=1024:759;center,top",
  },
  {
    creatorID: "V8Ltg4DDS5eIcz3m7e2DVzGnn2G3",
    title: "Nostalgic 90s Night",
    location: "Miami, FL",
    startDateTime: new Date("2024-11-30T21:00:00"),
    endDateTime: new Date("2024-12-01T02:00:00"),
    description:
      "Dance the night away to all the 90s hits and enjoy retro games and trivia!",
    price: 25,
    imageUrl:
      "https://thumbs.dreamstime.com/b/poster-s-s-memphis-style-card-invitation-geometric-elements-sneakers-tape-cassette-back-to-vector-illustration-95215097.jpg",
  },
  {
    creatorID: "V8Ltg4DDS5eIcz3m7e2DVzGnn2G3",
    title: "Pop Art Painting Class",
    location: "Denver, CO",
    startDateTime: new Date("2024-12-14T13:00:00"),
    endDateTime: new Date("2024-12-14T16:00:00"),
    description:
      "Join us for a fun pop art painting class where you'll create your own masterpiece!",
    price: 40,
    imageUrl:
      "https://theartchi.com/cdn/shop/articles/webpc-passthru.webp?v=1703223992&width=2048",
  },
];

const eventsWithId = events.map((event, index) => ({
  id: `event-${index}`,
  ...event,
}));

async function bulkUpload() {
  const batch = db.batch();

  eventsWithId.forEach((event) => {
    const docRef = db.collection("Events").doc(event.id);
    batch.set(docRef, event);
  });

  await batch.commit();
  console.log("Bulk upload completed successfully!");
}

bulkUpload().catch(console.error);