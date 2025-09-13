# Arogya Rekha - Digital Health Record for Migrant Workers

A comprehensive digital health record management system designed specifically for migrant workers in Kerala, India. This prototype demonstrates a complete healthcare ecosystem with web-based interfaces for different user roles.

## 🏥 Project Overview

**Arogya Rekha** (meaning "Health Line" in Sanskrit) is a digital health record system that addresses the healthcare challenges faced by migrant workers by providing:

- **Portable Health Records**: QR-based health IDs that workers can carry
- **Provider Access**: Healthcare professionals can quickly access patient data
- **Public Health Monitoring**: Real-time disease outbreak tracking and analytics
- **Multi-language Support**: Interface available in 6 Indian languages

## 🎯 Key Features

### Multi-language Support
- **Languages**: English, Malayalam, Hindi, Bengali, Odia, Tamil
- **Implementation**: Dynamic language switching with localStorage persistence
- **User Experience**: Native language support for better accessibility

### QR Code Integration
- **Health ID QR Codes**: Quick patient lookup for healthcare providers
- **Scanner Simulation**: Provider portal includes QR scanning functionality
- **Portable Records**: Workers carry digital health records on their phones

### Real-time Dashboard
- **Disease Tracking**: Live outbreak monitoring with interactive maps
- **Analytics**: Trend analysis using Chart.js
- **Updates**: Simulated real-time data updates every 5 seconds

## 🏗️ System Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Worker Web    │    │  Provider Web   │    │   Admin Web     │
│     App         │    │     Portal      │    │   Dashboard     │
└─────────┬───────┘    └─────────┬───────┘    └─────────┬───────┘
          │                      │                      │
          └──────────────────────┼──────────────────────┘
                                 │
                    ┌─────────────▼─────────────┐
                    │    Client-side Storage    │
                    │    (localStorage + JSON)  │
                    └───────────────────────────┘
```

## 📱 User Interfaces

### 1. Worker Interface
- **Target Users**: Migrant Workers
- **Features**:
  - Language selection (6 languages)
  - Worker registration with health ID generation
  - Digital health ID card with QR code
  - Personal information management

### 2. Provider Portal
- **Target Users**: Healthcare Providers (Doctors, Nurses, Health Workers)
- **Features**:
  - Provider authentication and role management
  - Patient search and QR code scanning
  - Medical record management
  - Prescription and allergy tracking
  - Appointment scheduling

### 3. Admin Dashboard
- **Target Users**: Health Officials and Administrators
- **Features**:
  - Real-time disease outbreak monitoring
  - Interactive Kerala map with hotspots
  - Analytics and trend analysis
  - District-wise health statistics

## 🛠️ Tech Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript (ES6+)
- **UI Framework**: Bootstrap 5
- **Maps**: Leaflet.js
- **Charts**: Chart.js
- **QR Codes**: QRCode.js
- **Data Storage**: localStorage (client-side)
- **Icons**: Bootstrap Icons, Font Awesome

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Local web server (optional, for CORS-free operation)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Arogya-Rekha
   ```

2. **Serve the application**
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js
   npx serve .
   
   # Using PHP
   php -S localhost:8000
   ```

3. **Open in browser**
   ```
   http://localhost:8000
   ```

## 🌐 Demo Flow

### 1. Worker Registration
1. Open the application in a web browser
2. Click "Worker" to access the worker interface
3. Select preferred language
4. Complete registration form with personal details
5. Generate health ID
6. View digital health ID card with QR code

### 2. Provider Access
1. Click "Healthcare Provider" to access the provider portal
2. Login with demo credentials (any email/password works)
3. Select role (Doctor, Nurse, Health Worker)
4. Search for patients or scan QR codes
5. View and manage medical records
6. Add new medical records and prescriptions

### 3. Health Monitoring
1. Click "Health Officials" to access the admin dashboard
2. View interactive Kerala map with disease hotspots
3. Filter outbreaks by disease type
4. Analyze trends and statistics
5. Monitor district-wise health data

## 📊 Sample Data

The application comes pre-loaded with sample data:

### Workers
- **MW123456**: Rahul Kumar (Bihar)
- **MW123457**: Priya Sharma (Uttar Pradesh)
- **MW123458**: Amit Das (West Bengal)

### Outbreaks
- Disease data for all 14 districts of Kerala
- Real-time simulation with periodic updates
- Multiple disease types: Dengue, Malaria, TB, COVID-19

## 🔧 File Structure

```
Arogya-Rekha/
├── index.html                 # Main entry point
├── css/                      # Stylesheets
│   ├── main.css             # Core styling
│   ├── mobile.css           # Mobile responsiveness
│   └── dashboard.css        # Admin dashboard styles
├── js/                      # JavaScript modules
│   ├── main.js             # Core application logic
│   ├── data.js             # Data initialization
│   ├── map.js              # Dashboard map functionality
│   ├── provider.js         # Provider portal logic
│   └── qr-generator.js     # QR code utilities
├── pages/                   # User interface pages
│   ├── worker/             # Worker interface
│   ├── provider/           # Provider portal
│   └── admin/              # Admin dashboard
├── assets/                  # Static assets
│   └── data/               # Sample data
└── README.md               # This file
```

## 🎨 Design Features

### Responsive Design
- **Mobile-first approach** with Bootstrap 5
- **Progressive enhancement** for different screen sizes
- **Touch-friendly interface** for mobile devices

### Accessibility
- **Multi-language support** for diverse user base
- **High contrast colors** for better visibility
- **Keyboard navigation** support
- **Screen reader friendly** markup

### User Experience
- **Intuitive navigation** with clear user flows
- **Visual feedback** with animations and transitions
- **Error handling** with user-friendly messages
- **Loading states** for better perceived performance

## 🔒 Security Considerations

- **Client-side validation** for form inputs
- **Data sanitization** to prevent XSS attacks
- **Secure data storage** using localStorage
- **Role-based access** control in provider portal

## 📱 Mobile Compatibility

- **Progressive Web App** features
- **Offline functionality** for basic operations
- **Touch gestures** support
- **Responsive images** and media

## 🚀 Performance Optimizations

- **Lazy loading** for images and maps
- **Efficient DOM manipulation** with vanilla JavaScript
- **Minimal dependencies** for faster loading
- **Optimized assets** and code splitting

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test across different browsers
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the browser console for errors
- Ensure you're using a modern web browser

## 🔄 Version History

- **v1.0.0** - Initial prototype with basic functionality
- **v1.1.0** - Added multi-language support
- **v1.2.0** - Enhanced mobile responsiveness
- **v1.3.0** - Improved dashboard and analytics

## 📞 Contact

- **Project Lead**: [Your Name]
- **Email**: [your.email@example.com]
- **GitHub**: [github.com/yourusername/arogya-rekha]

---

**Developed for Smart India Hackathon 2024**  
*Empowering migrant workers with digital healthcare access*