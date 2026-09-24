/**
 * Service Cards Data Repository
 *
 * Dedicated data file for the ServiceHome curved ribbon showcase & dedicated service pages.
 * Line 1 (Top Row): 8 Primary LED & Interactive Solutions
 * Line 2 (Bottom Row): 8 High-Impact Exhibition, Branding & Fabrication Solutions
 */

export interface ServiceFeatureBox {
  title: string;
  description?: string;
  badge?: string;
  iconName?: string;
  type?: "checklist" | "numbered" | "standard";
  items?: string[];
}

export interface SpecificationTableRow {
  specification: string;
  range: string;
  notes: string;
}

export interface SpecificationTable {
  heading: string;
  columns?: [string, string, string];
  rows: SpecificationTableRow[];
}

export interface PitchRangeBox {
  pitch: string;
  distance: string;
  category: string;
  description: string;
}

export interface ServiceItem {
  id: string;
  slug?: string;
  title: string;
  navbarTitle?: string; // Text displayed when hovered in the navbar dropdown
  line?: 1 | 2;         // 1 for First Line (Top Row), 2 for Second Line (Bottom Row)
  row?: 1 | 2;          // Alias for line
  image: string;
  category?: string;
  description?: string;
  featuresHeading?: string;
  features?: ServiceFeatureBox[];
  specTable?: SpecificationTable;
  pitchBoxes?: PitchRangeBox[];
  secondaryOverviewTitle?: string;
  secondaryOverview?: string;
}

export const DEFAULT_SERVICE_IMAGE = "/servicehome/firstCard.jpeg";

export const SERVICES: ServiceItem[] = [
  // ─── FIRST LINE / ROW (8 SERVICES) ──────────────────────────────────────────
  {
    id: "customized-led-screens-solutions",
    title: "Customized LED Screens Solutions",
    navbarTitle: "Customized LED Screens",
    line: 1,
    row: 1,
    image: "/servicehome/firstCard.jpeg",
    category: "Custom Solutions",
    description:
      "Transform your space with our fully customized LED display solutions. We offer full-cycle delivery, from conceptualization through fabrication, structural design, installation, and ongoing optimization which makes LED displays accessible for every architectural environment. Every custom-designed screen adapts to your unique space, whether indoor, outdoor, or specialized environments. Our expertise delivers unlimited visual customization, precise pixel pitches, advanced refresh rates, and innovative structural framing solutions.",
    featuresHeading: "Customized LED Display Specifications & Applications",
    features: [
      {
        title: "Key Features of Custom LED Displays",
        type: "checklist",
        items: [
          "Custom Sizes and Aspect Ratios",
          "Flexible Design and Configuration",
          "Professional Grade Components",
          "AV and Control System Compatibility",
        ],
      },
      {
        title: "Where Customised LED Screens Are Used",
        type: "numbered",
        items: [
          "Retail flagship stores and brand experience zones",
          "Corporate lobbies and reception areas",
          "Shopping malls and architectural interiors",
          "Museums and cultural venues",
          "Control rooms and presentation spaces",
          "Event venues and premium indoor environments",
        ],
      },
      {
        title: "Turnkey Engineering & Technical Assurance",
        type: "checklist",
        items: [
          "In-House Precision CNC Metal Fabrication",
          "Structural Load & UAE Civil Defense Compliance",
          "Ultra-High 3840Hz+ Refresh Rate Calibration",
          "Intelligent Thermal Management & Redundant Power",
          "Modular Front & Rear Service Access",
          "Direct UAE Warranty & 24/7 Technical Support",
        ],
      },
    ],
    secondaryOverviewTitle: "Overview",
    secondaryOverview:
      "Our customized LED display solutions are engineered from the ground up to eliminate standard manufacturing constraints. From initial 3D site scanning, structural load calculations, and electrical schematics to custom CNC metal framing, installation, and ongoing color calibration, Desire Advertising manages every stage under one roof in the UAE. We collaborate directly with architects, interior designers, commercial developers, and brand managers to transform complex architectural concepts into high-reliability, show-stopping visual landmarks.",
  },
  {
    id: "smart-designed-flexible-displays",
    title: "Smart Designed Flexible Displays",
    navbarTitle: "Smart Flexible Displays",
    line: 1,
    row: 1,
    image: "/servicehome/flexibleDisplay.jpeg",
    category: "Flexible LED",
    description:
      "Flexible LED displays engineered to transform architectural spaces with boundless design freedom. Our bendable modular tiles create stunning curved and rounded displays perfectly adapted to pillars, columns, and organic architectural features. Seamlessly wrap your vision around structural elements with concave and convex curves, spherical installations, and flowing digital waves without visual distortion, bringing dynamic environments to life effortlessly.",
    specTable: {
      heading: "Key commercial specifications of flexible & curved LED screens:",
      columns: ["Specification", "Commercial Range", "Notes"],
      rows: [
        {
          specification: "Pixel Pitch",
          range: "P1.25 to P4.0",
          notes: "P1.5 to P2.5 most popular for curved columns and organic interior features",
        },
        {
          specification: "Bending Radius",
          range: "Minimum R = 150mm",
          notes: "Supports concave, convex, wave, and full 360° cylindrical column wrapping",
        },
        {
          specification: "Module Substrate",
          range: "Flexible silicone & soft PCB",
          notes: "Ultra-elastic silicone rubber base prevents internal circuit stress when curved",
        },
        {
          specification: "Brightness",
          range: "800 to 1,500 nits",
          notes: "High-contrast indoor calibrated; vibrant visuals under direct ambient retail lighting",
        },
        {
          specification: "Refresh Rate",
          range: "3,840 Hz to 7,680 Hz",
          notes: "High-frequency PWM driver ICs; flicker-free broadcast recording",
        },
        {
          specification: "Maintenance Access",
          range: "Magnetic front service",
          notes: "Direct vacuum tool or magnetic front extraction for effortless maintenance",
        },
        {
          specification: "Viewing Angle",
          range: "160° Horizontal / 160° Vertical",
          notes: "Ultra-wide viewing angle ensures zero color distortion across curved geometries",
        },
        {
          specification: "Power Consumption",
          range: "Typically 200 – 400W/sqm",
          notes: "Energy-efficient low-heat ICs engineered specifically for enclosed column structures",
        },
      ],
    },
    secondaryOverviewTitle: "Overview",
    secondaryOverview:
      "Desire Advertising’s flexible and curved LED display solutions unleash complete architectural freedom, eliminating the flat-panel boundaries of conventional screens. Using ultra-durable magnetic soft-module engineering, our curved displays can wrap around structural concrete pillars, form undulating ceiling ribbons, build seamless 90-degree internal and external corners, or create immersive spherical spheres. Each installation is supported by custom CNC internal framework, precision magnetic alignment, and centralized control systems across Dubai and the UAE.",
    pitchBoxes: [
      {
        pitch: "P1.25 – P1.5",
        distance: "1.0 – 2.0 METRES",
        category: "Ultra-close curved viewing",
        description: "Executive boardroom pillars, luxury jewelry counters, VIP lounge features",
      },
      {
        pitch: "P1.8 – P2.0",
        distance: "2.0 – 3.5 METRES",
        category: "Retail showroom standard",
        description: "Automotive showroom columns, flagship retail wraps, curved experiential portals",
      },
      {
        pitch: "P2.5",
        distance: "3.0 – 5.0 METRES",
        category: "Commercial column standard",
        description: "Shopping mall pillars, hotel lobby rotunda displays, corporate atrium columns",
      },
      {
        pitch: "P3.0 – P3.5",
        distance: "5.0 – 8.0 METRES",
        category: "Mid-range architectural",
        description: "Large venue curved backdrop ribbons, suspended ceiling waves, theater stages",
      },
      {
        pitch: "P4.0",
        distance: "8.0 – 15.0 METRES",
        category: "Large-format curved walls",
        description: "Auditorium side-wall wraps, airport concourse curved ribbons, transit hubs",
      },
    ],
  },
  {
    id: "striking-outdoor-digital-screens",
    title: "Striking Outdoor Digital Screens",
    navbarTitle: "Outdoor Digital Screens",
    line: 1,
    row: 1,
    image: "/servicehome/shrinkingOutdoorDisplay.jpeg",
    category: "Outdoor Digital",
    description:
      "We engineer high-brightness, weatherproof outdoor screens built to withstand extreme climates. Designed for highways, building facades, stadiums, and plazas, our displays feature automated brightness and sun readability for ultra-vivid daytime and nighttime visibility. They deliver dynamic content, heavy-duty durability, and low-power operation to maximize advertising reach and product lifespan. Featuring remote monitoring and automated thermal management, they run reliably around the clock with minimal maintenance.",
    specTable: {
      heading: "Key commercial specifications of outdoor LED screens:",
      columns: ["Specification", "Commercial Range", "Notes"],
      rows: [
        {
          specification: "Pixel Pitch",
          range: "P2.5 to P16",
          notes: "P3 to P6 most popular for street-level; P8 to P16 for highways & rooftops",
        },
        {
          specification: "Brightness",
          range: "5,000 to 10,000 nits",
          notes: "Daylight readable under direct UAE desert sun; auto-dimming sensor for night",
        },
        {
          specification: "Ingress Protection",
          range: "IP65 (Front) / IP54–IP65 (Rear)",
          notes: "Full dust-tight seal and water-jet resistant against extreme UAE weather",
        },
        {
          specification: "Refresh Rate",
          range: "3,840 Hz and above",
          notes: "Smooth broadcast-grade video playback; zero flicker on mobile and broadcast cameras",
        },
        {
          specification: "Operating Temperature",
          range: "-20°C to +65°C",
          notes: "Engineered with active heat dissipation for Middle East extreme summer conditions",
        },
        {
          specification: "Lifespan",
          range: "100,000 hours",
          notes: "10–12 years continuous commercial operation with minimal lumen degradation",
        },
        {
          specification: "Cabinet Design",
          range: "Die-cast aluminum or iron, front/rear access",
          notes: "Wind-load certified structural frames; weatherproof silicone seals",
        },
        {
          specification: "Power Consumption",
          range: "Typically 250 – 450W/sqm (Max 800W)",
          notes: "Equipped with energy-saving driver ICs and PFC power units",
        },
      ],
    },
    secondaryOverviewTitle: "Overview",
    secondaryOverview:
      "Engineered specifically to conquer the extreme heat, direct desert sunlight, and abrasive dust of the UAE climate, our outdoor digital screens deliver maximum visual impact without degradation. Desire Advertising provides turnkey execution from structural foundation calculations, soil testing, and municipal permit processing to custom CNC steel pylon fabrication, heavy-crane installation, and remote automated monitoring. Each screen operates with intelligent energy-efficient power supplies and automated ambient light sensors, ensuring vivid commercial readability by day and glare-free efficiency by night.",
    pitchBoxes: [
      {
        pitch: "P2.5 – P3.0",
        distance: "2.5 – 5 METRES",
        category: "Close-range outdoor",
        description: "Storefront exteriors, gas station canopies, outdoor retail kiosks",
      },
      {
        pitch: "P3.9 – P4.8",
        distance: "4 – 8 METRES",
        category: "Urban street level",
        description: "Pedestrian plazas, shopping mall facades, transit stops, building entrances",
      },
      {
        pitch: "P5.0 – P6.0",
        distance: "6 – 12 METRES",
        category: "DOOH commercial standard",
        description: "Roadside digital billboards, commercial building walls, public squares",
      },
      {
        pitch: "P8.0 – P10.0",
        distance: "10 – 25 METRES",
        category: "Long-range highway",
        description: "Major highway unipoles, stadium perimeter screens, flyover advertising",
      },
      {
        pitch: "P16.0+",
        distance: "25 – 60+ METRES",
        category: "Mega-format architectural",
        description: "High-rise rooftop displays, massive arena scoreboards, iconic city towers",
      },
    ],
  },
  {
    id: "indoor-commercial-displays-solutions",
    title: "Indoor Commercial Displays Solutions",
    navbarTitle: "Indoor Commercial Displays",
    line: 1,
    row: 1,
    image: "/servicehome/indoorCommercialDisplay.jpeg",
    category: "Indoor Commercial",
    description:
      "We deliver ultra high definition indoor commercial display screens featuring superior color calibration, slim physical profiles, high energy efficiency, and seamless video wall configurations for corporate environments, control rooms, luxury retail venues, and broadcast studios, guaranteeing exceptional clarity, wide viewing angles, continuous operation, and effortless centralized content management that keeps your visual communications permanently impactful.",
    specTable: {
      heading: "Key commercial specifications of indoor LED screens:",
      columns: ["Specification", "Commercial Range", "Notes"],
      rows: [
        {
          specification: "Pixel Pitch",
          range: "P0.9 to P6",
          notes: "Lower pitch = finer detail; choose based on viewing distance",
        },
        {
          specification: "Brightness",
          range: "800 to 2,000 nits",
          notes: "Calibrated for indoor ambient light – not daylight visible",
        },
        {
          specification: "Refresh Rate",
          range: "3,840 Hz and above",
          notes: "Flicker-free; essential for camera-facing environments",
        },
        {
          specification: "Colour Depth",
          range: "16-bit processing",
          notes: "Accurate, consistent colour reproduction across panels",
        },
        {
          specification: "Operating Hours",
          range: "16 to 24 hours/day",
          notes: "Commercial-grade rated for continuous daily operation",
        },
        {
          specification: "Lifespan",
          range: "50,000 to 100,000 hrs",
          notes: "8–17 years at 16 hrs/day under maintained conditions",
        },
        {
          specification: "Cabinet Design",
          range: "Modular, front or rear access",
          notes: "Custom sizing; seamless panel-to-panel display surfaces",
        },
        {
          specification: "Power Consumption",
          range: "Typically 300 – 800W/sqm",
          notes: "Varies by brightness setting and technology type",
        },
      ],
    },
    secondaryOverviewTitle: "Overview",
    secondaryOverview:
      "Desire Advertising engineers high-performance indoor commercial LED displays designed for continuous 24/7 mission-critical operation across corporate boardrooms, control centers, television studios, and luxury retail flagships. Our modular panel architecture features magnetic front-access servicing, seamless micron-level alignment, and advanced 16-bit color processing that ensures flawless visual uniformity from any viewing angle. Every system is delivered with turnkey structural design, cable management, power redundancy, and comprehensive UAE on-site maintenance support.",
    pitchBoxes: [
      {
        pitch: "P0.9 – P1.2",
        distance: "1.0 – 1.5 METRES",
        category: "Ultra-close precision",
        description: "Security control rooms, broadcast studios, executive boardrooms",
      },
      {
        pitch: "P1.5 – P1.8",
        distance: "1.5 – 2.5 METRES",
        category: "Premium close-up viewing",
        description: "Corporate boardrooms, command centres, luxury retail counters",
      },
      {
        pitch: "P2.0 – P2.5",
        distance: "2.5 – 4 METRES",
        category: "Retail & corporate standard",
        description: "Lobbies, retail showrooms, reception areas, conference rooms",
      },
      {
        pitch: "P3.0 – P4.0",
        distance: "4 – 8 METRES",
        category: "Mid-range commercial",
        description: "Hotel atriums, shopping mall concourses, event halls",
      },
      {
        pitch: "P5.0 – P6.0",
        distance: "8 – 12 METRES",
        category: "Large-format indoor",
        description: "Auditoriums, large event venues, warehouse retail",
      },
    ],
  },
  {
    id: "transparent-and-mesh-displays",
    title: "Transparent & Mesh Displays",
    navbarTitle: "Transparent & Mesh Displays",
    line: 1,
    row: 1,
    image: "/servicehome/transparentDisplay.jpeg",
    category: "Transparent & Mesh",
    description:
      "We provide cutting-edge indoor and outdoor transparent mesh LED displays that offer high light transmittance, vivid image clarity, and a futuristic aesthetic for glass storefronts, building facades, and luxury showrooms. By blending dynamic digital messaging with real natural ambient lighting, these displays preserve the unobstructed views and interior aesthetics while creating an elevated interactive retail atmosphere for modern venues. Lets transform ordinary architectural glass into high-impact digital canvases without compromising structural integrity.",
    featuresHeading: "Transparent & Mesh Display Specifications & Applications",
    features: [
      {
        title: "Key Features of Transparent & Mesh Displays",
        type: "checklist",
        items: [
          "Up to 80% Optical Light Transmittance",
          "Ultra-Slim & Lightweight Modular Framing (8–12 kg/sqm)",
          "Daylight-Visible High-Brightness LEDs (up to 6,000 Nits)",
          "Unobstructed Natural Lighting & Interior Two-Way Views",
        ],
      },
      {
        title: "Where Transparent & Mesh Displays Are Used",
        type: "numbered",
        items: [
          "Luxury retail storefronts and boutique window displays",
          "Automotive showrooms and premium brand flagships",
          "Commercial glass building facades and atrium walls",
          "Shopping mall skylights and suspended central voids",
          "Corporate headquarters and scenic glass partitions",
          "High-profile exhibition stages and experiential activations",
        ],
      },
      {
        title: "Turnkey Engineering & Architectural Integration",
        type: "checklist",
        items: [
          "Minimal Weight Structural Clamping & Cable Rigging",
          "Zero Alteration to Existing Window Glazing Systems",
          "Silent Fanless Convection Heat Dissipation",
          "Integrated Centralized Cloud CMS Media Players",
          "Low Wind-Resistance Mesh Engineering for Outdoors",
          "Complete UAE Turnkey Installation & Maintenance Warranty",
        ],
      },
    ],
    secondaryOverviewTitle: "Overview",
    secondaryOverview:
      "Transparent and mesh LED displays represent the ultimate synergy of digital communication and modern architectural glass. By allowing up to 80% of natural light to penetrate through the screen, these displays turn storefront windows and glass curtain walls into high-impact digital canvases without blocking sightlines or dimming interior spaces. Desire Advertising handles custom frame sizing, structural load assessment, cabling concealment, and synchronization with architectural lighting across the UAE. The result is a futuristic visual experience that commands street-level attention while maintaining elegant architectural aesthetics.",
  },
  {
    id: "touch-the-future-interactive-display",
    title: "Touch the Future: Interactive Display",
    navbarTitle: "Interactive Displays",
    line: 1,
    row: 1,
    image: "/servicehome/interactiveDisplay.jpeg",
    category: "Interactive Tech",
    description:
      "We deploy multi-touch interactive displays featuring ultra-fast response, high precision touch, built-in annotation, and collaborative digital whiteboard software. These versatile systems empower teams to brainstorm ideas effectively and make decisions in real time. Engineered for boardrooms, classrooms, control centers, and public venues, these solutions drive active participation, facilitate dynamic presentations, and boost team collaboration by seamlessly linking physical spaces with modern digital workflows.",
    featuresHeading: "Interactive Touch Display Specifications & Applications",
    features: [
      {
        title: "Key Features of Interactive Touch Displays",
        type: "checklist",
        items: [
          "Ultra-Fast 20-Point to 40-Point Touch Precision",
          "4K UHD Anti-Glare & Anti-Fingerprint Toughened Glass",
          "Dual OS Support (Seamless Windows & Android Integration)",
          "Zero-Bonding Optical Clarity & Instant Stylus Annotation",
        ],
      },
      {
        title: "Where Interactive Displays Are Used",
        type: "numbered",
        items: [
          "Corporate boardrooms and executive briefing centers",
          "Government command centers and control operations",
          "Smart classrooms, universities, and training academies",
          "Interactive museum exhibits and experience centers",
          "Real estate customer experience centers and kiosks",
          "Healthcare diagnostic hubs and telemedicine rooms",
        ],
      },
      {
        title: "Turnkey Hardware & Software Integration",
        type: "checklist",
        items: [
          "Native Wireless Screen Sharing (iOS, Android, Windows, Mac)",
          "Integrated 4K AI Tracking Camera & Microphone Array",
          "Custom Software Development & Whiteboarding Apps",
          "Motorized Mobile Trolley or Wall-Mount Systems",
          "Centralized Device Management & Cloud Updates",
          "Turnkey On-Site Deployment & Staff Training in UAE",
        ],
      },
    ],
    secondaryOverviewTitle: "Overview",
    secondaryOverview:
      "Desire Advertising supplies and integrates enterprise-grade interactive flat panels and multi-touch video walls designed to foster real-time collaboration and intuitive customer engagement. From high-pressure boardroom presentations and digital war-rooms to university lecture halls and public experiential hubs, our interactive displays blend responsive multi-touch responsiveness with vivid 4K visual performance. Every deployment is delivered with custom mounting solutions, integrated audio systems, corporate collaboration software, and comprehensive local UAE technical support.",
  },
  {
    id: "custom-digital-kiosks-solutions",
    title: "Custom Digital Kiosks Solutions",
    navbarTitle: "Custom Digital Kiosks",
    line: 1,
    row: 1,
    image: "/servicehome/customKioskiDisplay.jpeg",
    category: "Digital Kiosks",
    description:
      "We craft fully customized digital kiosks equipped with intuitive interactive touch interfaces, heavy-duty protective enclosures, dynamic digital signage software, and professional corporate branding options designed to elevate consumer engagement, streamline wayfinding operations, process self-service transactions efficiently, and provide reliable round-the-clock interactive touch experiences across high-traffic retail malls, airport terminals, corporate lobbies, and public venues throughout the region.",
    featuresHeading: "Custom Digital Kiosk Specifications & Applications",
    features: [
      {
        title: "Key Features of Custom Digital Kiosks",
        type: "checklist",
        items: [
          "10-Point to 40-Point PCAP Multi-Touch Panels",
          "Commercial-Grade 24/7 Anti-Glare Displays",
          "Bespoke Enclosure Materials (Steel, Acrylic, Corian, Wood)",
          "Integrated Peripherals (RFID, QR, Thermal Printers, POS)",
        ],
      },
      {
        title: "Where Custom Digital Kiosks Are Used",
        type: "numbered",
        items: [
          "Shopping mall 3D interactive wayfinding directories",
          "Hospitality and hotel self-check-in / concierge stations",
          "Retail and QSR self-ordering and payment terminals",
          "Corporate lobbies for automated visitor registration",
          "Healthcare facilities, clinics, and hospital reception areas",
          "Airports, transport stations, and smart government centers",
        ],
      },
      {
        title: "Turnkey Fabrication & Hardware Integration",
        type: "checklist",
        items: [
          "Precision Laser-Cut Metal Enclosure & Powder Coating",
          "Vandal-Resistant Toughened Glass & Secure Keyed Access",
          "Internal Cable Management & Industrial Ventilation",
          "Integrated Windows / Android Embedded Industrial PCs",
          "Full UAE Brand Identity Wrap & Custom LED Illumination",
          "On-Site Delivery, Commissioning & Maintenance Service",
        ],
      },
    ],
    secondaryOverviewTitle: "Overview",
    secondaryOverview:
      "Our custom digital kiosks bridge the gap between physical consumer presence and streamlined digital self-service. Designed, engineered, and fabricated in-house by Desire Advertising in the UAE, each kiosk is customized to fit your specific operational workflows — whether interactive wayfinding, contactless registration, retail self-checkout, or dynamic informational directories. We integrate industrial touchscreens, robust thermal management, secure internal hardware mounting, and bespoke enclosure aesthetics that seamlessly reflect your brand identity while ensuring durable 24/7 uptime in high-traffic commercial environments.",
  },
  {
    id: "transform-your-sound-and-sight",
    title: "Transform Your Sound & Sight",
    navbarTitle: "Audiovisual Solutions",
    line: 1,
    row: 1,
    image: "/servicehome/transform.jpeg",
    category: "Audiovisual Solutions",
    description:
      "We deliver comprehensive audiovisual solutions combining high definition LED screen installation with crystal clear acoustic design. Our fully integrated AV systems transform corporate boardrooms, entertainment venues, commercial spaces, and private residences into immersive environments. Every installation features cutting-edge technology, striking visual displays, and immersive soundscapes with unified control systems.",
    featuresHeading: "Audiovisual System Specifications & Applications",
    features: [
      {
        title: "Key Capabilities of Integrated AV Solutions",
        type: "checklist",
        items: [
          "Turnkey Synchronization of Visuals, Acoustics & Lighting",
          "High-Fidelity Commercial Sound Reinforcement & DSP",
          "Centralized Touch-Panel Control (Crestron / Extron / Q-SYS)",
          "Zero-Latency 4K Video Over IP (AVoIP) Distribution",
        ],
      },
      {
        title: "Where Integrated AV Systems Are Used",
        type: "numbered",
        items: [
          "Commercial boardrooms, auditoriums, and council chambers",
          "Luxury hotels, ballrooms, and conference centers",
          "Fine dining restaurants, beach clubs, and night venues",
          "High-end residential home cinemas and private villas",
          "Museums, planetariums, and immersive art experiences",
          "Public venues, religious centers, and sports arenas",
        ],
      },
      {
        title: "Turnkey Acoustic & Visual Engineering",
        type: "checklist",
        items: [
          "Acoustic Room Modeling & RT60 Reverberation Analysis",
          "Custom Architectural Speaker Integration & Concealment",
          "Beamforming Microphone Arrays with AI Noise Suppression",
          "Clean Rack Building, Cable Lacing & Redundant Power",
          "Smart Automated Scene Presets (Presentation, Cinema, Event)",
          "Dedicated UAE Commissioning, Maintenance & SLA Contracts",
        ],
      },
    ],
    secondaryOverviewTitle: "Overview",
    secondaryOverview:
      "Great visual displays demand equally extraordinary sound. Desire Advertising delivers complete end-to-end audiovisual systems that fuse ultra-high-definition LED screen technology with world-class acoustic design and intuitive control automation. We eliminate disjointed third-party vendors by engineering, installing, and programming the entire audiovisual ecosystem under one roof in the UAE. From corporate council chambers requiring pristine speech intelligibility to entertainment venues requiring immersive multi-channel sound, our certified AV engineers craft sensory spaces that inspire and captivate.",
  },

  // ─── SECOND LINE / ROW (8 SERVICES) ─────────────────────────────────────────
  {
    id: "high-impact-exhibition-booths",
    title: "High Impact Exhibition Booths",
    navbarTitle: "Exhibition Booths",
    line: 2,
    row: 2,
    image: DEFAULT_SERVICE_IMAGE,
    category: "Exhibition Booths",
    description:
      "Transform your event presence with high-impact exhibition booths and custom kiosk manufacturing engineered for maximum visibility, delivering complete end-to-end event branding from structural fabrication to scalable, reusable booth solutions built for future events that elevate your brand image, engage target audiences effectively, and significantly boost your overall campaign return on investment across every trade show or corporate showcase through innovative, durable, and visually compelling structural design solutions tailored specifically to meet your unique commercial objectives and architectural specifications seamlessly.",
  },
  {
    id: "interactive-dynamic-visual-displays",
    title: "Interactive Dynamic Visual Displays",
    navbarTitle: "Dynamic Visual Displays",
    line: 2,
    row: 2,
    image: DEFAULT_SERVICE_IMAGE,
    category: "Dynamic Displays",
    description:
      "Select from versatile straight, L-shaped, or U-shaped backdrops paired with premium roll-up banners, flags, POS setups, and high-definition pop-up elements designed for fast, seamless assembly that effectively engage trade show visitors and leave a lasting impression at every corporate venue, ensuring your brand message stands out with high-resolution visual clarity, exceptional durability, and effortless portability built to support continuous promotional campaigns across diverse commercial environments while maintaining a sleek, modern aesthetic that captures immediate attention everywhere.",
  },
  {
    id: "custom-precision-architectural-signage",
    title: "Custom Precision Architectural Signage",
    navbarTitle: "Precision Architectural Signage",
    line: 2,
    row: 2,
    image: DEFAULT_SERVICE_IMAGE,
    category: "Architectural Signage",
    description:
      "We design, fabricate, and install premium internal and external signage tailored precisely to your vision, ranging from durable directional markers to bold exterior entry points built with high-quality acrylic, galvanized iron, stainless steel, and aluminum to ensure maximum durability, superior weather resistance, and long-lasting visual impact that strengthens your company identity, guides visitors seamlessly through physical spaces, and reflects the highest standards of professional quality across all public-facing elements of your corporate infrastructure.",
  },
  {
    id: "innovative-high-impact-graphics",
    title: "Innovative High Impact Graphics",
    navbarTitle: "High Impact Graphics",
    line: 2,
    row: 2,
    image: DEFAULT_SERVICE_IMAGE,
    category: "Impact Graphics",
    description:
      "Elevate your brand image through striking custom offerings like front-lit, back-lit halo-effect, digital, 3D channel letters, flex face, and non-illuminated options engineered with cutting-edge UV printing, precision engraving, light boxes, and gondola brandings designed to transform your space into an extraordinary brand environment that captures consumer focus, reinforces your messaging across every customer touchpoint, and projects a sleek, contemporary identity across both interior commercial spaces and outdoor retail environments.",
  },
  {
    id: "strategic-corporate-brand-solutions",
    title: "Strategic Corporate Brand Solutions",
    navbarTitle: "Corporate Brand Solutions",
    line: 2,
    row: 2,
    image: DEFAULT_SERVICE_IMAGE,
    category: "Corporate Branding",
    description:
      "We transform business identities into powerful visual experiences through comprehensive internal and external branding solutions, utilizing premium materials like high-grade vinyl and durable acrylic for bespoke fabrication, dimensional lettering, and architectural graphics engineered to elevate brand presence and engage target audiences effectively across every environment, ensuring your unique value proposition is communicated clearly, consistently, and impressively across all corporate assets, office spaces, retail storefronts, and customer interaction points.",
  },
  {
    id: "dynamic-promotional-marketing-displays",
    title: "Dynamic Promotional Marketing Displays",
    navbarTitle: "Promotional Marketing Displays",
    line: 2,
    row: 2,
    image: DEFAULT_SERVICE_IMAGE,
    category: "Promotional Displays",
    description:
      "Turn fleet vehicles into mobile billboards with custom vehicle graphics while maximizing visibility through high-impact outdoor hoardings, dynamic floor wraps, interactive window decals, sandblast films, and targeted one-way vision graphics designed to boost brand recognition and capture immediate customer attention from initial concept through to final installation, driving maximum engagement, increasing audience reach, and converting everyday visual touchpoints into powerful marketing drivers for your rapidly growing business across high-traffic urban areas.",
  },
  {
    id: "commercial-interior-space-fitouts",
    title: "Commercial Interior Space Fitouts",
    navbarTitle: "Commercial Interior Fitouts",
    line: 2,
    row: 2,
    image: DEFAULT_SERVICE_IMAGE,
    category: "Interior Fitouts",
    description:
      "We deliver end-to-end solutions spanning full-scale commercial fitouts, custom interactive kiosks, and immersive exhibition spaces, crafting bespoke retail environments from initial conceptual layout to final installation to elevate brand experiences with visual-grade functional designs built to the highest industry standards, ensuring seamless integration of premium materials, structural integrity, and brand aesthetics that transform ordinary physical locations into dynamic, highly functional spaces designed for sustained commercial performance and audience interaction.",
  },
  {
    id: "precision-custom-metal-fabrications",
    title: "Precision Custom Metal Fabrications",
    navbarTitle: "Custom Metal Fabrications",
    line: 2,
    row: 2,
    image: DEFAULT_SERVICE_IMAGE,
    category: "Metal Fabrications",
    description:
      "Utilizing premium aluminum, high-grade acrylic, structural metals, and quality wooden elements, our expert team combines advanced manufacturing techniques with specialized metal fabrication to produce heavy-duty signage, 3D channel letters, sign board frames, event build-ups, and architectural features tailored to your unique vision, ensuring exceptional structural durability, flawless finishing, and complete customization across complex engineering projects that demand exact tolerances, high aesthetic standards, and long-lasting performance in any commercial setting.",
  },
];

// Alias for convenience
export const SERVICE_CARDS = SERVICES;

/**
 * Find service by slug or id
 */
export function getServiceBySlug(slug: string): ServiceItem | undefined {
  return SERVICES.find((s) => s.id === slug || s.slug === slug);
}

/**
 * Return all services
 */
export function getAllServices(): ServiceItem[] {
  return SERVICES;
}

/**
 * Return services belonging to line 1 (Top Row)
 */
export function getLine1Services(): ServiceItem[] {
  return SERVICES.filter((s) => (s.line ?? s.row ?? 1) === 1);
}

/**
 * Return services belonging to line 2 (Bottom Row)
 */
export function getLine2Services(): ServiceItem[] {
  return SERVICES.filter((s) => (s.line ?? s.row) === 2);
}

/**
 * Return adjacent services (previous and next) for circular navigation
 */
export function getAdjacentServices(slug: string): {
  prev: ServiceItem;
  next: ServiceItem;
} {
  const index = SERVICES.findIndex((s) => s.id === slug || s.slug === slug);
  if (index === -1) {
    return { prev: SERVICES[SERVICES.length - 1], next: SERVICES[1] };
  }
  const prev = SERVICES[(index - 1 + SERVICES.length) % SERVICES.length];
  const next = SERVICES[(index + 1) % SERVICES.length];
  return { prev, next };
}

export default SERVICES;
