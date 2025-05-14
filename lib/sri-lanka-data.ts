/**
 * Sri Lanka Districts
 */
export const sriLankaDistricts = [
  { name: "Colombo", latitude: 6.9271, longitude: 79.8612 },
  { name: "Gampaha", latitude: 7.0917, longitude: 80.0 },
  { name: "Kalutara", latitude: 6.5854, longitude: 79.9607 },
  { name: "Kandy", latitude: 7.2906, longitude: 80.6337 },
  { name: "Matale", latitude: 7.4675, longitude: 80.6234 },
  { name: "Nuwara Eliya", latitude: 6.9497, longitude: 80.7891 },
  { name: "Galle", latitude: 6.0535, longitude: 80.221 },
  { name: "Matara", latitude: 5.9485, longitude: 80.5353 },
  { name: "Hambantota", latitude: 6.1429, longitude: 81.1212 },
  { name: "Jaffna", latitude: 9.6615, longitude: 80.0255 },
  { name: "Kilinochchi", latitude: 9.3803, longitude: 80.377 },
  { name: "Mannar", latitude: 8.9833, longitude: 79.9 },
  { name: "Vavuniya", latitude: 8.7514, longitude: 80.4997 },
  { name: "Mullaitivu", latitude: 9.2667, longitude: 80.8167 },
  { name: "Batticaloa", latitude: 7.717, longitude: 81.7 },
  { name: "Ampara", latitude: 7.2991, longitude: 81.6759 },
  { name: "Trincomalee", latitude: 8.5667, longitude: 81.2333 },
  { name: "Kurunegala", latitude: 7.4867, longitude: 80.3647 },
  { name: "Puttalam", latitude: 8.0408, longitude: 79.8394 },
  { name: "Anuradhapura", latitude: 8.3119, longitude: 80.4037 },
  { name: "Polonnaruwa", latitude: 7.9403, longitude: 81.0188 },
  { name: "Badulla", latitude: 6.9934, longitude: 81.055 },
  { name: "Monaragala", latitude: 6.8714, longitude: 81.3487 },
  { name: "Ratnapura", latitude: 6.7056, longitude: 80.3847 },
  { name: "Kegalle", latitude: 7.2513, longitude: 80.3464 },
]

/**
 * Common pet breeds in Sri Lanka
 */
export const sriLankaPetBreeds = {
  dog: [
    "Lankan Hound",
    "Sinhala Hound",
    "Labrador Retriever",
    "German Shepherd",
    "Rottweiler",
    "Doberman",
    "Boxer",
    "Golden Retriever",
    "Dachshund",
    "Pomeranian",
    "Local Mix",
  ],
  cat: ["Lankan Cat", "Persian", "Siamese", "Maine Coon", "Ragdoll", "British Shorthair", "Local Mix"],
  bird: ["Budgerigar", "Cockatiel", "Lovebird", "Finch", "Canary", "Parrot", "Mynah"],
  rabbit: ["New Zealand White", "Dutch", "Angora", "Flemish Giant", "Local Mix"],
  other: ["Guinea Pig", "Hamster", "Turtle", "Fish", "Squirrel"],
}

/**
 * Common pet shelters and veterinary clinics in Sri Lanka
 */
export const sriLankaPetShelters = [
  {
    name: "Embark",
    address: "Colombo, Sri Lanka",
    website: "https://embark.lk",
    phone: "+94 11 2 596 695",
  },
  {
    name: "Animal SOS Sri Lanka",
    address: "Midigama, Southern Province, Sri Lanka",
    website: "https://animalsos-sl.com",
    phone: "+94 77 227 1880",
  },
  {
    name: "Dogstar Foundation",
    address: "Negombo, Sri Lanka",
    website: "https://www.dogstarfoundation.com",
    phone: "+94 77 739 7697",
  },
  {
    name: "Pet Vet Clinic",
    address: "Colombo 5, Sri Lanka",
    website: "https://petvetclinic.lk",
    phone: "+94 11 2 591 693",
  },
  {
    name: "Best Care Animal Hospital",
    address: "Colombo 5, Sri Lanka",
    website: "https://bestcarepets.com",
    phone: "+94 11 2 599 599",
  },
]

/**
 * Emergency contact information for pet-related issues in Sri Lanka
 */
export const sriLankaEmergencyContacts = [
  {
    name: "Pet Vet Emergency Service",
    phone: "+94 11 2 591 693",
    available: "24/7",
  },
  {
    name: "Animal Welfare and Protection Association",
    phone: "+94 77 355 8222",
    available: "9 AM - 5 PM",
  },
  {
    name: "Blue Paw Trust",
    phone: "+94 77 227 5550",
    available: "9 AM - 5 PM",
  },
]

/**
 * Get a list of common locations in Sri Lanka for address suggestions
 */
export function getSriLankaLocationSuggestions(query: string): { name: string; latitude: number; longitude: number }[] {
  if (!query || query.length < 2) return []

  const normalizedQuery = query.toLowerCase()

  return sriLankaDistricts
    .filter((district) => district.name.toLowerCase().includes(normalizedQuery))
    .map((district) => ({
      name: district.name,
      latitude: district.latitude,
      longitude: district.longitude,
    }))
}
