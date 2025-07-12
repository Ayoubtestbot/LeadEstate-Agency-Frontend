#!/usr/bin/env node

/**
 * Script to add 50 sample leads with different statuses and assign them to agents
 * Also adds sample properties with images
 */

// Using built-in fetch (Node.js 18+)

// Configuration
const API_BASE_URL = 'https://leadestate-backend-9fih.onrender.com/api';

// Sample data arrays
const firstNames = [
  'Ahmed', 'Fatima', 'Mohammed', 'Aicha', 'Youssef', 'Khadija', 'Omar', 'Zineb',
  'Hassan', 'Salma', 'Karim', 'Nadia', 'Rachid', 'Laila', 'Abdelaziz', 'Samira',
  'Mehdi', 'Houda', 'Khalid', 'Amina', 'Said', 'Malika', 'Hamza', 'Rajae',
  'Mustapha', 'Souad', 'Tarik', 'Widad', 'Amine', 'Karima', 'Driss', 'Nawal',
  'Brahim', 'Latifa', 'Ismail', 'Hayat', 'Noureddine', 'Ghita', 'Abderrahim', 'Siham',
  'Aziz', 'Btissam', 'Jamal', 'Nezha', 'Redouane', 'Fadwa', 'Samir', 'Ilham',
  'Abdellah', 'Meriem', 'Othmane', 'Safaa'
];

const lastNames = [
  'Alami', 'Benali', 'Cherkaoui', 'Douiri', 'El Fassi', 'Filali', 'Ghazi', 'Hajji',
  'Idrissi', 'Jebari', 'Kettani', 'Lahlou', 'Mansouri', 'Naciri', 'Ouali', 'Qadiri',
  'Rami', 'Sabri', 'Tazi', 'Usmani', 'Wahbi', 'Yaacoubi', 'Ziani', 'Amrani',
  'Berrada', 'Chraibi', 'Drissi', 'El Amrani', 'Fassi', 'Guerraoui', 'Hakim', 'Ismaili',
  'Jaidi', 'Kabbaj', 'Lamrani', 'Mazouz', 'Nejjar', 'Ouazzani', 'Qassemi', 'Rifai',
  'Semlali', 'Tahiri', 'Usseglio', 'Vidal', 'Wali', 'Yousfi', 'Zahra', 'Bennani'
];

const cities = [
  'Casablanca', 'Rabat', 'Marrakech', 'Fès', 'Tanger', 'Agadir', 'Meknès', 'Oujda',
  'Kenitra', 'Tétouan', 'Safi', 'Mohammedia', 'Khouribga', 'El Jadida', 'Béni Mellal',
  'Nador', 'Taza', 'Settat', 'Larache', 'Ksar el-Kebir'
];

const sources = ['website', 'facebook', 'google', 'referral', 'walk-in', 'phone', 'email', 'whatsapp'];
const statuses = ['new', 'contacted', 'qualified', 'proposal', 'negotiation', 'closed-won', 'closed-lost'];
const propertyTypes = ['apartment', 'house', 'condo', 'townhouse', 'villa', 'commercial', 'land'];
const priorities = ['low', 'medium', 'high'];

// Sample agents (these should match your actual agent IDs)
const sampleAgents = [
  'agent-001', 'agent-002', 'agent-003', 'super-agent-001', 'super-agent-002'
];

// Property images from Unsplash (real estate focused)
const propertyImages = [
  'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1605146769289-440113cc3d00?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop'
];

// Utility functions
function getRandomElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomPrice(min, max) {
  return Math.floor(Math.random() * (max - min + 1) / 1000) * 1000 + min;
}

function generatePhoneNumber() {
  const prefixes = ['06', '07'];
  const prefix = getRandomElement(prefixes);
  const number = Math.floor(Math.random() * 100000000).toString().padStart(8, '0');
  return `+212${prefix}${number}`;
}

function generateEmail(firstName, lastName) {
  const domains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com'];
  const domain = getRandomElement(domains);
  return `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${domain}`;
}

function getRandomDate(daysBack) {
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * daysBack));
  return date.toISOString();
}

// Generate sample lead data
function generateLead(index) {
  const firstName = getRandomElement(firstNames);
  const lastName = getRandomElement(lastNames);
  const status = getRandomElement(statuses);
  const source = getRandomElement(sources);
  const city = getRandomElement(cities);
  const propertyType = getRandomElement(propertyTypes);
  const priority = getRandomElement(priorities);
  const assignedTo = Math.random() > 0.2 ? getRandomElement(sampleAgents) : null; // 80% assigned

  return {
    first_name: firstName,
    last_name: lastName,
    email: generateEmail(firstName, lastName),
    phone: generatePhoneNumber(),
    whatsapp: generatePhoneNumber(),
    city: city,
    address: `${getRandomNumber(1, 999)} Rue ${getRandomElement(['Hassan II', 'Mohammed V', 'Atlas', 'Anfa', 'Zerktouni'])}`,
    status: status,
    source: source,
    budget_min: getRandomPrice(500000, 2000000),
    budget_max: getRandomPrice(2000000, 5000000),
    property_type: propertyType,
    bedrooms: getRandomNumber(1, 5),
    bathrooms: getRandomNumber(1, 4),
    notes: `Interested in ${propertyType} in ${city}. Budget flexible. ${getRandomElement(['Urgent', 'Flexible timeline', 'First-time buyer', 'Investment property', 'Family home'])}`,
    assigned_to: assignedTo,
    priority: priority,
    score: getRandomNumber(0, 100),
    language: 'fr',
    tags: [propertyType, city, priority],
    agency_id: 'default-agency',
    created_at: getRandomDate(30),
    updated_at: getRandomDate(7)
  };
}

// Generate sample property data
function generateProperty(index) {
  const type = getRandomElement(propertyTypes);
  const city = getRandomElement(cities);
  const neighborhood = getRandomElement(['Centre-ville', 'Maarif', 'Anfa', 'Hay Riad', 'Agdal', 'Gueliz']);
  
  return {
    title: `${type.charAt(0).toUpperCase() + type.slice(1)} moderne à ${city}`,
    type: type,
    price: getRandomPrice(800000, 4000000),
    address: `${getRandomNumber(1, 200)} Avenue ${getRandomElement(['Mohammed V', 'Hassan II', 'Atlas', 'Anfa'])}`,
    city: city,
    state: 'Morocco',
    bedrooms: type === 'land' ? null : getRandomNumber(1, 5),
    bathrooms: type === 'land' ? null : getRandomNumber(1, 4),
    area: getRandomNumber(80, 300),
    description: `Magnifique ${type} situé dans le quartier ${neighborhood} de ${city}. ${getRandomElement(['Vue panoramique', 'Proche des commodités', 'Quartier calme', 'Transport en commun', 'Écoles à proximité'])}. ${getRandomElement(['Rénové récemment', 'État neuf', 'Bon état général', 'À rénover partiellement'])}`,
    image_url: getRandomElement(propertyImages),
    created_at: getRandomDate(60),
    updated_at: getRandomDate(14)
  };
}

// API functions
async function createLead(leadData) {
  try {
    const response = await fetch(`${API_BASE_URL}/leads`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(leadData)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error creating lead:', error);
    return null;
  }
}

async function createProperty(propertyData) {
  try {
    const response = await fetch(`${API_BASE_URL}/properties`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(propertyData)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error creating property:', error);
    return null;
  }
}

// Main execution function
async function main() {
  console.log('🚀 Starting to add sample data...\n');

  // Add 50 leads
  console.log('📊 Adding 50 sample leads...');
  let leadsCreated = 0;
  
  for (let i = 0; i < 50; i++) {
    const leadData = generateLead(i);
    const result = await createLead(leadData);
    
    if (result && result.success) {
      leadsCreated++;
      console.log(`✅ Lead ${i + 1}/50: ${leadData.first_name} ${leadData.last_name} (${leadData.status}) - Assigned to: ${leadData.assigned_to || 'Unassigned'}`);
    } else {
      console.log(`❌ Failed to create lead ${i + 1}/50: ${leadData.first_name} ${leadData.last_name}`);
    }
    
    // Small delay to avoid overwhelming the server
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  console.log(`\n📊 Leads Summary: ${leadsCreated}/50 leads created successfully\n`);

  // Add 15 properties with images
  console.log('🏠 Adding 15 sample properties with images...');
  let propertiesCreated = 0;
  
  for (let i = 0; i < 15; i++) {
    const propertyData = generateProperty(i);
    const result = await createProperty(propertyData);
    
    if (result && result.success) {
      propertiesCreated++;
      console.log(`✅ Property ${i + 1}/15: ${propertyData.title} - ${propertyData.price.toLocaleString()} MAD`);
    } else {
      console.log(`❌ Failed to create property ${i + 1}/15: ${propertyData.title}`);
    }
    
    // Small delay to avoid overwhelming the server
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  console.log(`\n🏠 Properties Summary: ${propertiesCreated}/15 properties created successfully\n`);

  console.log('🎉 Sample data addition completed!');
  console.log(`\n📈 Final Summary:`);
  console.log(`   • Leads created: ${leadsCreated}/50`);
  console.log(`   • Properties created: ${propertiesCreated}/15`);
  console.log(`   • Total items: ${leadsCreated + propertiesCreated}/${50 + 15}`);
}

// Run the script
main().catch(console.error);
