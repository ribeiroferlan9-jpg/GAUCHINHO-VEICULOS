import React, { createContext, useContext, useState, useEffect } from 'react';
import { Vehicle, StoreSettings } from '../types';
import { INITIAL_VEHICLES, INITIAL_SETTINGS } from '../data/initialVehicles';

interface CatalogContextType {
  vehicles: Vehicle[];
  settings: StoreSettings;
  addVehicle: (vehicle: Omit<Vehicle, 'id' | 'createdAt'>) => void;
  updateVehicle: (id: string, updates: Partial<Vehicle>) => void;
  deleteVehicle: (id: string) => void;
  toggleVehicleStatus: (id: string) => void;
  toggleVehicleFeatured: (id: string) => void;
  updateStoreSettings: (updates: Partial<StoreSettings>) => void;
  resetToDefaults: () => void;
  getWhatsAppLink: (carTitle: string, carPrice: number, customNote?: string) => string;
  getGeneralWhatsAppLink: (message?: string) => string;
  getFinancingWhatsAppLink: (carTitle: string, carPrice: number, downPayment: number, terms: number, monthlyEstimate: number) => string;
}

const STORAGE_KEY_VEHICLES = 'gauchinho_veiculos_catalog_v1';
const STORAGE_KEY_SETTINGS = 'gauchinho_veiculos_settings_v1';

const CatalogContext = createContext<CatalogContextType | undefined>(undefined);

export const CatalogProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [vehicles, setVehicles] = useState<Vehicle[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_VEHICLES);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed to load vehicles from storage', e);
    }
    return INITIAL_VEHICLES;
  });

  const [settings, setSettings] = useState<StoreSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SETTINGS);
      if (saved) {
        return { ...INITIAL_SETTINGS, ...JSON.parse(saved) };
      }
    } catch (e) {
      console.error('Failed to load settings from storage', e);
    }
    return INITIAL_SETTINGS;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_VEHICLES, JSON.stringify(vehicles));
    } catch (e) {
      console.error('Failed to save vehicles to storage', e);
    }
  }, [vehicles]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings));
    } catch (e) {
      console.error('Failed to save settings to storage', e);
    }
  }, [settings]);

  const addVehicle = (vehicleData: Omit<Vehicle, 'id' | 'createdAt'>) => {
    const newVehicle: Vehicle = {
      ...vehicleData,
      id: `vehicle-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      createdAt: new Date().toISOString(),
    };
    setVehicles(prev => [newVehicle, ...prev]);
  };

  const updateVehicle = (id: string, updates: Partial<Vehicle>) => {
    setVehicles(prev => prev.map(v => (v.id === id ? { ...v, ...updates } : v)));
  };

  const deleteVehicle = (id: string) => {
    setVehicles(prev => prev.filter(v => v.id !== id));
  };

  const toggleVehicleStatus = (id: string) => {
    setVehicles(prev =>
      prev.map(v => {
        if (v.id === id) {
          const nextStatus = v.status === 'disponivel' ? 'vendido' : 'disponivel';
          return { ...v, status: nextStatus };
        }
        return v;
      })
    );
  };

  const toggleVehicleFeatured = (id: string) => {
    setVehicles(prev =>
      prev.map(v => (v.id === id ? { ...v, featured: !v.featured } : v))
    );
  };

  const updateStoreSettings = (updates: Partial<StoreSettings>) => {
    setSettings(prev => ({ ...prev, ...updates }));
  };

  const resetToDefaults = () => {
    setVehicles(INITIAL_VEHICLES);
    setSettings(INITIAL_SETTINGS);
    localStorage.removeItem(STORAGE_KEY_VEHICLES);
    localStorage.removeItem(STORAGE_KEY_SETTINGS);
  };

  // Format currency helper
  const formatBRL = (val: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const cleanPhone = (phone: string) => {
    const digits = phone.replace(/\D/g, '');
    if (digits.startsWith('55')) return digits;
    return `55${digits}`;
  };

  // Exact requested format:
  // "Olá! Vi o [Modelo do Carro] no site por [Valor] e quero saber mais."
  const getWhatsAppLink = (carTitle: string, carPrice: number, customNote?: string) => {
    const phone = cleanPhone(settings.whatsappNumber);
    const formattedPrice = formatBRL(carPrice);
    let message = `Olá! Vi o ${carTitle} no site por ${formattedPrice} e quero saber mais.`;
    if (customNote) {
      message += ` (${customNote})`;
    }
    return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  };

  const getGeneralWhatsAppLink = (message?: string) => {
    const phone = cleanPhone(settings.whatsappNumber);
    const defaultMsg = message || `Olá! Gostaria de falar com um vendedor da Gauchinho Veículos sobre o estoque.`;
    return `https://wa.me/${phone}?text=${encodeURIComponent(defaultMsg)}`;
  };

  const getFinancingWhatsAppLink = (
    carTitle: string,
    carPrice: number,
    downPayment: number,
    terms: number,
    monthlyEstimate: number
  ) => {
    const phone = cleanPhone(settings.whatsappNumber);
    const formattedPrice = formatBRL(carPrice);
    const formattedDown = formatBRL(downPayment);
    const formattedMonthly = formatBRL(monthlyEstimate);

    const message = `Olá! Tenho interesse em simular o financiamento do *${carTitle}* anunciado por *${formattedPrice}* no site da Gauchinho Veículos.\n\n• Entrada pretendida: ${formattedDown}\n• Prazo: ${terms}x de aproximadamente ${formattedMonthly}\n\nPoderiam analisar as condições para o meu CPF?`;
    return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  };

  return (
    <CatalogContext.Provider
      value={{
        vehicles,
        settings,
        addVehicle,
        updateVehicle,
        deleteVehicle,
        toggleVehicleStatus,
        toggleVehicleFeatured,
        updateStoreSettings,
        resetToDefaults,
        getWhatsAppLink,
        getGeneralWhatsAppLink,
        getFinancingWhatsAppLink,
      }}
    >
      {children}
    </CatalogContext.Provider>
  );
};

export const useCatalog = () => {
  const context = useContext(CatalogContext);
  if (!context) {
    throw new Error('useCatalog must be used within a CatalogProvider');
  }
  return context;
};
