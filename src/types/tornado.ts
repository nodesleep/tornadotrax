/**
 * Represents a tornado record from the database
 */
export interface Tornado {
  id: number;
  om: string; // Tornado number
  yr: string; // Year
  mo: string; // Month
  dy: string; // Day
  date: string; // Date in format (e.g., YYYY-MM-DD)
  time: string; // Time
  tz: string; // Time zone
  st: string; // State
  stf: string; // State FIPS number
  stn: string; // State name
  mag: string; // Magnitude (EF/F scale)
  inj: string; // Injuries
  fat: string; // Fatalities
  loss: string; // Property loss
  closs: string; // Crop loss
  slat: string; // Starting latitude
  slon: string; // Starting longitude
  elat: string; // Ending latitude
  elon: string; // Ending longitude
  len: string; // Length (miles)
  wid: string; // Width (yards)
  ns: string; // Number of states affected
  sn: string; // State number
  sg: string; // Segment number
  f1: string; // F-scale before 2007
  f2: string; // F-scale after 2007
  f3: string; // Additional rating info
  f4: string; // Additional rating info
  fc: string; // FCode
}

/**
 * Query parameters for tornado data API
 */
export interface TornadoQueryParams {
  state?: string; // Single state or comma-separated list of states
  year?: string; // Filter by year
  month?: string; // Filter by month
  day?: string; // Filter by day
  mag?: string; // Filter by magnitude (e.g., "1" or "0,1,2")
  magMin?: string; // Minimum magnitude
  magMax?: string; // Maximum magnitude
  injMin?: string; // Minimum injuries
  injMax?: string; // Maximum injuries
  startDate?: string; // Start date for range (YYYY-MM-DD)
  endDate?: string; // End date for range (YYYY-MM-DD)
}

/**
 * Response structure from tornado data API
 */
export interface TornadoResponse {
  data: Tornado[]; // Array of tornado records
  total_entries: number; // Total count of matching records
  timestamp: string; // Timestamp of the request
  statusCode: number; // HTTP status code
}

/**
 * Represents a point on the map for a tornado event
 */
export interface TornadoMapPoint {
  id: number;
  lat: number;
  lng: number;
  magnitude: string;
  date: string;
  state: string;
  injuries: string;
  fatalities: string;
  length?: string;
  width?: string;
}

/**
 * State options for dropdown selection
 */
export const STATE_OPTIONS = [
  { value: "AL", label: "Alabama" },
  { value: "AK", label: "Alaska" },
  { value: "AZ", label: "Arizona" },
  { value: "AR", label: "Arkansas" },
  { value: "CA", label: "California" },
  { value: "CO", label: "Colorado" },
  { value: "CT", label: "Connecticut" },
  { value: "DE", label: "Delaware" },
  { value: "FL", label: "Florida" },
  { value: "GA", label: "Georgia" },
  { value: "HI", label: "Hawaii" },
  { value: "ID", label: "Idaho" },
  { value: "IL", label: "Illinois" },
  { value: "IN", label: "Indiana" },
  { value: "IA", label: "Iowa" },
  { value: "KS", label: "Kansas" },
  { value: "KY", label: "Kentucky" },
  { value: "LA", label: "Louisiana" },
  { value: "ME", label: "Maine" },
  { value: "MD", label: "Maryland" },
  { value: "MA", label: "Massachusetts" },
  { value: "MI", label: "Michigan" },
  { value: "MN", label: "Minnesota" },
  { value: "MS", label: "Mississippi" },
  { value: "MO", label: "Missouri" },
  { value: "MT", label: "Montana" },
  { value: "NE", label: "Nebraska" },
  { value: "NV", label: "Nevada" },
  { value: "NH", label: "New Hampshire" },
  { value: "NJ", label: "New Jersey" },
  { value: "NM", label: "New Mexico" },
  { value: "NY", label: "New York" },
  { value: "NC", label: "North Carolina" },
  { value: "ND", label: "North Dakota" },
  { value: "OH", label: "Ohio" },
  { value: "OK", label: "Oklahoma" },
  { value: "OR", label: "Oregon" },
  { value: "PA", label: "Pennsylvania" },
  { value: "RI", label: "Rhode Island" },
  { value: "SC", label: "South Carolina" },
  { value: "SD", label: "South Dakota" },
  { value: "TN", label: "Tennessee" },
  { value: "TX", label: "Texas" },
  { value: "UT", label: "Utah" },
  { value: "VT", label: "Vermont" },
  { value: "VA", label: "Virginia" },
  { value: "WA", label: "Washington" },
  { value: "WV", label: "West Virginia" },
  { value: "WI", label: "Wisconsin" },
  { value: "WY", label: "Wyoming" },
  { value: "DC", label: "District of Columbia" },
  { value: "PR", label: "Puerto Rico" },
];

/**
 * Magnitude scale labels with descriptions
 */
export const MAGNITUDE_SCALE = [
  { value: "0", label: "EF0/F0", description: "Light damage (65-85 mph)" },
  { value: "1", label: "EF1/F1", description: "Moderate damage (86-110 mph)" },
  {
    value: "2",
    label: "EF2/F2",
    description: "Significant damage (111-135 mph)",
  },
  { value: "3", label: "EF3/F3", description: "Severe damage (136-165 mph)" },
  {
    value: "4",
    label: "EF4/F4",
    description: "Devastating damage (166-200 mph)",
  },
  { value: "5", label: "EF5/F5", description: "Incredible damage (>200 mph)" },
];
