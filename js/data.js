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
        currentLocation: { district: "Ernakulam", lat: 9.9816, lng: 76.2999 },
        history: [
          { date: "2025-08-01", type: "Visit", notes: "Fever, tested for malaria (negative)" },
          { date: "2025-05-12", type: "Vaccination", notes: "Tetanus booster" }
        ],
        records: [
          { date: "2025-08-01", symptoms: "Fever, fatigue", diagnosis: "Viral fever", treatment: "Paracetamol, rest" }
        ],
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
        currentLocation: { district: "Kozhikode", lat: 11.2588, lng: 75.7804 },
        history: [
          { date: "2025-06-20", type: "Visit", notes: "Back pain due to labor" }
        ],
        records: [],
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
        currentLocation: { district: "Thiruvananthapuram", lat: 8.5241, lng: 76.9366 },
        history: [
          { date: "2025-07-15", type: "Vaccination", notes: "Hepatitis B" }
        ],
        records: [],
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
        currentLocation: { district: "Malappuram", lat: 11.0500, lng: 76.0700 },
        history: [],
        records: [
          { date: "2025-04-09", symptoms: "Cough, cold", diagnosis: "Common cold", treatment: "Antihistamines" }
        ],
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
        currentLocation: { district: "Palakkad", lat: 10.7867, lng: 76.6548 },
        history: [
          { date: "2025-01-13", type: "Visit", notes: "Migraine" }
        ],
        records: [],
        registeredAt: "2024-05-12"
      }
    ];

    // Always update with latest mock users (to include new DOB fields)
    localStorage.setItem(this.STORAGE_KEYS.users, JSON.stringify(mockUsers));
    
    // Also store in workers for backward compatibility
    const workersForCompatibility = mockUsers.map(user => ({
      ...user,
      phone: "+91 " + user.phone // Add +91 prefix for compatibility
    }));
    localStorage.setItem(this.STORAGE_KEYS.workers, JSON.stringify(workersForCompatibility));
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

