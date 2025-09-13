// User Management System
const UserManager = {
  STORAGE_KEYS: {
    workers: 'mw_workers',
    outbreaks: 'mw_outbreaks',
    users: 'mw_users',
    currentUser: 'mw_current_user'
  },

  // Initialize mock users with phone numbers for login
  initMockUsers() {
    const mockUsers = [
      {
        healthId: "MW123456",
        name: "Rahul Kumar",
        age: 28,
        gender: "Male",
        bloodGroup: "B+",
        homeState: "Bihar",
        phone: "9000011111", // Store without +91 prefix for easier matching
        dob: "1996-03-15", // Date of birth
        fieldOfWork: "Construction Worker",
        currentLocation: { district: "Ernakulam", lat: 9.9816, lng: 76.2999 },
        status: "Active",
        lastVisit: "2025-01-15",
        history: [
          { date: "2023-07-22", type: "Diagnosis", notes: "Typhoid fever treated successfully with antibiotics." },
          { date: "2024-06-12", type: "Diagnosis", notes: "Lower back pain due to heavy lifting; advised physiotherapy and NSAIDs." },
          { date: "2021-09-05", type: "Diagnosis", notes: "Malaria (P. vivax); completed full antimalarial course." },
          { date: "2020-03-15", type: "Surgery", notes: "Appendectomy - laparoscopic procedure, recovery uneventful." },
          { date: "—", type: "Chronic Conditions", notes: "None" }
        ],
        records: [
          {
            date: "2025-01-15",
            time: "10:30",
            visitType: "Consultation",
            chiefComplaint: "Fever and body ache",
            bp: "118/76",
            temp: "100.4°F",
            hr: "78 bpm",
            weight: "66 kg",
            diagnosis: "Viral fever",
            treatment: "Rest, hydration, antipyretics",
            prescription: "Paracetamol 500mg, 3/day for 5 days"
          },
          {
            date: "2024-12-20",
            time: "14:15",
            visitType: "Follow-up",
            chiefComplaint: "Cough and chest congestion",
            bp: "120/80",
            temp: "98.6°F",
            hr: "72 bpm",
            weight: "65 kg",
            diagnosis: "Upper respiratory tract infection",
            treatment: "Antibiotics, steam inhalation",
            prescription: "Amoxicillin 500mg, 2/day for 7 days"
          },
          {
            date: "2024-11-08",
            time: "09:45",
            visitType: "Emergency",
            chiefComplaint: "Severe headache and nausea",
            bp: "130/85",
            temp: "99.2°F",
            hr: "85 bpm",
            weight: "66 kg",
            diagnosis: "Migraine",
            treatment: "Pain management, rest",
            prescription: "Sumatriptan 50mg as needed"
          }
        ],
        vaccinations: [
          { 
            name: "COVID-19 (Covishield)", 
            doses: 2, 
            lastDate: "2022-05-20",
            dateAdministered: "2022-05-20",
            doseNumber: 2,
            administeredBy: "Dr. Sarah Johnson",
            notes: "Second dose completed, no adverse reactions"
          },
          { 
            name: "Tetanus", 
            doses: 1, 
            lastDate: "2023-03-10",
            dateAdministered: "2023-03-10",
            doseNumber: 1,
            administeredBy: "Dr. Michael Chen",
            notes: "Tetanus booster after construction site injury"
          },
          { 
            name: "Hepatitis B", 
            doses: 3, 
            lastDate: "2021-01-18",
            dateAdministered: "2021-01-18",
            doseNumber: 3,
            administeredBy: "Dr. Priya Sharma",
            notes: "Complete 3-dose series completed"
          },
          { 
            name: "Polio (OPV)", 
            doses: 1, 
            lastDate: "2020-08-15",
            dateAdministered: "2020-08-15",
            doseNumber: 1,
            administeredBy: "Public Health Center",
            notes: "Routine immunization"
          }
        ],
        prescriptions: [
          { drug: "Paracetamol", strength: "500mg", frequency: "3/day", duration: "5 days", reason: "Fever", date: "2025-01-15" },
          { drug: "Amoxicillin", strength: "500mg", frequency: "2/day", duration: "7 days", reason: "Respiratory infection", date: "2024-12-20" },
          { drug: "Sumatriptan", strength: "50mg", frequency: "As needed", duration: "30 days", reason: "Migraine", date: "2024-11-08" },
          { drug: "Ibuprofen", strength: "400mg", frequency: "2/day", duration: "7 days", reason: "Back pain", date: "2024-06-12" },
          { drug: "Ciprofloxacin", strength: "500mg", frequency: "2/day", duration: "10 days", reason: "Typhoid fever", date: "2023-07-22" }
        ],
        allergies: [
          { name: "Penicillin", type: "medication", description: "Reaction: severe rash and difficulty breathing. Note: avoid all penicillin-class drugs." },
          { name: "Peanuts", type: "food", description: "Reaction: facial swelling and hives. Note: carries epipen for emergencies." },
          { name: "Dust mites", type: "environmental", description: "Reaction: sneezing and nasal congestion. Note: mild severity, manageable with antihistamines." }
        ],
        clinicalNotes: "Patient is a migrant construction worker reporting increased fatigue due to long work hours and physical labor. Shows good compliance with medication. No psychological distress noted. BP and HR within normal limits. Advised regular health check-ups and proper nutrition. Follow-up in one month recommended.",
        registeredAt: "2024-01-15"
      },
      {
        healthId: "MW234567",
        name: "Amit Singh",
        age: 34,
        gender: "Male",
        bloodGroup: "A+",
        homeState: "Uttar Pradesh",
        phone: "9000022222",
        dob: "1990-07-22", // Date of birth
        fieldOfWork: "Factory Worker",
        currentLocation: { district: "Kozhikode", lat: 11.2588, lng: 75.7804 },
        status: "Stable",
        lastVisit: "2024-12-10",
        history: [
          { date: "2024-06-20", type: "Diagnosis", notes: "Chronic back pain due to repetitive factory work; referred to physiotherapy." },
          { date: "2023-11-15", type: "Diagnosis", notes: "Gastritis due to irregular eating habits; prescribed antacids and dietary changes." },
          { date: "2022-08-30", type: "Surgery", notes: "Minor hand surgery for work-related injury; full recovery." },
          { date: "2021-04-12", type: "Diagnosis", notes: "Anemia; iron supplements prescribed." },
          { date: "—", type: "Chronic Conditions", notes: "Mild hypertension, managed with lifestyle changes" }
        ],
        records: [
          {
            date: "2024-12-10",
            time: "11:20",
            visitType: "Follow-up",
            chiefComplaint: "Back pain and fatigue",
            bp: "135/88",
            temp: "98.4°F",
            hr: "82 bpm",
            weight: "72 kg",
            diagnosis: "Chronic back pain, mild hypertension",
            treatment: "Physiotherapy, pain management",
            prescription: "Diclofenac gel, physiotherapy sessions"
          },
          {
            date: "2024-09-15",
            time: "15:30",
            visitType: "Consultation",
            chiefComplaint: "Stomach pain and acidity",
            bp: "130/85",
            temp: "98.6°F",
            hr: "78 bpm",
            weight: "71 kg",
            diagnosis: "Gastritis",
            treatment: "Antacids, dietary modifications",
            prescription: "Pantoprazole 40mg, 1/day for 4 weeks"
          },
          {
            date: "2024-06-20",
            time: "09:15",
            visitType: "Emergency",
            chiefComplaint: "Severe back pain after lifting",
            bp: "140/90",
            temp: "98.8°F",
            hr: "88 bpm",
            weight: "72 kg",
            diagnosis: "Acute lumbar strain",
            treatment: "Rest, ice, pain relief",
            prescription: "Ibuprofen 400mg, 3/day for 5 days"
          }
        ],
        vaccinations: [
          { 
            name: "COVID-19 (Covaxin)", 
            doses: 2, 
            lastDate: "2021-12-15",
            dateAdministered: "2021-12-15",
            doseNumber: 2,
            administeredBy: "Dr. Rajesh Kumar",
            notes: "Both doses completed, mild fever after second dose"
          },
          { 
            name: "Tetanus", 
            doses: 1, 
            lastDate: "2022-08-30",
            dateAdministered: "2022-08-30",
            doseNumber: 1,
            administeredBy: "Dr. Anjali Patel",
            notes: "Given after hand injury at workplace"
          },
          { 
            name: "Hepatitis A", 
            doses: 2, 
            lastDate: "2023-05-20",
            dateAdministered: "2023-05-20",
            doseNumber: 2,
            administeredBy: "Dr. Suresh Nair",
            notes: "Complete series for food handlers"
          }
        ],
        prescriptions: [
          { drug: "Diclofenac", strength: "1% gel", frequency: "3/day", duration: "2 weeks", reason: "Back pain", date: "2024-12-10" },
          { drug: "Pantoprazole", strength: "40mg", frequency: "1/day", duration: "4 weeks", reason: "Gastritis", date: "2024-09-15" },
          { drug: "Ibuprofen", strength: "400mg", frequency: "3/day", duration: "5 days", reason: "Acute back strain", date: "2024-06-20" },
          { drug: "Iron supplements", strength: "100mg", frequency: "1/day", duration: "3 months", reason: "Anemia", date: "2021-04-12" }
        ],
        allergies: [
          { name: "Aspirin", type: "medication", description: "Reaction: stomach irritation and nausea. Note: avoid NSAIDs on empty stomach." },
          { name: "Shellfish", type: "food", description: "Reaction: mild skin rash. Note: avoid seafood." }
        ],
        clinicalNotes: "Factory worker with chronic back pain due to repetitive lifting. Shows good adherence to physiotherapy. Blood pressure slightly elevated, monitoring required. Gastritis under control with medication. Overall health stable with regular follow-ups needed.",
        registeredAt: "2024-02-20"
      },
      {
        healthId: "MW345678",
        name: "Suman Das",
        age: 25,
        gender: "Male",
        bloodGroup: "O+",
        homeState: "West Bengal",
        phone: "9000033333",
        dob: "1999-11-08", // Date of birth
        fieldOfWork: "Agricultural Worker",
        currentLocation: { district: "Thiruvananthapuram", lat: 8.5241, lng: 76.9366 },
        status: "Active",
        lastVisit: "2024-11-25",
        history: [
          { date: "2024-11-25", type: "Diagnosis", notes: "Skin infection due to pesticide exposure; treated with antibiotics." },
          { date: "2024-08-10", type: "Diagnosis", notes: "Heat exhaustion during field work; advised hydration and rest." },
          { date: "2023-12-05", type: "Vaccination", notes: "Hepatitis B vaccination completed." },
          { date: "2023-06-18", type: "Diagnosis", notes: "Malaria (P. falciparum); treated successfully." },
          { date: "—", type: "Chronic Conditions", notes: "None" }
        ],
        records: [
          {
            date: "2024-11-25",
            time: "16:45",
            visitType: "Consultation",
            chiefComplaint: "Skin rash and itching",
            bp: "110/70",
            temp: "99.1°F",
            hr: "75 bpm",
            weight: "58 kg",
            diagnosis: "Contact dermatitis from pesticide exposure",
            treatment: "Topical steroids, antihistamines",
            prescription: "Hydrocortisone cream 1%, 2/day for 1 week"
          },
          {
            date: "2024-08-10",
            time: "13:20",
            visitType: "Emergency",
            chiefComplaint: "Dizziness and nausea",
            bp: "95/60",
            temp: "101.2°F",
            hr: "95 bpm",
            weight: "57 kg",
            diagnosis: "Heat exhaustion",
            treatment: "IV fluids, rest, cooling measures",
            prescription: "Oral rehydration salts, rest for 2 days"
          },
          {
            date: "2023-06-18",
            time: "10:30",
            visitType: "Emergency",
            chiefComplaint: "High fever and chills",
            bp: "105/65",
            temp: "103.5°F",
            hr: "110 bpm",
            weight: "59 kg",
            diagnosis: "Malaria (P. falciparum)",
            treatment: "Antimalarial medication, monitoring",
            prescription: "Artemether-Lumefantrine, 4 tablets twice daily for 3 days"
          }
        ],
        vaccinations: [
          { 
            name: "Hepatitis B", 
            doses: 3, 
            lastDate: "2023-12-05",
            dateAdministered: "2023-12-05",
            doseNumber: 3,
            administeredBy: "Dr. Lakshmi Menon",
            notes: "Complete 3-dose series for agricultural workers"
          },
          { 
            name: "Tetanus", 
            doses: 1, 
            lastDate: "2023-01-15",
            dateAdministered: "2023-01-15",
            doseNumber: 1,
            administeredBy: "Public Health Center",
            notes: "Routine immunization"
          },
          { 
            name: "Typhoid", 
            doses: 1, 
            lastDate: "2022-08-20",
            dateAdministered: "2022-08-20",
            doseNumber: 1,
            administeredBy: "Dr. Ravi Pillai",
            notes: "Preventive vaccination for field workers"
          }
        ],
        prescriptions: [
          { drug: "Hydrocortisone", strength: "1% cream", frequency: "2/day", duration: "1 week", reason: "Skin rash", date: "2024-11-25" },
          { drug: "Oral Rehydration Salts", strength: "1 packet", frequency: "3/day", duration: "2 days", reason: "Heat exhaustion", date: "2024-08-10" },
          { drug: "Artemether-Lumefantrine", strength: "80/480mg", frequency: "4 tablets twice daily", duration: "3 days", reason: "Malaria", date: "2023-06-18" },
          { drug: "Chloroquine", strength: "250mg", frequency: "2/day", duration: "3 days", reason: "Malaria prophylaxis", date: "2023-06-18" }
        ],
        allergies: [
          { name: "Sulfa drugs", type: "medication", description: "Reaction: skin rash and fever. Note: avoid sulfonamide antibiotics." },
          { name: "Pesticides", type: "environmental", description: "Reaction: contact dermatitis. Note: use protective clothing during field work." }
        ],
        clinicalNotes: "Young agricultural worker with good overall health. Prone to heat-related illnesses during summer months. Requires education on pesticide safety and protective equipment. No chronic conditions. Regular health monitoring recommended due to occupational hazards.",
        registeredAt: "2024-03-10"
      },
      {
        healthId: "MW456789",
        name: "Bijaya Nayak",
        age: 31,
        gender: "Male",
        bloodGroup: "AB+",
        homeState: "Odisha",
        phone: "9000044444",
        dob: "1993-05-14", // Date of birth
        fieldOfWork: "Domestic Worker",
        currentLocation: { district: "Malappuram", lat: 11.0500, lng: 76.0700 },
        status: "Stable",
        lastVisit: "2024-10-15",
        history: [
          { date: "2024-10-15", type: "Diagnosis", notes: "Respiratory infection; treated with antibiotics and rest." },
          { date: "2024-07-22", type: "Diagnosis", notes: "Minor cuts and bruises from work; cleaned and dressed." },
          { date: "2024-03-18", type: "Vaccination", notes: "Influenza vaccination for seasonal protection." },
          { date: "2023-11-30", type: "Diagnosis", notes: "Common cold and cough; symptomatic treatment." },
          { date: "—", type: "Chronic Conditions", notes: "None" }
        ],
        records: [
          {
            date: "2024-10-15",
            time: "14:30",
            visitType: "Consultation",
            chiefComplaint: "Cough and chest congestion",
            bp: "125/80",
            temp: "99.5°F",
            hr: "80 bpm",
            weight: "68 kg",
            diagnosis: "Upper respiratory tract infection",
            treatment: "Antibiotics, steam inhalation, rest",
            prescription: "Azithromycin 500mg, 1/day for 5 days"
          },
          {
            date: "2024-07-22",
            time: "11:15",
            visitType: "Emergency",
            chiefComplaint: "Minor cuts on hands",
            bp: "120/78",
            temp: "98.6°F",
            hr: "75 bpm",
            weight: "68 kg",
            diagnosis: "Superficial cuts and abrasions",
            treatment: "Wound cleaning, antiseptic, bandaging",
            prescription: "Antiseptic cream, daily dressing for 3 days"
          },
          {
            date: "2023-11-30",
            time: "16:45",
            visitType: "Consultation",
            chiefComplaint: "Cold and cough",
            bp: "118/76",
            temp: "98.8°F",
            hr: "78 bpm",
            weight: "67 kg",
            diagnosis: "Common cold",
            treatment: "Symptomatic treatment, rest",
            prescription: "Cetirizine 10mg, 1/day for 5 days"
          }
        ],
        vaccinations: [
          { 
            name: "Influenza", 
            doses: 1, 
            lastDate: "2024-03-18",
            dateAdministered: "2024-03-18",
            doseNumber: 1,
            administeredBy: "Dr. Nisha Thomas",
            notes: "Seasonal flu vaccination"
          },
          { 
            name: "COVID-19 (Sputnik V)", 
            doses: 2, 
            lastDate: "2021-11-20",
            dateAdministered: "2021-11-20",
            doseNumber: 2,
            administeredBy: "Dr. Arun Kumar",
            notes: "Both doses completed, no side effects"
          },
          { 
            name: "Tetanus", 
            doses: 1, 
            lastDate: "2020-06-10",
            dateAdministered: "2020-06-10",
            doseNumber: 1,
            administeredBy: "Public Health Center",
            notes: "Routine immunization"
          }
        ],
        prescriptions: [
          { drug: "Azithromycin", strength: "500mg", frequency: "1/day", duration: "5 days", reason: "Respiratory infection", date: "2024-10-15" },
          { drug: "Antiseptic cream", strength: "1%", frequency: "2/day", duration: "3 days", reason: "Wound care", date: "2024-07-22" },
          { drug: "Cetirizine", strength: "10mg", frequency: "1/day", duration: "5 days", reason: "Cold symptoms", date: "2023-11-30" },
          { drug: "Paracetamol", strength: "500mg", frequency: "3/day", duration: "3 days", reason: "Fever and pain", date: "2023-11-30" }
        ],
        allergies: [
          { name: "Latex", type: "environmental", description: "Reaction: skin irritation and redness. Note: avoid latex gloves and products." }
        ],
        clinicalNotes: "Domestic worker with generally good health. Occasional minor injuries from work. Good compliance with treatment. No chronic conditions. Regular health check-ups recommended. Shows good hygiene practices.",
        registeredAt: "2024-04-05"
      },
      {
        healthId: "MW567890",
        name: "Meera Pal",
        age: 29,
        gender: "Female",
        bloodGroup: "A-",
        homeState: "West Bengal",
        phone: "9000055555",
        dob: "1995-09-30", // Date of birth
        fieldOfWork: "Textile Worker",
        currentLocation: { district: "Palakkad", lat: 10.7867, lng: 76.6548 },
        status: "Active",
        lastVisit: "2024-12-05",
        history: [
          { date: "2024-12-05", type: "Diagnosis", notes: "Migraine with aura; prescribed preventive medication." },
          { date: "2024-09-20", type: "Diagnosis", notes: "Eye strain and headaches from prolonged screen work; advised breaks and eye exercises." },
          { date: "2024-06-15", type: "Vaccination", notes: "MMR vaccination for measles protection." },
          { date: "2023-12-10", type: "Diagnosis", notes: "Anemia; iron supplements and dietary counseling provided." },
          { date: "—", type: "Chronic Conditions", notes: "Recurrent migraines, managed with medication" }
        ],
        records: [
          {
            date: "2024-12-05",
            time: "10:15",
            visitType: "Consultation",
            chiefComplaint: "Severe headache with visual disturbances",
            bp: "110/70",
            temp: "98.4°F",
            hr: "72 bpm",
            weight: "55 kg",
            diagnosis: "Migraine with aura",
            treatment: "Pain management, preventive medication",
            prescription: "Sumatriptan 50mg as needed, Propranolol 40mg daily"
          },
          {
            date: "2024-09-20",
            time: "15:30",
            visitType: "Consultation",
            chiefComplaint: "Eye strain and frequent headaches",
            bp: "108/68",
            temp: "98.6°F",
            hr: "70 bpm",
            weight: "55 kg",
            diagnosis: "Computer vision syndrome",
            treatment: "Eye exercises, work breaks, ergonomic adjustments",
            prescription: "Artificial tears, 20-20-20 rule for eye breaks"
          },
          {
            date: "2023-12-10",
            time: "11:45",
            visitType: "Follow-up",
            chiefComplaint: "Fatigue and weakness",
            bp: "105/65",
            temp: "98.2°F",
            hr: "85 bpm",
            weight: "54 kg",
            diagnosis: "Iron deficiency anemia",
            treatment: "Iron supplementation, dietary modifications",
            prescription: "Ferrous sulfate 325mg, 1/day for 3 months"
          }
        ],
        vaccinations: [
          { 
            name: "MMR", 
            doses: 1, 
            lastDate: "2024-06-15",
            dateAdministered: "2024-06-15",
            doseNumber: 1,
            administeredBy: "Dr. Kavitha Rajan",
            notes: "Measles, Mumps, Rubella vaccination"
          },
          { 
            name: "COVID-19 (Covishield)", 
            doses: 2, 
            lastDate: "2021-10-25",
            dateAdministered: "2021-10-25",
            doseNumber: 2,
            administeredBy: "Dr. Sunil Menon",
            notes: "Both doses completed, no adverse reactions"
          },
          { 
            name: "Hepatitis B", 
            doses: 3, 
            lastDate: "2020-12-05",
            dateAdministered: "2020-12-05",
            doseNumber: 3,
            administeredBy: "Dr. Priya Nair",
            notes: "Complete 3-dose series"
          }
        ],
        prescriptions: [
          { drug: "Sumatriptan", strength: "50mg", frequency: "As needed", duration: "30 days", reason: "Migraine", date: "2024-12-05" },
          { drug: "Propranolol", strength: "40mg", frequency: "1/day", duration: "3 months", reason: "Migraine prevention", date: "2024-12-05" },
          { drug: "Artificial tears", strength: "0.5%", frequency: "4/day", duration: "1 month", reason: "Dry eyes", date: "2024-09-20" },
          { drug: "Ferrous sulfate", strength: "325mg", frequency: "1/day", duration: "3 months", reason: "Anemia", date: "2023-12-10" }
        ],
        allergies: [
          { name: "Codeine", type: "medication", description: "Reaction: severe nausea and vomiting. Note: avoid opioid pain medications." },
          { name: "Dust", type: "environmental", description: "Reaction: sneezing and nasal congestion. Note: mild severity, manageable with antihistamines." }
        ],
        clinicalNotes: "Female textile worker with recurrent migraines, likely related to work stress and eye strain. Shows good compliance with medication. Anemia resolved with iron supplementation. Requires regular monitoring for migraine frequency and severity. Advised stress management techniques.",
        registeredAt: "2024-05-12"
      }
    ];

    // Always update with latest mock users (to include new fields)
    localStorage.setItem(this.STORAGE_KEYS.users, JSON.stringify(mockUsers));
    
    // Also store in workers for backward compatibility
    const workersForCompatibility = mockUsers.map(user => ({
      ...user,
      phone: "+91 " + user.phone // Add +91 prefix for compatibility
    }));
    localStorage.setItem(this.STORAGE_KEYS.workers, JSON.stringify(workersForCompatibility));
    
    // Update existing users to include field of work if missing
    this.updateExistingUsersWithFieldOfWork();
  },

  // Update existing users to include field of work if missing
  updateExistingUsersWithFieldOfWork() {
    const users = this.getAllUsers();
    let updated = false;
    
    const fieldOfWorkMap = {
      "MW123456": "Construction Worker",
      "MW234567": "Factory Worker", 
      "MW345678": "Agricultural Worker",
      "MW456789": "Domestic Worker",
      "MW567890": "Textile Worker"
    };
    
    users.forEach(user => {
      if (!user.fieldOfWork && fieldOfWorkMap[user.healthId]) {
        user.fieldOfWork = fieldOfWorkMap[user.healthId];
        updated = true;
      }
    });
    
    if (updated) {
      localStorage.setItem(this.STORAGE_KEYS.users, JSON.stringify(users));
      // Also update workers for compatibility
      const workersForCompatibility = users.map(user => ({
        ...user,
        phone: "+91 " + user.phone
      }));
      localStorage.setItem(this.STORAGE_KEYS.workers, JSON.stringify(workersForCompatibility));
    }
  },

  // Find user by phone number
  findUserByPhone(phone) {
    const users = this.getAllUsers();
    const cleanPhone = phone.replace(/\D/g, ''); // Remove all non-digits
    return users.find(user => user.phone === cleanPhone);
  },

  // Get all users
  getAllUsers() {
    const users = localStorage.getItem(this.STORAGE_KEYS.users);
    return users ? JSON.parse(users) : [];
  },

  // Save all users
  saveAllUsers(users) {
    localStorage.setItem(this.STORAGE_KEYS.users, JSON.stringify(users));
    
    // Also update workers for backward compatibility
    const workersForCompatibility = users.map(user => ({
      ...user,
      phone: "+91 " + user.phone
    }));
    localStorage.setItem(this.STORAGE_KEYS.workers, JSON.stringify(workersForCompatibility));
  },

  // Add new user
  addUser(userData) {
    const users = this.getAllUsers();
    users.push(userData);
    this.saveAllUsers(users);
    return userData;
  },

  // Update user
  updateUser(healthId, updatedData) {
    const users = this.getAllUsers();
    const index = users.findIndex(user => user.healthId === healthId);
    if (index !== -1) {
      users[index] = { ...users[index], ...updatedData };
      this.saveAllUsers(users);
      return users[index];
    }
    return null;
  },

  // Set current logged in user
  setCurrentUser(user) {
    localStorage.setItem(this.STORAGE_KEYS.currentUser, JSON.stringify(user));
  },

  // Get current logged in user
  getCurrentUser() {
    const user = localStorage.getItem(this.STORAGE_KEYS.currentUser);
    return user ? JSON.parse(user) : null;
  },

  // Update current user data
  updateCurrentUser(userData) {
    localStorage.setItem(this.STORAGE_KEYS.currentUser, JSON.stringify(userData));
  },

  // Clear current user (logout)
  clearCurrentUser() {
    localStorage.removeItem(this.STORAGE_KEYS.currentUser);
  },

  // Check if user is logged in
  isLoggedIn() {
    return this.getCurrentUser() !== null;
  }
};

// Helper to resolve asset path irrespective of nested pages
(function ensureDataAvailability () {
	try {
		const pathDepth = (window.location.pathname.match(/\//g) || []).length;
		// crude heuristic: try both relative paths
		const tryPaths = [
			'../assets/data/sample-data.json',
			'../../assets/data/sample-data.json',
			'./assets/data/sample-data.json'
		];
		let loaded = false;
		for (const p of tryPaths) {
			if (loaded) break;
			fetch(p).then(r => {
				if (r.ok) return r.json();
				throw new Error('not ok');
			}).then(data => {
				if (!localStorage.getItem('mw_outbreaks')) {
					localStorage.setItem('mw_outbreaks', JSON.stringify(data.outbreaks));
				}
				loaded = true;
			}).catch(() => {});
		}
		
		// Initialize mock users
		UserManager.initMockUsers();
	} catch (e) {}
})();

