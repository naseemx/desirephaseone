/**
 * Service Cards Data Repository
 *
 * Dedicated data file for the ServiceHome curved ribbon showcase.
 * Update, add, or re-order services here.
 * Only `title` and `image` are rendered on the service cards.
 */

export interface ServiceItem {
  id: string;
  title: string;
  image: string;
  category?: string;
  tag?: string[];
  description?: string;
  features?: string[];
}

export const DEFAULT_SERVICE_IMAGE = "/servicehome/service_card.jpg";

export const SERVICES: ServiceItem[] = [
  {
    id: "outdoor-led-billboards",
    title: "Outdoor LED Billboards & Spectaculars",
    image: DEFAULT_SERVICE_IMAGE,
    category: "Outdoor Media",
    tag: ["OUTDOOR", "HIGH BRIGHTNESS", "WEATHERPROOF"],
    description:
      "Ultra-high-nit outdoor LED billboard displays engineered for extreme weather conditions, high ambient sunlight visibility, and 24/7 commercial advertising impact.",
    features: [
      "Up to 10,000 nits daylight visibility",
      "IP68 front and rear weatherproof sealing",
      "Automated sensor-based ambient brightness control",
      "Cloud-based remote CMS scheduling and monitoring",
    ],
  },
  {
    id: "commercial-retail-video-walls",
    title: "Commercial & Retail Video Walls",
    image: DEFAULT_SERVICE_IMAGE,
    category: "Retail Tech",
    tag: ["RETAIL", "SEAMLESS", "HIGH REFRESH"],
    description:
      "Seamless bezel-free indoor LED video walls tailored for luxury retail stores, shopping malls, flagship brand showrooms, and commercial reception lobbies.",
    features: [
      "Zero-bezel seamless visual continuity",
      "Wide 160° horizontal and vertical viewing angles",
      "Ultra-slim lightweight die-cast aluminum cabinets",
      "Integrated front-access magnetic servicing",
    ],
  },
  {
    id: "curved-architectural-screens",
    title: "Curved & Flexible Architectural LED",
    image: DEFAULT_SERVICE_IMAGE,
    category: "Architectural",
    tag: ["ARCHITECTURAL", "CURVED", "CUSTOM SHAPES"],
    description:
      "Custom convex, concave, and S-curved flexible LED display modules integrated into interior architecture, pillars, undulating ceilings, and curved building facades.",
    features: [
      "Convex and concave bend angles up to 90 degrees",
      "Custom radius engineering to fit any wall curvature",
      "Ultra-flexible silicone-backed module construction",
      "Smooth distortion-free color calibration across curves",
    ],
  },
  {
    id: "transparent-glass-displays",
    title: "Transparent & Holographic Glass Displays",
    image: DEFAULT_SERVICE_IMAGE,
    category: "Transparent LED",
    tag: ["TRANSPARENT", "STOREFRONT", "HOLOGRAPHIC"],
    description:
      "High-transparency glass LED screens that turn storefront windows into vibrant digital media canvases without blocking natural light or interior visibility.",
    features: [
      "Up to 80% natural light transparency",
      "Minimalist cable-free structural framing",
      "High daytime contrast and vibrant night illumination",
      "Quick modular hanging installation for glass facades",
    ],
  },
  {
    id: "interactive-touch-kiosks",
    title: "Interactive Touch & Motion Kiosks",
    image: DEFAULT_SERVICE_IMAGE,
    category: "Interactive Tech",
    tag: ["INTERACTIVE", "TOUCHSCREEN", "WAYFINDING"],
    description:
      "Capacitive multi-touch interactive digital kiosks with optical motion tracking for wayfinding, self-service ticketing, retail exploration, and corporate experiences.",
    features: [
      "Multi-point capacitive touch sensing",
      "Toughened anti-glare scratch-resistant glass",
      "Integrated NFC, QR reader, and camera peripherals",
      "Custom kiosk enclosure finishes and branding",
    ],
  },
  {
    id: "live-event-staging-screens",
    title: "Live Event & Concert Stage Screens",
    image: DEFAULT_SERVICE_IMAGE,
    category: "Rental & Staging",
    tag: ["CONCERTS", "FAST LOCK", "HIGH FPS"],
    description:
      "Tour-grade rental LED screens with rapid quick-lock rigging mechanisms, high refresh rate driver ICs, and camera-ready flicker-free broadcast performance.",
    features: [
      "7680Hz ultra-high refresh rate for broadcast cameras",
      "Lightweight carbon-fiber and magnesium alloy frames",
      "One-man fast-lock hanging and curve-locking mechanisms",
      "Dual backup power and data signal redundancy",
    ],
  },
  {
    id: "3d-anamorphic-displays",
    title: "3D Naked-Eye Anamorphic Displays",
    image: DEFAULT_SERVICE_IMAGE,
    category: "Experiential",
    tag: ["3D ANAMORPHIC", "CORNER WRAP", "VIRAL"],
    description:
      "Corner-wrapping 90-degree 3D anamorphic LED screens creating hyper-realistic optical illusions that pop out of the screen without glasses.",
    features: [
      "Right-angle seamless curved corner modules",
      "Bespoke 3D CGI content production and perspective mapping",
      "Ultra-deep contrast with dark SMD LED diodes",
      "High dynamic range (HDR10 / DCI-P3 color gamut)",
    ],
  },
  {
    id: "stadium-perimeter-boards",
    title: "Stadium Perimeter & Sports Arena Boards",
    image: DEFAULT_SERVICE_IMAGE,
    category: "Sports Venues",
    tag: ["STADIUM", "IMPACT RESISTANT", "SCOREBOARD"],
    description:
      "Impact-resistant stadium perimeter LED boards and center-hung arena jumbotrons compliant with international sports broadcasting regulations.",
    features: [
      "Soft silicone rubber mask and top cushion for athlete safety",
      "High impact resistance against ball and player collision",
      "Dual power and fiber-optic signal loop redundancy",
      "Synchronized real-time scoreboard and sponsor rotations",
    ],
  },
  {
    id: "command-center-displays",
    title: "Command Center & Broadcast Video Walls",
    image: DEFAULT_SERVICE_IMAGE,
    category: "Mission Critical",
    tag: ["24/7 CRITICAL", "SUB-MILLIMETER", "MONITORING"],
    description:
      "Mission-critical fine-pitch LED display walls for security operation centers, traffic control hubs, and television news broadcast studios.",
    features: [
      "0.9mm to 1.5mm sub-millimeter pixel pitch options",
      "Fanless silent thermal dissipation architecture",
      "100,000-hour operational lifespan rating",
      "Zero-latency multi-window video processor integration",
    ],
  },
  {
    id: "high-brightness-window-screens",
    title: "High-Brightness Window Showcase Displays",
    image: DEFAULT_SERVICE_IMAGE,
    category: "Retail Tech",
    tag: ["WINDOW DISPLAY", "ANTI-REFLECTION", "ULTRA BRIGHT"],
    description:
      "High-brightness digital window displays designed specifically to counteract direct sunlight glare in street-facing automotive, fashion, and real estate windows.",
    features: [
      "5,500 nits sunlight-resistant brightness",
      "Smart automatic dimming for nighttime energy conservation",
      "Polarizing filter compatibility for sunglass wearers",
      "Ultra-thin profile suitable for existing window mullions",
    ],
  },
  {
    id: "kinetic-motorized-screens",
    title: "Kinetic & Motorized LED Installations",
    image: DEFAULT_SERVICE_IMAGE,
    category: "Kinetic Tech",
    tag: ["KINETIC", "MOTORIZED", "DYNAMIC"],
    description:
      "Kinetic LED displays where individual screen tiles move, rotate, and translate in 3D space in sync with visual content, music, and lighting choreography.",
    features: [
      "High-precision servo motor linear actuators",
      "Synchronized timecode control with sound and lighting",
      "Real-time collision detection and automated safety stops",
      "Bespoke kinetic programming for automotive and museum launches",
    ],
  },
  {
    id: "transit-wayfinding-displays",
    title: "Airport & Transit Digital Wayfinding",
    image: DEFAULT_SERVICE_IMAGE,
    category: "Public Sector",
    tag: ["WAYFINDING", "PASSENGER INFO", "DURABLE"],
    description:
      "High-reliability flight information display systems (FIDS) and transit wayfinding screens built to run continuously in airports and train terminals.",
    features: [
      "Wide viewing angle clarity from anywhere in the terminal",
      "Continuous 24/7/365 uninterrupted operation",
      "Anti-dust and anti-static electromagnetic shielding",
      "Direct integration with central airport transit databases",
    ],
  },
  {
    id: "virtual-production-xr-volumes",
    title: "Virtual Production XR LED Volumes",
    image: DEFAULT_SERVICE_IMAGE,
    category: "Virtual Studios",
    tag: ["XR STAGES", "IN-CAMERA VFX", "BROADCAST"],
    description:
      "In-camera VFX LED walls and ceilings designed for film studios, television production, and virtual commercial shoots using Unreal Engine.",
    features: [
      "High-frame-rate tracking up to 240fps with zero ghosting",
      "Genlock synchronization with cinema broadcast cameras",
      "True 16-bit grayscale depth for deep shadows and highlights",
      "Wide color gamut exceeding 99% DCI-P3 color standard",
    ],
  },
  {
    id: "microled-fine-pitch-displays",
    title: "Ultra-Fine Pitch MicroLED Broadcast Screens",
    image: DEFAULT_SERVICE_IMAGE,
    category: "MicroLED Displays",
    tag: ["MICROLED", "P0.7", "HDR BLACK"],
    description:
      "Next-generation MicroLED technology offering true deep blacks, microscopic pixel pitch, and unmatched color saturation for luxury home and executive suites.",
    features: [
      "Chip-on-Board (COB) surface encapsulation protection",
      "Microscopic pitch down to 0.7mm for retina-level viewing",
      "Deep optical black surface treatment with 1,000,000:1 contrast",
      "Moisture-proof, dust-proof, and anti-static surface barrier",
    ],
  },
  {
    id: "media-facade-architecture",
    title: "Dynamic Media Façade Architectural Lighting",
    image: DEFAULT_SERVICE_IMAGE,
    category: "Façade Media",
    tag: ["MEDIA FACADE", "BUILDING WRAP", "LARGE SCALE"],
    description:
      "Architectural mesh and strip LED systems integrated directly onto building skins, turning multi-story skyscrapers into dynamic civic landmarks.",
    features: [
      "Wind-resistant open mesh structure with low wind load",
      "Custom architectural mounting brackets and cable raceways",
      "DMX512 and Art-Net controller lighting synchronization",
      "Heavy-duty marine-grade corrosion-resistant materials",
    ],
  },
  {
    id: "custom-creative-shapes",
    title: "Custom Creative Spheres, Rings & Cubes",
    image: DEFAULT_SERVICE_IMAGE,
    category: "Creative Custom",
    tag: ["SPHERES", "CYLINDERS", "CREATIVE"],
    description:
      "Bespoke sculptural LED hardware engineered into 360-degree spheres, circular ceiling rings, hexagonal columns, and suspended geometric cubes.",
    features: [
      "Seamless 360° spherical mapping and calibration",
      "Custom CAD structural chassis design and fabrication",
      "Bespoke geometric video mapping template creation",
      "Centerpiece focal installations for museums and atriums",
    ],
  },
  {
    id: "hospitality-casino-displays",
    title: "Hospitality & Casino LED Features",
    image: DEFAULT_SERVICE_IMAGE,
    category: "Hospitality",
    tag: ["CASINO", "LUXURY", "SPECTACULAR"],
    description:
      "Glamorous high-impact digital installations for casino gaming floors, hotel lobbies, VIP lounges, and entertainment resorts.",
    features: [
      "Vibrant high-contrast visuals designed to captivate guests",
      "Custom integration into architectural marble and metalwork",
      "Scheduled dynamic mood lighting and promotional triggers",
      "Low power consumption with high-efficiency LED drivers",
    ],
  },
  {
    id: "corporate-lobby-experiential",
    title: "Corporate Lobby Experiential Walls",
    image: DEFAULT_SERVICE_IMAGE,
    category: "Corporate",
    tag: ["HEADQUARTERS", "BRAND STORY", "DATA VIS"],
    description:
      "Statement digital art installations for Fortune 500 headquarters, showcasing brand heritage, live company data, and interactive digital art.",
    features: [
      "Ambient audio-visual synchronization",
      "Live data visualization integration with corporate APIs",
      "Scheduled day-to-night lighting transitions",
      "Premium architectural bezel-less framing",
    ],
  },
  {
    id: "museum-immersive-cubes",
    title: "Museum & Immersive Experience Cubes",
    image: DEFAULT_SERVICE_IMAGE,
    category: "Museums",
    tag: ["IMMERSIVE", "FLOOR TO CEILING", "INTERACTIVE"],
    description:
      "Fully enclosed 5-sided LED experience rooms with floor LED screens capable of supporting human foot traffic for mind-bending immersion.",
    features: [
      "High-load tempered floor glass supporting 2,000 kg/m²",
      "360-degree spatial audio and projection mapping sync",
      "Ultra-fast latency for real-time interactive motion triggers",
      "Anti-scratch and slip-resistant floor module surface",
    ],
  },
  {
    id: "conference-boardroom-displays",
    title: "Executive Conference & Boardroom Systems",
    image: DEFAULT_SERVICE_IMAGE,
    category: "Conference",
    tag: ["ALL-IN-ONE", "WIRELESS", "HD VIDEO"],
    description:
      "All-in-one ultra-wide conference room LED screens with built-in speakers, wireless screen sharing, and multi-party video conferencing support.",
    features: [
      "21:9 and 16:9 ultra-wide video conferencing formats",
      "Wireless BYOD multi-screen casting from any device",
      "Integrated front-firing audio bar and microphone arrays",
      "Simple plug-and-play installation without external racks",
    ],
  },
];

// Alias for convenience
export const SERVICE_CARDS = SERVICES;

export default SERVICES;
