/**
 * Service Cards Data Repository
 *
 * Dedicated data file for the ServiceHome curved ribbon showcase.
 * Line 1 (Top Row): 8 Primary LED & Interactive Solutions
 * Line 2 (Bottom Row): 8 High-Impact Exhibition, Branding & Fabrication Solutions
 */

export interface ServiceItem {
  id: string;
  slug?: string;
  title: string;
  image: string;
  category?: string;
  tag?: string[];
  description?: string;
  features?: string[];
  subtitle?: string;
  stats?: { label: string; value: string }[];
  applications?: string[];
  specifications?: { key: string; value: string }[];
}

export const DEFAULT_SERVICE_IMAGE = "/servicehome/service_card.jpg";

export const SERVICES: ServiceItem[] = [
  // ─── FIRST LINE / ROW (8 SERVICES) ──────────────────────────────────────────
  {
    id: "customized-led-screens-solutions",
    title: "Customized LED Screens Solutions",
    image: DEFAULT_SERVICE_IMAGE,
    category: "Custom Solutions",
    tag: ["CUSTOM LED", "STRUCTURAL DESIGN", "FULL-CYCLE"],
    description:
      "Transform your space with our fully customized LED display solutions. We offer full-cycle delivery, from conceptualization through fabrication, structural design, installation, and ongoing optimization which makes LED displays accessible for every architectural environment. Every custom-designed screen adapts to your unique space, whether indoor, outdoor, or specialized environments. Our expertise delivers unlimited visual customization, precise pixel pitches, advanced refresh rates, and innovative structural framing solutions.",
    features: [
      "LED counters, tables, & stands to elevate your brand's event presence.",
      "Custom retail display stands with integrated LED screens.",
      "Full-cycle delivery from conceptualization through installation.",
      "Unlimited visual customization and innovative structural framing.",
    ],
  },
  {
    id: "smart-designed-flexible-displays",
    title: "Smart Designed Flexible Displays",
    image: DEFAULT_SERVICE_IMAGE,
    category: "Flexible LED",
    tag: ["FLEXIBLE", "CURVED", "ARCHITECTURAL"],
    description:
      "Flexible LED displays engineered to transform architectural spaces with boundless design freedom. Our bendable modular tiles create stunning curved and rounded displays perfectly adapted to pillars, columns, and organic architectural features. Seamlessly wrap your vision around structural elements with concave and convex curves, spherical installations, and flowing digital waves without visual distortion, bringing dynamic environments to life effortlessly.",
    features: [
      "Ultra-flexible LED screens crafted to transform any curved space brilliantly.",
      "Circular, cube, rounded, & cylindrical LED displays deliver captivating visuals.",
      "Seamless concave and convex curves and spherical installations without distortion.",
      "Bendable modular tiles adapted to pillars, columns, and organic architecture.",
    ],
  },
  {
    id: "striking-outdoor-digital-screens",
    title: "Striking Outdoor Digital Screens",
    image: DEFAULT_SERVICE_IMAGE,
    category: "Outdoor Digital",
    tag: ["OUTDOOR", "WEATHERPROOF", "HIGH BRIGHTNESS"],
    description:
      "We engineer high-brightness, weatherproof outdoor screens built to withstand extreme climates. Designed for highways, building facades, stadiums, and plazas, our displays feature automated brightness and sun readability for ultra-vivid daytime and nighttime visibility. They deliver dynamic content, heavy-duty durability, and low-power operation to maximize advertising reach and product lifespan. Featuring remote monitoring and automated thermal management, they run reliably around the clock with minimal maintenance.",
    features: [
      "Seamless and flexible outdoor cabinets for display installations.",
      "Weatherproof, durable outdoor cabinets built for all environments.",
      "Automated brightness and sun readability for ultra-vivid daytime and nighttime visibility.",
      "Remote monitoring and automated thermal management for 24/7 reliability.",
    ],
  },
  {
    id: "indoor-commercial-displays-solutions",
    title: "Indoor Commercial Displays Solutions",
    image: DEFAULT_SERVICE_IMAGE,
    category: "Indoor Commercial",
    tag: ["INDOOR", "COMMERCIAL", "ULTRA HD"],
    description:
      "We deliver ultra high definition indoor commercial display screens featuring superior color calibration, slim physical profiles, high energy efficiency, and seamless video wall configurations for corporate environments, control rooms, luxury retail venues, and broadcast studios, guaranteeing exceptional clarity, wide viewing angles, continuous operation, and effortless centralized content management that keeps your visual communications permanently impactful.",
    features: [
      "Vibrant, ultra-clear indoor modules with high brightness, in crisp performance.",
      "Indoor LED cabinets: perfect flatness and superior stability.",
      "Superior color calibration, slim physical profiles, and high energy efficiency.",
      "Seamless video walls for corporate environments, control rooms, and luxury retail.",
    ],
  },
  {
    id: "transparent-and-mesh-displays",
    title: "Transparent & Mesh Displays",
    image: DEFAULT_SERVICE_IMAGE,
    category: "Transparent & Mesh",
    tag: ["TRANSPARENT", "MESH DISPLAY", "LIGHTWEIGHT"],
    description:
      "We provide cutting-edge indoor and outdoor transparent mesh LED displays that offer high light transmittance, vivid image clarity, and a futuristic aesthetic for glass storefronts, building facades, and luxury showrooms. By blending dynamic digital messaging with real natural ambient lighting, these displays preserve the unobstructed views and interior aesthetics while creating an elevated interactive retail atmosphere for modern venues. Lets transform ordinary architectural glass into high-impact digital canvases without compromising structural integrity.",
    features: [
      "Ultra-bright, lightweight hanging LED mesh display for transparent visuals.",
      "Flexible mesh display, curved, highly transparent displays.",
      "High light transmittance preserving natural ambient lighting and views.",
      "Futuristic aesthetic for glass storefronts, building facades, and luxury showrooms.",
    ],
  },
  {
    id: "touch-the-future-interactive-display",
    title: "Touch the Future: Interactive Display",
    image: DEFAULT_SERVICE_IMAGE,
    category: "Interactive Tech",
    tag: ["INTERACTIVE", "MULTI-TOUCH", "COLLABORATION"],
    description:
      "We deploy multi-touch interactive displays featuring ultra-fast response, high precision touch, built-in annotation, and collaborative digital whiteboard software. These versatile systems empower teams to brainstorm ideas effectively and make decisions in real time. Engineered for boardrooms, classrooms, control centers, and public venues, these solutions drive active participation, facilitate dynamic presentations, and boost team collaboration by seamlessly linking physical spaces with modern digital workflows.",
    features: [
      "Smart interactive displays featuring integrated auto focus cameras.",
      "Ultra-durable interactive displays with all in one connectivity.",
      "Multi-touch with ultra-fast response, high precision touch, and built-in annotation.",
      "Collaborative digital whiteboard software engineered for boardrooms and public venues.",
    ],
  },
  {
    id: "custom-digital-kiosks-solutions",
    title: "Custom Digital Kiosks Solutions",
    image: DEFAULT_SERVICE_IMAGE,
    category: "Digital Kiosks",
    tag: ["KIOSKS", "SELF-SERVICE", "TOUCH INTERFACE"],
    description:
      "We craft fully customized digital kiosks equipped with intuitive interactive touch interfaces, heavy-duty protective enclosures, dynamic digital signage software, and professional corporate branding options designed to elevate consumer engagement, streamline wayfinding operations, process self-service transactions efficiently, and provide reliable round-the-clock interactive touch experiences across high-traffic retail malls, airport terminals, corporate lobbies, and public venues throughout the region.",
    features: [
      "Modern payment options: contactless cards, NFC, QR codes, and biometrics.",
      "We fully customize kiosk software to meet your unique operational needs.",
      "Heavy-duty protective enclosures with dynamic digital signage software.",
      "Streamlined wayfinding and self-service transactions for malls and airports.",
    ],
  },
  {
    id: "transform-your-sound-and-sight",
    title: "Transform Your Sound & Sight",
    image: DEFAULT_SERVICE_IMAGE,
    category: "Audiovisual Solutions",
    tag: ["AUDIOVISUAL", "DOLBY ATMOS", "IMMERSIVE AV"],
    description:
      "We deliver comprehensive audiovisual solutions combining high definition LED screen installation with crystal clear acoustic design. Our fully integrated AV systems transform corporate boardrooms, entertainment venues, commercial spaces, and private residences into immersive environments. Every installation features cutting-edge technology, striking visual displays, and immersive soundscapes with unified control systems.",
    features: [
      "Integrate immersive home theater sound systems with high-definition screens.",
      "Custom 3D Dolby Atmos audio experiences for high end screen environments.",
      "Unified control systems linking cutting-edge visuals and acoustic design.",
      "Immersive soundscapes for boardrooms, entertainment venues, and residences.",
    ],
  },

  // ─── SECOND LINE / ROW (8 SERVICES) ─────────────────────────────────────────
  {
    id: "high-impact-exhibition-booths",
    title: "High Impact Exhibition Booths",
    image: DEFAULT_SERVICE_IMAGE,
    category: "Exhibition Booths",
    tag: ["EXHIBITION", "CUSTOM KIOSKS", "EVENT BRANDING"],
    description:
      "Transform your event presence with high-impact exhibition booths and custom kiosk manufacturing engineered for maximum visibility, delivering complete end-to-end event branding from structural fabrication to scalable, reusable booth solutions built for future events that elevate your brand image, engage target audiences effectively, and significantly boost your overall campaign return on investment across every trade show or corporate showcase through innovative, durable, and visually compelling structural design solutions tailored specifically to meet your unique commercial objectives and architectural specifications seamlessly.",
    features: [
      "High-impact custom exhibition booth design and fabrication.",
      "End-to-end event branding and custom kiosk manufacturing.",
      "Scalable, reusable modular booth systems for trade shows.",
      "Visually compelling structural design built for maximum ROI.",
    ],
  },
  {
    id: "interactive-dynamic-visual-displays",
    title: "Interactive Dynamic Visual Displays",
    image: DEFAULT_SERVICE_IMAGE,
    category: "Dynamic Displays",
    tag: ["BACKDROPS", "POP-UP", "PORTABLE DISPLAYS"],
    description:
      "Select from versatile straight, L-shaped, or U-shaped backdrops paired with premium roll-up banners, flags, POS setups, and high-definition pop-up elements designed for fast, seamless assembly that effectively engage trade show visitors and leave a lasting impression at every corporate venue, ensuring your brand message stands out with high-resolution visual clarity, exceptional durability, and effortless portability built to support continuous promotional campaigns across diverse commercial environments while maintaining a sleek, modern aesthetic that captures immediate attention everywhere.",
    features: [
      "Straight, L-shaped, and U-shaped backdrop configurations.",
      "High-definition pop-up displays and premium roll-up banners.",
      "Fast, seamless assembly engineered for effortless portability.",
      "High-resolution visual clarity for continuous promotional campaigns.",
    ],
  },
  {
    id: "custom-precision-architectural-signage",
    title: "Custom Precision Architectural Signage",
    image: DEFAULT_SERVICE_IMAGE,
    category: "Architectural Signage",
    tag: ["SIGNAGE", "WAYFINDING", "WEATHERPROOF"],
    description:
      "We design, fabricate, and install premium internal and external signage tailored precisely to your vision, ranging from durable directional markers to bold exterior entry points built with high-quality acrylic, galvanized iron, stainless steel, and aluminum to ensure maximum durability, superior weather resistance, and long-lasting visual impact that strengthens your company identity, guides visitors seamlessly through physical spaces, and reflects the highest standards of professional quality across all public-facing elements of your corporate infrastructure.",
    features: [
      "Premium internal and external architectural signage solutions.",
      "Fabricated with high-grade acrylic, galvanized iron, stainless steel & aluminum.",
      "Durable directional wayfinding markers and bold exterior entry points.",
      "Superior weather resistance and high-impact corporate identity markers.",
    ],
  },
  {
    id: "innovative-high-impact-graphics",
    title: "Innovative High Impact Graphics",
    image: DEFAULT_SERVICE_IMAGE,
    category: "Impact Graphics",
    tag: ["3D CHANNEL LETTERS", "LIGHT BOXES", "UV PRINTING"],
    description:
      "Elevate your brand image through striking custom offerings like front-lit, back-lit halo-effect, digital, 3D channel letters, flex face, and non-illuminated options engineered with cutting-edge UV printing, precision engraving, light boxes, and gondola brandings designed to transform your space into an extraordinary brand environment that captures consumer focus, reinforces your messaging across every customer touchpoint, and projects a sleek, contemporary identity across both interior commercial spaces and outdoor retail environments.",
    features: [
      "Front-lit and back-lit halo-effect 3D channel letters.",
      "Cutting-edge UV printing, precision engraving, and light boxes.",
      "Gondola brandings and flex-face retail display graphics.",
      "Contemporary visual identity across interior and outdoor retail.",
    ],
  },
  {
    id: "strategic-corporate-brand-solutions",
    title: "Strategic Corporate Brand Solutions",
    image: DEFAULT_SERVICE_IMAGE,
    category: "Corporate Branding",
    tag: ["BRANDING", "VINYL GRAPHICS", "DIMENSIONAL"],
    description:
      "We transform business identities into powerful visual experiences through comprehensive internal and external branding solutions, utilizing premium materials like high-grade vinyl and durable acrylic for bespoke fabrication, dimensional lettering, and architectural graphics engineered to elevate brand presence and engage target audiences effectively across every environment, ensuring your unique value proposition is communicated clearly, consistently, and impressively across all corporate assets, office spaces, retail storefronts, and customer interaction points.",
    features: [
      "Comprehensive internal and external corporate branding.",
      "High-grade vinyl graphics, durable acrylic, and bespoke fabrication.",
      "Dimensional lettering and custom architectural wall graphics.",
      "Consistent brand identity across office spaces, lobbies, and storefronts.",
    ],
  },
  {
    id: "dynamic-promotional-marketing-displays",
    title: "Dynamic Promotional Marketing Displays",
    image: DEFAULT_SERVICE_IMAGE,
    category: "Promotional Displays",
    tag: ["VEHICLE WRAPS", "HOARDINGS", "ONE-WAY VISION"],
    description:
      "Turn fleet vehicles into mobile billboards with custom vehicle graphics while maximizing visibility through high-impact outdoor hoardings, dynamic floor wraps, interactive window decals, sandblast films, and targeted one-way vision graphics designed to boost brand recognition and capture immediate customer attention from initial concept through to final installation, driving maximum engagement, increasing audience reach, and converting everyday visual touchpoints into powerful marketing drivers for your rapidly growing business across high-traffic urban areas.",
    features: [
      "Fleet vehicle branding and full custom vehicle wraps.",
      "High-impact outdoor hoardings and commercial floor wraps.",
      "Interactive window decals, sandblast films, and one-way vision graphics.",
      "End-to-end execution from concept design to professional installation.",
    ],
  },
  {
    id: "commercial-interior-space-fitouts",
    title: "Commercial Interior Space Fitouts",
    image: DEFAULT_SERVICE_IMAGE,
    category: "Interior Fitouts",
    tag: ["FITOUTS", "RETAIL ENVIRONMENTS", "BESPOKE SPACES"],
    description:
      "We deliver end-to-end solutions spanning full-scale commercial fitouts, custom interactive kiosks, and immersive exhibition spaces, crafting bespoke retail environments from initial conceptual layout to final installation to elevate brand experiences with visual-grade functional designs built to the highest industry standards, ensuring seamless integration of premium materials, structural integrity, and brand aesthetics that transform ordinary physical locations into dynamic, highly functional spaces designed for sustained commercial performance and audience interaction.",
    features: [
      "Full-scale commercial, retail, and office interior fitouts.",
      "Custom interactive kiosks and immersive exhibition spaces.",
      "Bespoke retail fixtures engineered for visual impact and durability.",
      "Seamless conceptual layout planning through to turnkey handover.",
    ],
  },
  {
    id: "precision-custom-metal-fabrications",
    title: "Precision Custom Metal Fabrications",
    image: DEFAULT_SERVICE_IMAGE,
    category: "Metal Fabrications",
    tag: ["METAL FABRICATION", "ALUMINUM", "STRUCTURAL STEEL"],
    description:
      "Utilizing premium aluminum, high-grade acrylic, structural metals, and quality wooden elements, our expert team combines advanced manufacturing techniques with specialized metal fabrication to produce heavy-duty signage, 3D channel letters, sign board frames, event build-ups, and architectural features tailored to your unique vision, ensuring exceptional structural durability, flawless finishing, and complete customization across complex engineering projects that demand exact tolerances, high aesthetic standards, and long-lasting performance in any commercial setting.",
    features: [
      "Specialized aluminum, structural steel, and metal fabrication.",
      "Heavy-duty signboard frames, 3D channel letters, and structural build-ups.",
      "Advanced precision machining with exact engineering tolerances.",
      "Flawless powder coating, anodizing, and architectural finishing.",
    ],
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
