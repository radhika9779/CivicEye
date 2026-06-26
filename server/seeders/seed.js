require('dotenv').config();
const bcrypt = require('bcryptjs');
const { sequelize, User, Ward, Issue, SafetyReport, SafeLocation } = require('../models');
const { calculateSeverity } = require('../services/severity.service');

async function seed() {
  try {
    console.log(' Starting CivicEye seed...');

    // Wipe and recreate all tables for a clean demo state
    await sequelize.sync({ force: true });
    console.log('Tables recreated.');

    // ---------------- WARDS ----------------
    const [andheri, bandra, dadar] = await Ward.bulkCreate([
      {
        name: 'Andheri West',
        city: 'Mumbai',
        lat_min: 19.12,
        lat_max: 19.15,
        lon_min: 72.82,
        lon_max: 72.85,
        officer_name: 'Rajesh Sharma',
        officer_email: 'rajesh@mcgm.gov.in',
      },
      {
        name: 'Bandra West',
        city: 'Mumbai',
        lat_min: 19.04,
        lat_max: 19.07,
        lon_min: 72.81,
        lon_max: 72.84,
        officer_name: 'Priya Patel',
        officer_email: 'priya@mcgm.gov.in',
      },
      {
        name: 'Dadar',
        city: 'Mumbai',
        lat_min: 19.01,
        lat_max: 19.04,
        lon_min: 72.83,
        lon_max: 72.86,
        officer_name: 'Anil Desai',
        officer_email: 'anil@mcgm.gov.in',
      },
    ]);
    console.log(' 3 wards created.');

    // ---------------- USERS ----------------
    const hash = (pwd) => bcrypt.hashSync(pwd, 10);

    const [admin, officer, citizen1, citizen2] = await User.bulkCreate([
      {
        name: 'CivicEye Admin',
        email: 'admin@civiceye.in',
        phone: '9876500001',
        password_hash: hash('Admin@123'),
        role: 'admin',
      },
      {
        name: 'Rajesh Sharma',
        email: 'officer@civiceye.in',
        phone: '9876500002',
        password_hash: hash('Officer@123'),
        role: 'ward_officer',
      },
      {
        name: 'Aisha Khan',
        email: 'citizen1@test.in',
        phone: '9876500003',
        password_hash: hash('Test@123'),
        role: 'citizen',
        emergency_contacts: [{ name: 'Sister - Zara Khan', phone: '9876511111' }],
      },
      {
        name: 'Rohan Mehta',
        email: 'citizen2@test.in',
        phone: '9876500004',
        password_hash: hash('Test@123'),
        role: 'citizen',
      },
    ]);
    console.log(' 4 users created.');

    // ---------------- ISSUES ----------------
    const rawIssues = [
      // Andheri West (ward A) — 6 issues
      {
        title: 'Large pothole near Andheri station gate 2',
        description:
          'Deep pothole causing accidents for two-wheelers near gate 2, dangerous for commuters at night.',
        category: 'pothole',
        latitude: 19.133,
        longitude: 72.835,
        address: 'Andheri Station Gate 2, Andheri West, Mumbai',
        ward: andheri,
        status: 'open',
        upvote_count: 5,
        reporter: citizen1,
      },
      {
        title: 'Streetlight not working on SV Road',
        description: 'Streetlight has been broken for two weeks, area is dark at night.',
        category: 'streetlight',
        latitude: 19.14,
        longitude: 72.83,
        address: 'SV Road, Andheri West, Mumbai',
        ward: andheri,
        status: 'open',
        upvote_count: 2,
        reporter: citizen2,
      },
      {
        title: 'Garbage pileup outside Andheri market',
        description: 'Garbage has not been collected for 5 days, foul smell in the area.',
        category: 'garbage',
        latitude: 19.125,
        longitude: 72.845,
        address: 'Andheri Market, Andheri West, Mumbai',
        ward: andheri,
        status: 'assigned',
        upvote_count: 3,
        reporter: citizen1,
        assignee: officer,
      },
      {
        title: 'Water leak flooding Andheri subway',
        description: 'Major water pipe burst, flooding the subway, urgent repair needed.',
        category: 'water_leak',
        latitude: 19.145,
        longitude: 72.828,
        address: 'Andheri Subway, Andheri West, Mumbai',
        ward: andheri,
        status: 'in_progress',
        upvote_count: 8,
        reporter: citizen2,
        assignee: officer,
      },
      {
        title: 'Sewage overflow near residential complex',
        description:
          'Sewage overflowing onto the street, blocked drainage causing health hazard for children.',
        category: 'sewage',
        latitude: 19.122,
        longitude: 72.838,
        address: 'Lokhandwala Complex, Andheri West, Mumbai',
        ward: andheri,
        status: 'resolved',
        upvote_count: 6,
        reporter: citizen1,
        assignee: officer,
        resolution_note: 'Drainage cleared and disinfected by MCGM sanitation team.',
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
        resolved_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
      },
      {
        title: 'Broken footpath tiles near school',
        description:
          'Several tiles broken on the footpath, risk of injury especially for children walking to school.',
        category: 'other',
        latitude: 19.135,
        longitude: 72.842,
        address: 'Near St. Anne School, Andheri West, Mumbai',
        ward: andheri,
        status: 'open',
        upvote_count: 1,
        reporter: citizen2,
      },

      // Bandra West (ward B) — 5 issues
      {
        title: 'Pothole near Bandra Linking Road',
        description: 'Small pothole forming after recent rains.',
        category: 'pothole',
        latitude: 19.055,
        longitude: 72.825,
        address: 'Linking Road, Bandra West, Mumbai',
        ward: bandra,
        status: 'open',
        upvote_count: 0,
        reporter: citizen1,
      },
      {
        title: 'Streetlight outage near Bandra Fort',
        description: 'Entire stretch is dark at night, safety concern for pedestrians.',
        category: 'streetlight',
        latitude: 19.048,
        longitude: 72.835,
        address: 'Bandra Fort Road, Bandra West, Mumbai',
        ward: bandra,
        status: 'assigned',
        upvote_count: 4,
        reporter: citizen2,
        assignee: officer,
      },
      {
        title: 'Garbage dumping near Bandra station',
        description: 'Illegal garbage dumping causing bad smell and attracting strays.',
        category: 'garbage',
        latitude: 19.062,
        longitude: 72.815,
        address: 'Bandra Station Road, Bandra West, Mumbai',
        ward: bandra,
        status: 'open',
        upvote_count: 2,
        reporter: citizen1,
      },
      {
        title: 'Water leak on Hill Road',
        description: 'Continuous water leak from underground pipe, wasting water.',
        category: 'water_leak',
        latitude: 19.058,
        longitude: 72.82,
        address: 'Hill Road, Bandra West, Mumbai',
        ward: bandra,
        status: 'in_progress',
        upvote_count: 3,
        reporter: citizen2,
        assignee: officer,
      },
      {
        title: 'Sewage smell near Bandra Bazaar Road',
        description: 'Strong sewage smell, overflow during high tide.',
        category: 'sewage',
        latitude: 19.066,
        longitude: 72.838,
        address: 'Bazaar Road, Bandra West, Mumbai',
        ward: bandra,
        status: 'open',
        upvote_count: 5,
        reporter: citizen1,
      },

      // Dadar (ward C) — 4 issues
      {
        title: 'Pothole causing accidents on Dadar TT',
        description: 'Large pothole that caused a minor accident, urgent repair done.',
        category: 'pothole',
        latitude: 19.018,
        longitude: 72.845,
        address: 'Dadar TT Circle, Dadar, Mumbai',
        ward: dadar,
        status: 'resolved',
        upvote_count: 7,
        reporter: citizen2,
        assignee: officer,
        resolution_note: 'Pothole filled and road resurfaced.',
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 9),
        resolved_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
      },
      {
        title: 'Streetlight flickering near Dadar station',
        description: 'Streetlight flickering, area gets dark intermittently.',
        category: 'streetlight',
        latitude: 19.025,
        longitude: 72.85,
        address: 'Dadar Station Road, Dadar, Mumbai',
        ward: dadar,
        status: 'assigned',
        upvote_count: 1,
        reporter: citizen1,
        assignee: officer,
      },
      {
        title: 'Garbage overflow near Shivaji Park',
        description: 'Garbage bins overflowing, urgent collection needed.',
        category: 'garbage',
        latitude: 19.03,
        longitude: 72.838,
        address: 'Shivaji Park, Dadar, Mumbai',
        ward: dadar,
        status: 'in_progress',
        upvote_count: 4,
        reporter: citizen2,
        assignee: officer,
      },
      {
        title: 'Water leak damaging road near Dadar market',
        description: 'Water leak has damaged the road surface, blocked one lane of traffic.',
        category: 'other',
        latitude: 19.035,
        longitude: 72.855,
        address: 'Dadar Market, Dadar, Mumbai',
        ward: dadar,
        status: 'assigned',
        upvote_count: 2,
        reporter: citizen1,
        assignee: officer,
      },
    ];

    for (const raw of rawIssues) {
      const { score, severity, reasons } = calculateSeverity({
        category: raw.category,
        title: raw.title,
        description: raw.description,
        upvote_count: raw.upvote_count,
      });

      await Issue.create({
        title: raw.title,
        description: raw.description,
        category: raw.category,
        latitude: raw.latitude,
        longitude: raw.longitude,
        address: raw.address,
        ward_id: raw.ward.id,
        status: raw.status,
        upvote_count: raw.upvote_count,
        reporter_id: raw.reporter.id,
        assigned_to: raw.assignee ? raw.assignee.id : null,
        resolution_note: raw.resolution_note || null,
        created_at: raw.created_at || new Date(),
        resolved_at: raw.resolved_at || null,
        ai_score: score,
        severity,
        ai_reasons: reasons,
      });
    }
    console.log(`✅ ${rawIssues.length} issues created (severity auto-scored).`);

    // ---------------- SAFETY REPORTS ----------------
    // Two clusters so the heatmap shows two clear blobs
    await SafetyReport.bulkCreate([
      // Zone 1 — near Andheri station
      {
        report_type: 'harassment',
        description: 'Group of men passing lewd comments near the station exit, repeated incidents reported.',
        latitude: 19.1192,
        longitude: 72.8471,
        address: 'Andheri Station East Exit, Mumbai',
        severity: 'high',
        is_anonymous: true,
      },
      {
        report_type: 'harassment',
        description: 'Woman followed for several minutes near the parking lot after dark.',
        latitude: 19.1188,
        longitude: 72.8468,
        address: 'Andheri Station Parking Lot, Mumbai',
        severity: 'high',
        is_anonymous: true,
      },
      {
        report_type: 'poor_lighting',
        description: 'Stretch of road has no working streetlights, completely dark after 8pm.',
        latitude: 19.1195,
        longitude: 72.8473,
        address: 'Service Road, Andheri Station, Mumbai',
        severity: 'medium',
        is_anonymous: true,
      },
      {
        report_type: 'poor_lighting',
        description: 'Underpass near the station has broken lights, feels unsafe at night.',
        latitude: 19.1185,
        longitude: 72.8465,
        address: 'Andheri Station Underpass, Mumbai',
        severity: 'medium',
        is_anonymous: true,
      },
      {
        report_type: 'unsafe_area',
        description: 'Isolated stretch with no shops or foot traffic after 9pm.',
        latitude: 19.119,
        longitude: 72.8475,
        address: 'Back Lane, Andheri Station, Mumbai',
        severity: 'medium',
        is_anonymous: true,
      },

      // Zone 2 — near Bandra station
      {
        report_type: 'harassment',
        description: 'Catcalling reported by multiple women near the taxi stand.',
        latitude: 19.0542,
        longitude: 72.8402,
        address: 'Bandra Station Taxi Stand, Mumbai',
        severity: 'high',
        is_anonymous: true,
      },
      {
        report_type: 'poor_lighting',
        description: 'Footpath lighting has been non-functional for over a month.',
        latitude: 19.0538,
        longitude: 72.8398,
        address: 'Bandra Station Footpath, Mumbai',
        severity: 'medium',
        is_anonymous: true,
      },
      {
        report_type: 'poor_lighting',
        description: 'Dimly lit bridge connecting to the station, hard to see at night.',
        latitude: 19.0545,
        longitude: 72.8405,
        address: 'Bandra Station Foot Bridge, Mumbai',
        severity: 'medium',
        is_anonymous: true,
      },
      {
        report_type: 'unsafe_area',
        description: 'Deserted alley with reports of suspicious loitering at night.',
        latitude: 19.0535,
        longitude: 72.8395,
        address: 'Behind Bandra Station, Mumbai',
        severity: 'high',
        is_anonymous: true,
      },
      {
        report_type: 'unsafe_area',
        description: 'Construction zone with no barricading or lighting, feels risky after dark.',
        latitude: 19.054,
        longitude: 72.841,
        address: 'Bandra Station Road, Mumbai',
        severity: 'medium',
        is_anonymous: true,
      },
    ]);
    console.log(' 10 safety reports created (2 clustered zones).');

    // ---------------- SAFE LOCATIONS ----------------
    await SafeLocation.bulkCreate([
      {
        name: 'Andheri Police Station',
        type: 'police',
        latitude: 19.13,
        longitude: 72.84,
        address: 'Andheri West, Mumbai',
        phone: '022-26248585',
      },
      {
        name: 'Bandra Police Station',
        type: 'police',
        latitude: 19.06,
        longitude: 72.83,
        address: 'Bandra West, Mumbai',
        phone: '022-26421316',
      },
      {
        name: 'Kokilaben Dhirubhai Ambani Hospital',
        type: 'hospital',
        latitude: 19.131,
        longitude: 72.827,
        address: 'Four Bungalows, Andheri West, Mumbai',
        phone: '022-42696969',
      },
      {
        name: 'Sushrusha Hospital',
        type: 'hospital',
        latitude: 19.022,
        longitude: 72.843,
        address: 'Dadar East, Mumbai',
        phone: '022-24137000',
      },
      {
        name: "Asha Niwas Women's Shelter",
        type: 'shelter',
        latitude: 19.065,
        longitude: 72.825,
        address: 'Bandra West, Mumbai',
        phone: '022-26400000',
      },
      {
        name: 'Saksham Women’s Shelter Home',
        type: 'shelter',
        latitude: 19.02,
        longitude: 72.84,
        address: 'Dadar, Mumbai',
        phone: '022-24300000',
      },

    ]);
    console.log(' 6 safe locations created.');

    console.log('\n Seed complete! Demo credentials:');
    console.log('   Admin    → admin@civiceye.in / Admin@123');
    console.log('   Officer  → officer@civiceye.in / Officer@123');
    console.log('   Citizen1 → citizen1@test.in / Test@123');
    console.log('   Citizen2 → citizen2@test.in / Test@123');

    process.exit(0);
  } catch (err) {
    console.error(' Seed failed:', err);
    process.exit(1);
  }
}

seed();
