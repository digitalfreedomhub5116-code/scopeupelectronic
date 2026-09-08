// Realistic electronics customer & buyer feedback
// STRICT RULES: NO hyphens (-), NO commas (,), NO periods (.)
export const REVIEWS_POOL = {
  // Common positive electronics reviews
  positive: [
    { name: "Aarav Sharma", text: "build quality is insane sound separation and bass is pure studio grade" },
    { name: "Rohan Nair", text: "battery backup easily lasted 4 days on single charge super impressed" },
    { name: "Kunal Verma", text: "received in 2 days export packaging was rock solid zero transit damage" },
    { name: "Aditya Patel", text: "bluetooth 5.4 connection is instant no lag whatsoever while gaming" },
    { name: "Siddharth Rao", text: "looks and feels like high end premium tech worth every single rupee" },
    { name: "Varun Malhotra", text: "active noise cancellation cut down all traffic and office chatter easily" },
    { name: "Pranav Iyer", text: "ordered bulk sample lot for our store all units passed QC with full marks" },
    { name: "Ankit Deshmukh", text: "fast charging speed is unbelievable 100 percent in under 35 mins" },
    { name: "Devendra Joshi", text: "ce rohs certificates provided promptly genuine export quality hardware" },
    { name: "Harshit Sen", text: "crystal clear mic quality during zoom meetings clients heard me clearly" },
    { name: "Nikhil Kulkarni", text: "finish and aluminum enclosure feels ultra premium top tier engineering" },
    { name: "Gautam Mehta", text: "best audio gear in this price segment hands down very satisfied" },
    { name: "Suraj Yadav", text: "compact yet packs huge power capacity works seamlessly with macbook" },
    { name: "Manish Reddy", text: "rgb lighting and mechanical switches are butter smooth for typing" },
    { name: "Vivek Choudhary", text: "proper industrial grade build loving the reliability and battery life" },
  ],

  // Specific positive reviews per category
  genreSpecific: {
    AUDIO: [
      { name: "Kabir Roy", text: "anc is seriously studio grade 40mm drivers deliver deep punchy bass" },
      { name: "Tushar Bansal", text: "latency in gaming mode is negligible zero audio delay noticed" },
      { name: "Aakash Pandey", text: "ear cushion comfort is sublime wore it 8 hours straight without fatigue" },
      { name: "Rahul Saxena", text: "hi res certified sound profile makes lossless flac tracks shine" },
    ],
    WEARABLES: [
      { name: "Yashwant Singhania", text: "amoled display is super bright outdoors touch response is fluid" },
      { name: "Karan Johar", text: "heart rate and spo2 tracking matches my clinical oximeter readings" },
      { name: "Rishi Kapoor", text: "titanium bezel looks ultra luxury on the wrist battery lasts 10 days" },
    ],
    POWER: [
      { name: "Armaan Malik", text: "gan fast charger charges my macbook pro and iphone simultaneously with ease" },
      { name: "Dhruv Mittal", text: "zero thermal throttling runs surprisingly cool even on full 140w load" },
      { name: "Sanjay Singhal", text: "digital percentage display is super handy heavy duty compact power bank" },
      { name: "Sameer Merchant", text: "magnetic alignment is strong snaps on instantly and charges super fast" },
    ],
    PERIPHERALS: [
      { name: "Reyansh Bhatt", text: "linear yellow switches feel creamy out of the box pbt keycaps are great" },
      { name: "Ayush Khurana", text: "mouse sensor tracking at 26k dpi is razor sharp for competitive fps" },
      { name: "Shubham Gill", text: "4k webcam clarity is crystal clear in low light auto focus is rapid" },
      { name: "Tanmay Bhatia", text: "thunderbolt dock handles dual 4k displays and 100w charging effortlessly" },
    ],
    SMARTHOME: [
      { name: "Chirag Agrawal", text: "solar panel keeps the outdoor camera at 100 percent battery all week" },
      { name: "Mohit Chauhan", text: "color night vision is crisp detected motion accurately from 30 feet" },
      { name: "Abhishek Nambiar", text: "smart light bar syncs seamlessly with tv audio vibrant immersive glow" },
      { name: "Ritvik Sen", text: "e ink sensor display is readable from any angle zigbee pairing was instant" },
    ],
  },

  // Critical reviews
  critical: [
    { name: "Deepak Mehra", rating: 3, text: "delivery took 4 days courier delay otherwise product works great" },
    { name: "Saurabh Tiwari", rating: 3, text: "usbc cable provided in box is 1 meter wish it was 1.5 meter" },
    { name: "Mayank Mishra", rating: 3, text: "app took two attempts to pair initially but working smoothly now" },
    { name: "Chetan Bhagat", rating: 3, text: "outer packaging box had slight crease product inside was intact" },
  ],
}
