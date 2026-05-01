import {
  BadgeDollarSign,
  CalendarDays,
  MapPin,
  Megaphone,
  ShoppingBag,
  Sparkles,
  Store,
  Ticket
} from "lucide-react";

export const mallFacts = [
  {
    value: 32,
    suffix: "M+",
    label: "annual guests",
    detail: "One of North America's strongest year-round destination audiences."
  },
  {
    value: 5.6,
    suffix: "M",
    label: "sq ft destination",
    detail: "A retail, dining, entertainment, and events ecosystem at city scale."
  },
  {
    value: 500,
    suffix: "",
    label: "stores, nearly",
    detail: "Flagships, category leaders, boutiques, pop-ups, and national draws."
  },
  {
    value: 400,
    suffix: "+",
    label: "events yearly",
    detail: "A programming engine that continually renews reasons to visit."
  }
] as const;

export const navItems = [
  { id: "impact", label: "Impact" },
  { id: "property", label: "Property" },
  { id: "signal", label: "Signal" },
  { id: "retail", label: "Retail" },
  { id: "lifestyle", label: "Lifestyle" },
  { id: "attractions", label: "Attractions" },
  { id: "platform", label: "Platform" },
  { id: "takeover", label: "Takeover" },
  { id: "modules", label: "Modules" }
] as const;

export const storyBeats = [
  {
    id: "retail",
    eyebrow: "Retail Gravity",
    title: "A market inside the market.",
    copy:
      "Mall of America creates the rare condition every retailer wants: destination traffic, trip intent, entertainment adjacency, and time-on-property working together.",
    image: "/media/retail-luxury.webp",
    stats: ["Nearly 500 stores", "$1B+ annual sales", "Tourist + local mix"],
    icon: Store,
    accent: "#d5a546"
  },
  {
    id: "lifestyle",
    eyebrow: "Dining + Lifestyle",
    title: "Food is a reason to stay.",
    copy:
      "From quick service to polished dining, lifestyle programming turns a shopping trip into a full-day itinerary for families, travelers, and brand communities.",
    image: "/media/dining-lifestyle.webp",
    stats: ["45+ eateries", "All-day dwell time", "Family and traveler reach"],
    icon: Sparkles,
    accent: "#e45835"
  },
  {
    id: "attractions",
    eyebrow: "Attractions",
    title: "Entertainment changes the math.",
    copy:
      "Nickelodeon Universe, SEA LIFE, and signature attractions convert the property from a retail center into a must-visit regional destination.",
    image: "/media/attractions-night.webp",
    stats: ["30+ attractions", "Indoor theme park", "Year-round weatherproof draw"],
    icon: Ticket,
    accent: "#8dd35f"
  },
  {
    id: "platform",
    eyebrow: "Events + Platform",
    title: "A stage with audience built in.",
    copy:
      "Brand launches, cultural moments, performances, and activations can meet an audience already in motion, inside a venue designed for repeated public spectacle.",
    image: "/media/events-platform.webp",
    stats: ["400+ annual events", "Rotunda activations", "Sponsorship inventory"],
    icon: Megaphone,
    accent: "#51d2cd"
  }
] as const;

export const opportunityModules = [
  {
    id: "leasing",
    title: "Leasing Paths",
    label: "Retail, luxury, F&B, pop-up",
    icon: ShoppingBag,
    image: "/media/leasing-module.webp",
    copy: "Segmented pitch paths by category, unit type, launch strategy, and tenant objective."
  },
  {
    id: "sponsorship",
    title: "Sponsorship OS",
    label: "Activations, media, naming",
    icon: BadgeDollarSign,
    image: "/media/sponsorship-module.webp",
    copy: "Partnership surfaces across digital signage, rotunda moments, event programs, and experiential builds."
  },
  {
    id: "events",
    title: "Event Booking",
    label: "Launches, tours, corporate",
    icon: CalendarDays,
    image: "/media/events-module.webp",
    copy: "Venue modules for audience sizing, staging modes, production needs, and booking intent."
  },
  {
    id: "access",
    title: "Regional Reach",
    label: "Twin Cities + tourism",
    icon: MapPin,
    image: "/media/access-module.webp",
    copy: "A pitch layer for location, tourism, transit, airport access, and regional demand."
  }
] as const;

export const sourceLinks = [
  {
    label: "Mall of America Leasing",
    href: "https://www.mallofamerica.com/leasing"
  },
  {
    label: "Mall of America About",
    href: "https://www.mallofamerica.com/about"
  },
  {
    label: "Mall of America Events",
    href: "https://www.mallofamerica.com/events"
  },
  {
    label: "Mall of America Corporate Partnerships",
    href: "https://www.mallofamerica.com/partnership-opportunities"
  }
] as const;
