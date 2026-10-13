export type VehicleCategory = 'Sedan' | 'SUV' | 'Hatch' | 'Pickup' | 'Esportivo' | 'Todos';
export type TransmissionType = 'Automático' | 'Manual' | 'Todas';
export type FuelType = 'Flex' | 'Gasolina' | 'Diesel' | 'Híbrido' | 'Elétrico';
export type VehicleStatus = 'disponivel' | 'vendido' | 'reservado';

export interface Vehicle {
  id: string;
  title: string;
  brand: string;
  model: string;
  version: string;
  category: Exclude<VehicleCategory, 'Todos'>;
  price: number;
  year: number;
  modelYear: number;
  mileage: number;
  transmission: Exclude<TransmissionType, 'Todas'>;
  fuel: FuelType;
  color: string;
  plateEnd: string;
  status: VehicleStatus;
  featured: boolean;
  isNewArrival?: boolean;
  images: string[];
  description: string;
  features: string[];
  createdAt: string;
}

export interface StoreSettings {
  storeName: string;
  tagline: string;
  whatsappNumber: string; // e.g. 5551999999999
  phone: string;
  email: string;
  address: string;
  mapsUrl: string;
  openingHours: string;
  instagram: string;
  facebook: string;
  adminPin: string; // For protected admin dashboard access
}

export interface FilterState {
  search: string;
  category: VehicleCategory;
  transmission: TransmissionType;
  priceRange: 'all' | 'under100' | '100to150' | '150to200' | 'above200';
  sortBy: 'featured' | 'price-asc' | 'price-desc' | 'year-desc' | 'km-asc';
  onlyAvailable: boolean;
}
