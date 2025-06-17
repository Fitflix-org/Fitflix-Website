const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const ejsMate = require('ejs-mate');

const app = express();
const PORT = process.env.PORT || 3000;

// View engine setup
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Session configuration
app.use(session({
  secret: 'fitflix-secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

// Middleware to set current city
app.use((req, res, next) => {
  res.locals.currentCity = req.session.currentCity || 'Select City';
  next();
});

// Sample data
const cities = [
  { name: 'Mumbai', code: 'MUM', gyms: 45 },
  { name: 'Delhi', code: 'DEL', gyms: 38 },
  { name: 'Bangalore', code: 'BLR', gyms: 42 },
  { name: 'Chennai', code: 'CHE', gyms: 28 },
  { name: 'Hyderabad', code: 'HYD', gyms: 25 },
  { name: 'Pune', code: 'PUN', gyms: 32 }
];

const trainers = [
  {
    id: 1,
    name: 'Alex Rodriguez',
    specialty: 'Strength Training',
    experience: '8 years',
    rating: 4.9,
    city: 'Mumbai',
    gymId: 1,
    image: 'https://images.pexels.com/photos/1431282/pexels-photo-1431282.jpeg?auto=compress&cs=tinysrgb&w=400',
    price: '₹2,500/session',
    bio: 'Certified strength training specialist with expertise in powerlifting and bodybuilding.',
    certifications: ['ACSM Certified', 'NASM Specialist', 'Precision Nutrition Level 1']
  },
  {
    id: 2,
    name: 'Priya Sharma',
    specialty: 'Yoga & Flexibility',
    experience: '6 years',
    rating: 4.8,
    city: 'Delhi',
    gymId: 2,
    image: 'https://images.pexels.com/photos/3757942/pexels-photo-3757942.jpeg?auto=compress&cs=tinysrgb&w=400',
    price: '₹2,000/session',
    bio: 'Experienced yoga instructor specializing in Hatha and Vinyasa yoga.',
    certifications: ['RYT 500', 'Meditation Teacher', 'Ayurveda Consultant']
  },
  {
    id: 3,
    name: 'Mike Johnson',
    specialty: 'HIIT & Cardio',
    experience: '5 years',
    rating: 4.7,
    city: 'Bangalore',
    gymId: 3,
    image: 'https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg?auto=compress&cs=tinysrgb&w=400',
    price: '₹2,200/session',
    bio: 'High-intensity interval training expert focused on cardiovascular fitness.',
    certifications: ['HIIT Specialist', 'Cardio Trainer', 'Nutrition Coach']
  }
];

const gyms = [
  {
    id: 1,
    name: 'FitFlix Elite Mumbai',
    location: 'Bandra West, Mumbai',
    fullAddress: '123 Fitness Street, Bandra West, Mumbai 400050',
    rating: 4.8,
    distance: '2.5 km',
    phone: '+91 9876543210',
    email: 'mumbai@fitflix.com',
    timings: {
      weekdays: '5:00 AM - 11:00 PM',
      saturday: '6:00 AM - 10:00 PM',
      sunday: '7:00 AM - 9:00 PM'
    },
    amenities: ['Swimming Pool', 'Spa', 'Personal Training', 'Group Classes', 'Steam Room', 'Parking'],
    image: 'https://images.pexels.com/photos/1552252/pexels-photo-1552252.jpeg?auto=compress&cs=tinysrgb&w=800',
    heroVideo: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
    gallery: [
      'https://images.pexels.com/photos/1552252/pexels-photo-1552252.jpeg?auto=compress&cs=tinysrgb&w=600',
      'https://images.pexels.com/photos/1552103/pexels-photo-1552103.jpeg?auto=compress&cs=tinysrgb&w=600',
      'https://images.pexels.com/photos/1431282/pexels-photo-1431282.jpeg?auto=compress&cs=tinysrgb&w=600'
    ],
    classes: ['Yoga', 'HIIT', 'Zumba', 'CrossFit', 'Pilates'],
    city: 'Mumbai',
    membershipPlans: [
      { name: 'Basic', price: '₹2,999', features: ['Gym Access', 'Locker', 'Basic Equipment'] },
      { name: 'Premium', price: '₹4,999', features: ['Everything in Basic', 'Group Classes', 'Nutrition Consultation'] },
      { name: 'Elite', price: '₹7,999', features: ['Everything in Premium', 'Personal Training', 'Spa Access'] }
    ]
  },
  {
    id: 2,
    name: 'FitFlix Premium Delhi',
    location: 'Connaught Place, Delhi',
    fullAddress: '456 Wellness Avenue, Connaught Place, Delhi 110001',
    rating: 4.6,
    distance: '1.8 km',
    phone: '+91 9876543211',
    email: 'delhi@fitflix.com',
    timings: {
      weekdays: '5:30 AM - 10:30 PM',
      saturday: '6:00 AM - 10:00 PM',
      sunday: '7:00 AM - 9:00 PM'
    },
    amenities: ['Steam Room', 'Cafeteria', 'Yoga Studio', 'Crossfit Area', 'Parking', 'Massage'],
    image: 'https://images.pexels.com/photos/1552103/pexels-photo-1552103.jpeg?auto=compress&cs=tinysrgb&w=800',
    heroVideo: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
    gallery: [
      'https://images.pexels.com/photos/1552103/pexels-photo-1552103.jpeg?auto=compress&cs=tinysrgb&w=600',
      'https://images.pexels.com/photos/1552252/pexels-photo-1552252.jpeg?auto=compress&cs=tinysrgb&w=600'
    ],
    classes: ['Yoga', 'CrossFit', 'Boxing', 'Dance Fitness'],
    city: 'Delhi',
    membershipPlans: [
      { name: 'Basic', price: '₹2,799', features: ['Gym Access', 'Locker', 'Basic Equipment'] },
      { name: 'Premium', price: '₹4,599', features: ['Everything in Basic', 'Group Classes', 'Nutrition Consultation'] }
    ]
  },
  {
    id: 3,
    name: 'FitFlix Pro Bangalore',
    location: 'Koramangala, Bangalore',
    fullAddress: '789 Tech Park Road, Koramangala, Bangalore 560034',
    rating: 4.7,
    distance: '3.2 km',
    phone: '+91 9876543212',
    email: 'bangalore@fitflix.com',
    timings: {
      weekdays: '5:00 AM - 11:30 PM',
      saturday: '6:00 AM - 10:30 PM',
      sunday: '7:00 AM - 9:30 PM'
    },
    amenities: ['Swimming Pool', 'Sauna', 'Juice Bar', 'Personal Training', 'Group Classes'],
    image: 'https://images.pexels.com/photos/1431282/pexels-photo-1431282.jpeg?auto=compress&cs=tinysrgb&w=800',
    heroVideo: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
    gallery: [
      'https://images.pexels.com/photos/1431282/pexels-photo-1431282.jpeg?auto=compress&cs=tinysrgb&w=600'
    ],
    classes: ['HIIT', 'Functional Training', 'Aqua Aerobics'],
    city: 'Bangalore',
    membershipPlans: [
      { name: 'Basic', price: '₹3,199', features: ['Gym Access', 'Locker', 'Basic Equipment'] },
      { name: 'Premium', price: '₹5,199', features: ['Everything in Basic', 'Group Classes', 'Swimming Pool'] }
    ]
  }
];

const teamMembers = [
  {
    id: 1,
    name: 'Rajesh Kumar',
    role: 'Founder & CEO',
    image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
    bio: 'Visionary leader with 15+ years in fitness industry',
    linkedin: '#'
  },
  {
    id: 2,
    name: 'Anita Desai',
    role: 'Head of Operations',
    image: 'https://images.pexels.com/photos/3757942/pexels-photo-3757942.jpeg?auto=compress&cs=tinysrgb&w=400',
    bio: 'Operations expert ensuring seamless gym experiences',
    linkedin: '#'
  },
  {
    id: 3,
    name: 'Vikram Singh',
    role: 'Fitness Director',
    image: 'https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg?auto=compress&cs=tinysrgb&w=400',
    bio: 'Certified fitness professional and program developer',
    linkedin: '#'
  },
  {
    id: 4,
    name: 'Meera Patel',
    role: 'Nutrition Specialist',
    image: 'https://images.pexels.com/photos/3768114/pexels-photo-3768114.jpeg?auto=compress&cs=tinysrgb&w=400',
    bio: 'Registered dietitian with expertise in sports nutrition',
    linkedin: '#'
  }
];

const advancedServices = [
  {
    id: 1,
    name: 'Red Light Therapy',
    description: 'Advanced LED therapy for muscle recovery and skin health',
    image: 'https://images.pexels.com/photos/3768114/pexels-photo-3768114.jpeg?auto=compress&cs=tinysrgb&w=400',
    price: '₹1,500/session',
    city: 'Mumbai'
  },
  {
    id: 2,
    name: 'Cryotherapy',
    description: 'Whole-body cold therapy for recovery and wellness',
    image: 'https://images.pexels.com/photos/3757942/pexels-photo-3757942.jpeg?auto=compress&cs=tinysrgb&w=400',
    price: '₹2,000/session',
    city: 'Delhi'
  },
  {
    id: 3,
    name: 'Hyperbaric Oxygen Therapy',
    description: 'Enhanced oxygen therapy for athletic performance',
    image: 'https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg?auto=compress&cs=tinysrgb&w=400',
    price: '₹2,500/session',
    city: 'Bangalore'
  }
];

// Routes
app.get('/', (req, res) => {
  res.render('home', { 
    title: 'FitFlix - Transform Your Fitness Journey',
    cities,
    featuredTrainers: trainers.slice(0, 3),
    featuredGyms: gyms.slice(0, 2),
    teamMembers
  });
});

app.get('/gyms', (req, res) => {
  const cityFilter = req.query.city;
  const filteredGyms = cityFilter ? gyms.filter(gym => gym.city === cityFilter) : gyms;
  
  res.render('gyms', { 
    title: 'Find Gyms in the City - FitFlix',
    gyms: filteredGyms,
    allGyms: gyms,
    cities,
    selectedCity: cityFilter
  });
});

app.get('/gym/:id', (req, res) => {
  const gym = gyms.find(g => g.id === parseInt(req.params.id));
  if (!gym) {
    return res.status(404).render('404', { title: 'Gym Not Found' });
  }
  
  const gymTrainers = trainers.filter(t => t.gymId === gym.id);
  const nearbyGyms = gyms.filter(g => g.city === gym.city && g.id !== gym.id);
  
  res.render('gym-details', { 
    title: `${gym.name} - FitFlix`,
    gym,
    trainers: gymTrainers,
    nearbyGyms
  });
});

app.get('/services', (req, res) => {
  const cityFilter = req.query.city;
  const filteredServices = cityFilter ? 
    advancedServices.filter(service => service.city === cityFilter) : 
    advancedServices;
  
  res.render('services', { 
    title: 'Advanced Services - FitFlix',
    advancedServices: filteredServices,
    allServices: advancedServices,
    cities,
    selectedCity: cityFilter
  });
});

app.get('/trainers', (req, res) => {
  const cityFilter = req.query.city;
  const filteredTrainers = cityFilter ? trainers.filter(trainer => trainer.city === cityFilter) : trainers;
  
  res.render('trainers', { 
    title: 'Personal Trainers - FitFlix',
    trainers: filteredTrainers,
    cities,
    selectedCity: cityFilter
  });
});

app.get('/trainer/:id', (req, res) => {
  const trainer = trainers.find(t => t.id === parseInt(req.params.id));
  if (!trainer) {
    return res.status(404).render('404', { title: 'Trainer Not Found' });
  }
  
  res.render('trainer-profile', { 
    title: `${trainer.name} - FitFlix`,
    trainer
  });
});

app.get('/city-selection', (req, res) => {
  res.render('city-selection', { 
    title: 'Select Your City - FitFlix',
    cities
  });
});

app.post('/select-city', (req, res) => {
  const { city } = req.body;
  req.session.currentCity = city;
  res.redirect('/');
});

app.get('/contact', (req, res) => {
  res.render('contact', { 
    title: 'Contact Us - FitFlix'
  });
});

app.post('/contact', (req, res) => {
  res.json({ success: true, message: 'Message sent successfully!' });
});

// New route for handling leads
app.post('/leads', (req, res) => {
  const leadData = {
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    query: req.body.query || '',
    source: req.body.source || 'website',
    gymId: req.body.gymId || null,
    trainerId: req.body.trainerId || null,
    serviceId: req.body.serviceId || null,
    timestamp: new Date()
  };
  
  console.log('New lead received:', leadData);
  res.json({ success: true, message: 'Thank you! We will contact you soon.' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).render('404', { title: 'Page Not Found - FitFlix' });
});

app.listen(PORT, () => {
  console.log(`🚀 FitFlix server running on http://localhost:${PORT}`);
});