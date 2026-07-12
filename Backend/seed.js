require('dotenv').config();
const mongoose = require('mongoose');
const Home = require('./models/home');

const DB_PATH = process.env.MONGODB_URL || 'mongodb://127.0.0.1:27017/wandernest';

const seedHouses = [
  {
    houseName: "Glass Treehouse Oasis",
    price: 350,
    location: "Redwood Forest, California",
    rating: 4.9,
    photo: "https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=800&q=80",
    description: "An architectural marvel suspended among redwood trees. Features 360-degree glass walls, a copper wood-burning hot tub, and a suspension bridge entry."
  },
  {
    houseName: "Amalfi Cliffside Sanctuary",
    price: 850,
    location: "Positano, Italy",
    rating: 4.8,
    photo: "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=800&q=80",
    description: "Stunning cliffside sanctuary overlooking the Tyrrhenian Sea. Private infinity pool, lemon groves, and direct elevator access to a secluded beach cove."
  },
  {
    houseName: "Eco Bamboo Dome Ayung",
    price: 180,
    location: "Bali, Indonesia",
    rating: 4.7,
    photo: "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=800&q=80",
    description: "Eco-luxury bamboo dome set along the sacred Ayung River. Fully open-air living, private freshwater plunge pool, and lush jungle garden surroundings."
  },
  {
    houseName: "Minimalist Desert Hideaway",
    price: 290,
    location: "Joshua Tree, California",
    rating: 4.6,
    photo: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=800&q=80",
    description: "Off-grid concrete villa designed to blend into the desert rocks. Features stargazing hammocks, outdoor hot shower, and a private solar-heated pool."
  },
  {
    houseName: "Modern Nordic Sea Cabin",
    price: 320,
    location: "Lofoten, Norway",
    rating: 4.95,
    photo: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80",
    description: "Sleek Scandinavian retreat on the edge of the Norwegian sea. Perfect spot for viewing the Northern Lights with floor-to-ceiling panoramic windows."
  },
  {
    houseName: "Restored Kyoto Townhouse",
    price: 260,
    location: "Kyoto, Japan",
    rating: 4.85,
    photo: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80",
    description: "Lovingly restored 100-year-old traditional wooden townhouse in Gion. Features an authentic tatami tea room, cypress wood bath, and private moss garden."
  },
  {
    houseName: "Santorini Caldera Cave Suite",
    price: 720,
    location: "Caldera Oia, Greece",
    rating: 4.9,
    photo: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80",
    description: "Whitewashed cave dwelling carved directly into the caldera cliffs. Private heated cave plunge pool and majestic sunset views from the terrace."
  },
  {
    houseName: "Rustic Lavender Chateau",
    price: 950,
    location: "Provence, France",
    rating: 4.75,
    photo: "https://images.unsplash.com/photo-1505873242700-f289a29e1e0f?auto=format&fit=crop&w=800&q=80",
    description: "Stately 18th-century chateau surrounded by lavender fields and vineyards. Features antique furnishings, a tennis court, and an olive-tree courtyard."
  },
  {
    houseName: "Geothermal Glass Igloo",
    price: 450,
    location: "Reykjavik, Iceland",
    rating: 4.88,
    photo: "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=800&q=80",
    description: "Geothermal-heated glass igloo offering an unobstructed view of the Arctic sky. Sleep under the stars and watch the Aurora Borealis in warm comfort."
  },
  {
    houseName: "Alpine Lakefront A-Frame",
    price: 380,
    location: "Queenstown, New Zealand",
    rating: 4.92,
    photo: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80",
    description: "Charming A-frame cabin perched on the shores of Lake Wakatipu. Features a private boat dock, wood-fired hot tub, and spectacular alpine vistas."
  }
];

mongoose.connect(DB_PATH)
  .then(async () => {
    console.log('Connected to MongoDB for seeding.');
    
    // Seed new houses
    const result = await Home.insertMany(seedHouses);
    console.log(`Successfully seeded ${result.length} homes into WanderNest!`);
    
    mongoose.connection.close();
  })
  .catch(err => {
    console.error('Error seeding database:', err);
    process.exit(1);
  });
