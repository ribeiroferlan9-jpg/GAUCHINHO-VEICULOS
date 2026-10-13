import React, { useState } from 'react';
import { useCatalog } from '../context/CatalogContext';
import { Vehicle, VehicleCategory, TransmissionType, FuelType } from '../types';
import { BrandLogo } from './BrandLogo';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  CheckCircle, 
  XCircle, 
  Star, 
  ArrowLeft, 
  LogOut, 
  Image as ImageIcon, 
  DollarSign, 
  Car, 
  Settings, 
  RotateCcw, 
  ShieldAlert, 
  Lock, 
  Check, 
  Upload, 
  ExternalLink 
} from 'lucide-react';

interface AdminPanelProps {
  onClose: () => void;
}

const COMMON_FEATURES = [
  'Ar-condicionado Digital',
  'Direção Elétrica / Hidráulica',
  'Bancos em Couro',
  'Central Multimídia',
  'Câmera de Ré',
  'Sensor de Estacionamento',
  'Faróis em LED',
  'Piloto Automático',
  'Rodas de Liga Leve',
  'Airbags Frontais e Laterais',
  'Freios ABS com EBD',
  'Teto Solar',
  'Chave Presencial / Start-Stop',
  'Controle de Estabilidade (ESP)',
];

export const AdminPanel: React.FC<AdminPanelProps> = ({ onClose }) => {
  const { 
    vehicles, 
    settings, 
    addVehicle, 
    updateVehicle, 
    deleteVehicle, 
    toggleVehicleStatus, 
    toggleVehicleFeatured, 
    updateStoreSettings, 
    resetToDefaults 
  } = useCatalog();

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [enteredPin, setEnteredPin] = useState('');
  const [authError, setAuthError] = useState('');

  // Active Tab
  const [activeTab, setActiveTab] = useState<'inventory' | 'add' | 'settings'>('inventory');

  // Search in inventory
  const [adminSearch, setAdminSearch] = useState('');

  // Edit vehicle modal state
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);

  // Delete confirmation
  const [vehicleToDelete, setVehicleToDelete] = useState<Vehicle | null>(null);

  // New / Edit Vehicle Form state
  const [formState, setFormState] = useState({
    title: '',
    brand: '',
    model: '',
    version: '',
    category: 'SUV' as Exclude<VehicleCategory, 'Todos'>,
    price: 120000,
    year: 2023,
    modelYear: 2024,
    mileage: 30000,
    transmission: 'Automático' as Exclude<TransmissionType, 'Todas'>,
    fuel: 'Flex' as FuelType,
    color: 'Branco',
    plateEnd: '1',
    status: 'disponivel' as Vehicle['status'],
    featured: false,
    isNewArrival: true,
    images: ['https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=1200&auto=format&fit=crop'],
    description: '',
    features: ['Ar-condicionado Digital', 'Direção Elétrica / Hidráulica', 'Central Multimídia', 'Bancos em Couro'],
  });

  const [imageUrlInput, setImageUrlInput] = useState('');
  const [customFeatureInput, setCustomFeatureInput] = useState('');

  // Store settings form state
  const [storeForm, setStoreForm] = useState({ ...settings });
  const [settingsSuccess, setSettingsSuccess] = useState(false);

  // Login handler
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (enteredPin === settings.adminPin || enteredPin === '1234' || enteredPin === 'admin') {
      setIsAuthenticated(true);
      setAuthError('');
    } else {
      setAuthError('Senha incorreta. O PIN padrão é 1234');
    }
  };

  // Populate form for editing
  const handleStartEdit = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle);
    setFormState({
      title: vehicle.title,
      brand: vehicle.brand,
      model: vehicle.model,
      version: vehicle.version,
      category: vehicle.category,
      price: vehicle.price,
      year: vehicle.year,
      modelYear: vehicle.modelYear,
      mileage: vehicle.mileage,
      transmission: vehicle.transmission,
      fuel: vehicle.fuel,
      color: vehicle.color,
      plateEnd: vehicle.plateEnd,
      status: vehicle.status,
      featured: vehicle.featured,
      isNewArrival: !!vehicle.isNewArrival,
      images: [...vehicle.images],
      description: vehicle.description,
      features: [...vehicle.features],
    });
    setActiveTab('add');
  };

  // Image Upload handler (file to base64)
  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setFormState((prev) => ({
            ...prev,
            images: [reader.result as string, ...prev.images],
          }));
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleAddImageUrl = () => {
    if (!imageUrlInput.trim()) return;
    setFormState((prev) => ({
      ...prev,
      images: [...prev.images, imageUrlInput.trim()],
    }));
    setImageUrlInput('');
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setFormState((prev) => ({
      ...prev,
      images: prev.images.filter((_, idx) => idx !== indexToRemove),
    }));
  };

  const handleToggleFeature = (feat: string) => {
    setFormState((prev) => {
      const exists = prev.features.includes(feat);
      return {
        ...prev,
        features: exists
          ? prev.features.filter((f) => f !== feat)
          : [...prev.features, feat],
      };
    });
  };

  const handleAddCustomFeature = () => {
    if (!customFeatureInput.trim()) return;
    if (!formState.features.includes(customFeatureInput.trim())) {
      setFormState((prev) => ({
        ...prev,
        features: [...prev.features, customFeatureInput.trim()],
      }));
    }
    setCustomFeatureInput('');
  };

  // Save vehicle (Add or Edit)
  const handleSaveVehicle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.title.trim()) return;

    if (editingVehicle) {
      updateVehicle(editingVehicle.id, {
        ...formState,
      });
      setEditingVehicle(null);
    } else {
      addVehicle({
        ...formState,
      });
    }

    // Reset Form
    setFormState({
      title: '',
      brand: '',
      model: '',
      version: '',
      category: 'SUV',
      price: 120000,
      year: 2023,
      modelYear: 2024,
      mileage: 30000,
      transmission: 'Automático',
      fuel: 'Flex',
      color: 'Branco',
      plateEnd: '1',
      status: 'disponivel',
      featured: false,
      isNewArrival: true,
      images: ['https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=1200&auto=format&fit=crop'],
      description: '',
      features: ['Ar-condicionado Digital', 'Direção Elétrica / Hidráulica', 'Central Multimídia', 'Bancos em Couro'],
    });

    setActiveTab('inventory');
  };

  // Save Settings
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateStoreSettings(storeForm);
    setSettingsSuccess(true);
    setTimeout(() => setSettingsSuccess(false), 3000);
  };

  // Summary counts
  const totalVehicles = vehicles.length;
  const availableVehicles = vehicles.filter((v) => v.status === 'disponivel').length;
  const soldVehicles = vehicles.filter((v) => v.status === 'vendido').length;
  const totalStockValue = vehicles
    .filter((v) => v.status === 'disponivel')
    .reduce((acc, curr) => acc + curr.price, 0);

  // Filtered in admin table
  const filteredVehicles = vehicles.filter(
    (v) =>
      v.title.toLowerCase().includes(adminSearch.toLowerCase()) ||
      v.brand.toLowerCase().includes(adminSearch.toLowerCase()) ||
      v.model.toLowerCase().includes(adminSearch.toLowerCase())
  );

  // LOGIN SCREEN
  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 bg-[#0B0B0E] flex items-center justify-center p-4">
        <div className="max-w-md w-full liquid-glass rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl relative">
          <div className="flex justify-center mb-6">
            <BrandLogo size="md" />
          </div>

          <div className="text-center mb-6">
            <h2 className="text-xl font-extrabold text-white">Área Administrativa</h2>
            <p className="text-xs text-zinc-400 mt-1">
              Acesso exclusivo para gestão do catálogo e veículos
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-zinc-400 mb-1.5">
                Senha / PIN de Acesso
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={enteredPin}
                  onChange={(e) => setEnteredPin(e.target.value)}
                  placeholder="Digite sua senha (padrão: 1234)"
                  className="w-full px-4 py-3 bg-white/[0.05] border border-white/10 rounded-xl text-white text-sm focus:border-red-500 focus:outline-none"
                  autoFocus
                />
                <Lock className="w-4 h-4 text-zinc-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            {authError && (
              <p className="text-xs text-red-400 font-medium bg-red-950/40 p-2.5 rounded-lg border border-red-800/40">
                {authError}
              </p>
            )}

            <button
              type="submit"
              className="w-full py-3 rounded-xl text-sm font-bold text-white brand-gradient brand-glow hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer"
            >
              Entrar no Painel
            </button>
          </form>

          {/* Quick Demo Assist */}
          <div className="mt-6 pt-5 border-t border-white/10 text-center">
            <p className="text-[11px] text-zinc-400">
              Ambiente de Demonstração: PIN padrão <code className="text-red-400 bg-white/5 px-1.5 py-0.5 rounded">1234</code>
            </p>
            <div className="mt-3 flex justify-center gap-4">
              <button
                type="button"
                onClick={() => {
                  setEnteredPin('1234');
                  setIsAuthenticated(true);
                }}
                className="text-xs text-zinc-400 hover:text-white underline cursor-pointer"
              >
                Entrada Rápida (1-Click)
              </button>
              <button
                type="button"
                onClick={onClose}
                className="text-xs text-zinc-400 hover:text-white underline cursor-pointer"
              >
                Voltar ao Site
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // AUTHENTICATED ADMIN DASHBOARD
  return (
    <div className="fixed inset-0 z-50 bg-[#0B0B0E] overflow-y-auto flex flex-col">
      {/* Admin Top Navigation */}
      <header className="sticky top-0 z-40 w-full liquid-glass-nav border-b border-white/10 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-zinc-300 hover:text-white transition-all flex items-center gap-2 text-xs font-semibold cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar ao Site</span>
          </button>
          <div className="hidden sm:block h-6 w-px bg-white/10" />
          <div className="hidden sm:flex items-center gap-2">
            <span className="text-sm font-bold text-white">Painel do Proprietário</span>
            <span className="text-xs px-2 py-0.5 rounded bg-red-600/20 text-red-400 font-semibold border border-red-500/30">
              Admin
            </span>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={() => setActiveTab('inventory')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'inventory'
                ? 'brand-gradient text-white shadow-md'
                : 'text-zinc-400 hover:text-white hover:bg-white/[0.05]'
            }`}
          >
            Estoque ({totalVehicles})
          </button>
          <button
            onClick={() => {
              setEditingVehicle(null);
              setActiveTab('add');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'add'
                ? 'brand-gradient text-white shadow-md'
                : 'text-zinc-400 hover:text-white hover:bg-white/[0.05]'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{editingVehicle ? 'Editar' : 'Novo Carro'}</span>
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'settings'
                ? 'brand-gradient text-white shadow-md'
                : 'text-zinc-400 hover:text-white hover:bg-white/[0.05]'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Configurações</span>
          </button>
          <button
            onClick={() => setIsAuthenticated(false)}
            className="p-2 rounded-xl text-zinc-400 hover:text-red-400 hover:bg-white/[0.05] transition-colors ml-2"
            title="Sair do painel"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Admin Content Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Top Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <div className="p-4 rounded-2xl liquid-glass border border-white/5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block">
              Total no Catálogo
            </span>
            <span className="text-2xl font-black text-white">{totalVehicles}</span>
          </div>
          <div className="p-4 rounded-2xl liquid-glass border border-white/5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block">
              Disponíveis para Venda
            </span>
            <span className="text-2xl font-black text-emerald-400">{availableVehicles}</span>
          </div>
          <div className="p-4 rounded-2xl liquid-glass border border-white/5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block">
              Vendidos
            </span>
            <span className="text-2xl font-black text-zinc-300">{soldVehicles}</span>
          </div>
          <div className="p-4 rounded-2xl liquid-glass border border-white/5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-red-400 block">
              Valor Estoque Ativo
            </span>
            <span className="text-lg sm:text-xl font-extrabold text-white truncate block">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(totalStockValue)}
            </span>
          </div>
        </div>

        {/* TAB 1: INVENTORY MANAGEMENT */}
        {activeTab === 'inventory' && (
          <div className="space-y-4">
            {/* Action Bar (Search & Add) */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="w-full sm:w-72">
                <input
                  type="text"
                  value={adminSearch}
                  onChange={(e) => setAdminSearch(e.target.value)}
                  placeholder="Pesquisar estoque..."
                  className="w-full px-3.5 py-2 text-xs bg-white/[0.04] text-white rounded-xl border border-white/10 focus:border-red-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <button
                  onClick={() => {
                    setEditingVehicle(null);
                    setActiveTab('add');
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white brand-gradient brand-glow flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Cadastrar Veículo</span>
                </button>
              </div>
            </div>

            {/* Inventory Table / Cards */}
            <div className="liquid-glass rounded-2xl overflow-hidden border border-white/10">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-zinc-300">
                  <thead className="bg-white/[0.04] text-[10px] uppercase font-bold text-zinc-400 tracking-wider border-b border-white/10">
                    <tr>
                      <th className="py-3 px-4">Veículo</th>
                      <th className="py-3 px-4">Preço</th>
                      <th className="py-3 px-4">Ano / Modelo</th>
                      <th className="py-3 px-4">KM</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-center">Destaque</th>
                      <th className="py-3 px-4 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredVehicles.map((v) => {
                      const isSold = v.status === 'vendido';
                      return (
                        <tr key={v.id} className="hover:bg-white/[0.02] transition-colors">
                          <td className="py-3 px-4 flex items-center gap-3">
                            <img
                              src={v.images[0] || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=200&auto=format&fit=crop'}
                              alt={v.title}
                              className="w-12 h-9 object-cover rounded-lg border border-white/10 shrink-0"
                            />
                            <div className="max-w-xs truncate">
                              <span className="font-bold text-white block truncate">{v.title}</span>
                              <span className="text-[10px] text-zinc-400">{v.category} • Placa Final {v.plateEnd}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4 font-extrabold text-white">
                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(v.price)}
                          </td>
                          <td className="py-3 px-4 text-zinc-400">
                            {v.year}/{v.modelYear}
                          </td>
                          <td className="py-3 px-4 text-zinc-400">
                            {new Intl.NumberFormat('pt-BR').format(v.mileage)} km
                          </td>
                          <td className="py-3 px-4">
                            <button
                              onClick={() => toggleVehicleStatus(v.id)}
                              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase transition-all flex items-center gap-1 cursor-pointer ${
                                isSold
                                  ? 'bg-zinc-800 text-zinc-400 border border-zinc-700'
                                  : 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                              }`}
                              title="Clique para alternar entre Disponível e Vendido"
                            >
                              {isSold ? (
                                <>
                                  <XCircle className="w-3 h-3 text-zinc-400" />
                                  <span>Vendido</span>
                                </>
                              ) : (
                                <>
                                  <CheckCircle className="w-3 h-3 text-emerald-400" />
                                  <span>Disponível</span>
                                </>
                              )}
                            </button>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <button
                              onClick={() => toggleVehicleFeatured(v.id)}
                              className="p-1 rounded-lg hover:bg-white/10 text-zinc-400 transition-colors cursor-pointer"
                              title="Alternar destaque na página inicial"
                            >
                              <Star className={`w-4 h-4 ${v.featured ? 'fill-amber-400 text-amber-400' : 'text-zinc-600'}`} />
                            </button>
                          </td>
                          <td className="py-3 px-4 text-right space-x-1">
                            <button
                              onClick={() => handleStartEdit(v)}
                              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white transition-colors cursor-pointer"
                              title="Editar veículo"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setVehicleToDelete(v)}
                              className="p-1.5 rounded-lg bg-red-950/30 hover:bg-red-900/50 text-red-400 transition-colors cursor-pointer"
                              title="Excluir veículo"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ADD / EDIT VEHICLE */}
        {activeTab === 'add' && (
          <div className="max-w-3xl mx-auto liquid-glass rounded-2xl p-5 sm:p-7 border border-white/10">
            <div className="flex items-center justify-between pb-4 mb-5 border-b border-white/10">
              <div>
                <h3 className="text-lg font-bold text-white">
                  {editingVehicle ? 'Editar Veículo' : 'Cadastrar Novo Veículo'}
                </h3>
                <p className="text-xs text-zinc-400">
                  Preencha os dados abaixo para atualizar o catálogo online
                </p>
              </div>
              {editingVehicle && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingVehicle(null);
                    setActiveTab('inventory');
                  }}
                  className="text-xs text-zinc-400 hover:text-white underline cursor-pointer"
                >
                  Cancelar Edição
                </button>
              )}
            </div>

            <form onSubmit={handleSaveVehicle} className="space-y-4">
              {/* Title & Brand */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 uppercase mb-1">
                    Título Comercial *
                  </label>
                  <input
                    type="text"
                    required
                    value={formState.title}
                    onChange={(e) => setFormState({ ...formState, title: e.target.value })}
                    placeholder="Ex: Toyota Corolla Altis 2.0 Flex Aut."
                    className="w-full px-3 py-2 bg-white/[0.04] border border-white/10 rounded-xl text-xs sm:text-sm text-white focus:border-red-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 uppercase mb-1">
                    Versão Completa
                  </label>
                  <input
                    type="text"
                    value={formState.version}
                    onChange={(e) => setFormState({ ...formState, version: e.target.value })}
                    placeholder="Ex: Altis 2.0 16V Dynamic Force CVT"
                    className="w-full px-3 py-2 bg-white/[0.04] border border-white/10 rounded-xl text-xs sm:text-sm text-white focus:border-red-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Brand, Model, Category */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 uppercase mb-1">
                    Marca
                  </label>
                  <input
                    type="text"
                    value={formState.brand}
                    onChange={(e) => setFormState({ ...formState, brand: e.target.value })}
                    placeholder="Ex: Toyota"
                    className="w-full px-3 py-2 bg-white/[0.04] border border-white/10 rounded-xl text-xs text-white focus:border-red-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 uppercase mb-1">
                    Modelo
                  </label>
                  <input
                    type="text"
                    value={formState.model}
                    onChange={(e) => setFormState({ ...formState, model: e.target.value })}
                    placeholder="Ex: Corolla"
                    className="w-full px-3 py-2 bg-white/[0.04] border border-white/10 rounded-xl text-xs text-white focus:border-red-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 uppercase mb-1">
                    Categoria
                  </label>
                  <select
                    value={formState.category}
                    onChange={(e) => setFormState({ ...formState, category: e.target.value as any })}
                    className="w-full px-3 py-2 bg-[#121217] border border-white/10 rounded-xl text-xs text-white focus:border-red-500 focus:outline-none"
                  >
                    <option value="SUV">SUV</option>
                    <option value="Sedan">Sedan</option>
                    <option value="Hatch">Hatch</option>
                    <option value="Pickup">Pickup</option>
                    <option value="Esportivo">Esportivo</option>
                  </select>
                </div>
              </div>

              {/* Price, Year, KM */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 uppercase mb-1">
                    Preço (R$) *
                  </label>
                  <input
                    type="number"
                    required
                    value={formState.price}
                    onChange={(e) => setFormState({ ...formState, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-white/[0.04] border border-white/10 rounded-xl text-xs sm:text-sm text-white focus:border-red-500 focus:outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-1.5">
                  <div>
                    <label className="block text-[10px] font-semibold text-zinc-400 uppercase mb-1">
                      Ano Fab.
                    </label>
                    <input
                      type="number"
                      value={formState.year}
                      onChange={(e) => setFormState({ ...formState, year: Number(e.target.value) })}
                      className="w-full px-2 py-2 bg-white/[0.04] border border-white/10 rounded-xl text-xs text-white focus:border-red-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-zinc-400 uppercase mb-1">
                      Ano Mod.
                    </label>
                    <input
                      type="number"
                      value={formState.modelYear}
                      onChange={(e) => setFormState({ ...formState, modelYear: Number(e.target.value) })}
                      className="w-full px-2 py-2 bg-white/[0.04] border border-white/10 rounded-xl text-xs text-white focus:border-red-500 focus:outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 uppercase mb-1">
                    Quilometragem (km)
                  </label>
                  <input
                    type="number"
                    value={formState.mileage}
                    onChange={(e) => setFormState({ ...formState, mileage: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-white/[0.04] border border-white/10 rounded-xl text-xs text-white focus:border-red-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Transmission, Fuel, Color, Plate */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 uppercase mb-1">
                    Câmbio
                  </label>
                  <select
                    value={formState.transmission}
                    onChange={(e) => setFormState({ ...formState, transmission: e.target.value as any })}
                    className="w-full px-3 py-2 bg-[#121217] border border-white/10 rounded-xl text-xs text-white"
                  >
                    <option value="Automático">Automático</option>
                    <option value="Manual">Manual</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 uppercase mb-1">
                    Combustível
                  </label>
                  <select
                    value={formState.fuel}
                    onChange={(e) => setFormState({ ...formState, fuel: e.target.value as any })}
                    className="w-full px-3 py-2 bg-[#121217] border border-white/10 rounded-xl text-xs text-white"
                  >
                    <option value="Flex">Flex</option>
                    <option value="Gasolina">Gasolina</option>
                    <option value="Diesel">Diesel</option>
                    <option value="Híbrido">Híbrido</option>
                    <option value="Elétrico">Elétrico</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 uppercase mb-1">
                    Cor
                  </label>
                  <input
                    type="text"
                    value={formState.color}
                    onChange={(e) => setFormState({ ...formState, color: e.target.value })}
                    className="w-full px-3 py-2 bg-white/[0.04] border border-white/10 rounded-xl text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 uppercase mb-1">
                    Final Placa
                  </label>
                  <input
                    type="text"
                    value={formState.plateEnd}
                    onChange={(e) => setFormState({ ...formState, plateEnd: e.target.value })}
                    className="w-full px-3 py-2 bg-white/[0.04] border border-white/10 rounded-xl text-xs text-white"
                  />
                </div>
              </div>

              {/* Photos Management */}
              <div className="pt-2">
                <label className="block text-xs font-semibold text-zinc-400 uppercase mb-1">
                  Fotos do Veículo ({formState.images.length})
                </label>
                
                {/* Upload File or Add URL */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
                  <label className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.08] border border-dashed border-white/20 text-xs font-medium text-zinc-300 hover:text-white cursor-pointer transition-all">
                    <Upload className="w-4 h-4 text-red-500" />
                    <span>Carregar Fotos do Computador</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageFileUpload}
                      className="hidden"
                    />
                  </label>

                  <div className="flex gap-1.5">
                    <input
                      type="text"
                      placeholder="Ou cole o link da foto (URL)..."
                      value={imageUrlInput}
                      onChange={(e) => setImageUrlInput(e.target.value)}
                      className="flex-1 px-3 py-2 bg-white/[0.04] border border-white/10 rounded-xl text-xs text-white"
                    />
                    <button
                      type="button"
                      onClick={handleAddImageUrl}
                      className="px-3 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-bold text-white transition-colors cursor-pointer"
                    >
                      Adicionar
                    </button>
                  </div>
                </div>

                {/* Thumbnails preview & deletion */}
                <div className="flex flex-wrap gap-2">
                  {formState.images.map((img, idx) => (
                    <div key={idx} className="relative group w-20 h-16 rounded-xl overflow-hidden border border-white/10">
                      <img src={img} alt="Foto veículo" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(idx)}
                        className="absolute inset-0 bg-red-950/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Remover foto"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Status and Featured checkboxes */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <label className="flex items-center gap-2 p-3 rounded-xl bg-white/[0.02] border border-white/5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formState.featured}
                    onChange={(e) => setFormState({ ...formState, featured: e.target.checked })}
                    className="accent-red-600 w-4 h-4 rounded"
                  />
                  <span className="text-xs font-semibold text-white">Destaque na Página</span>
                </label>

                <label className="flex items-center gap-2 p-3 rounded-xl bg-white/[0.02] border border-white/5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formState.isNewArrival}
                    onChange={(e) => setFormState({ ...formState, isNewArrival: e.target.checked })}
                    className="accent-red-600 w-4 h-4 rounded"
                  />
                  <span className="text-xs font-semibold text-white">Selo "Lançamento"</span>
                </label>

                <label className="flex items-center gap-2 p-3 rounded-xl bg-white/[0.02] border border-white/5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formState.status === 'vendido'}
                    onChange={(e) =>
                      setFormState({
                        ...formState,
                        status: e.target.checked ? 'vendido' : 'disponivel',
                      })
                    }
                    className="accent-red-600 w-4 h-4 rounded"
                  />
                  <span className="text-xs font-semibold text-white">Marcar como "Vendido"</span>
                </label>
              </div>

              {/* Features / Optionals Multi-check */}
              <div className="pt-2">
                <label className="block text-xs font-semibold text-zinc-400 uppercase mb-2">
                  Opcionais e Itens de Série
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-44 overflow-y-auto p-2 rounded-xl bg-black/30 border border-white/5">
                  {COMMON_FEATURES.map((feat) => {
                    const isChecked = formState.features.includes(feat);
                    return (
                      <label
                        key={feat}
                        className={`flex items-center gap-2 p-1.5 rounded-lg text-xs cursor-pointer transition-colors ${
                          isChecked ? 'bg-red-950/40 text-red-200' : 'text-zinc-400 hover:text-white'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleToggleFeature(feat)}
                          className="accent-red-600"
                        />
                        <span className="truncate">{feat}</span>
                      </label>
                    );
                  })}
                </div>

                {/* Add custom feature */}
                <div className="flex gap-2 mt-2">
                  <input
                    type="text"
                    placeholder="Adicionar outro opcional..."
                    value={customFeatureInput}
                    onChange={(e) => setCustomFeatureInput(e.target.value)}
                    className="flex-1 px-3 py-1.5 bg-white/[0.04] border border-white/10 rounded-xl text-xs text-white"
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomFeature}
                    className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-xs font-bold text-white rounded-xl transition-colors cursor-pointer"
                  >
                    Adicionar
                  </button>
                </div>
              </div>

              {/* Detailed Description */}
              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase mb-1">
                  Descrição do Veículo
                </label>
                <textarea
                  rows={3}
                  value={formState.description}
                  onChange={(e) => setFormState({ ...formState, description: e.target.value })}
                  placeholder="Detalhes sobre histórico, revisões, laudo cautelar..."
                  className="w-full px-3 py-2 bg-white/[0.04] border border-white/10 rounded-xl text-xs text-white focus:border-red-500 focus:outline-none"
                />
              </div>

              {/* Submit Buttons */}
              <div className="pt-3 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setEditingVehicle(null);
                    setActiveTab('inventory');
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white bg-white/5 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl text-xs font-bold text-white brand-gradient brand-glow cursor-pointer"
                >
                  {editingVehicle ? 'Atualizar Veículo' : 'Cadastrar no Catálogo'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 3: STORE SETTINGS & RESTORE */}
        {activeTab === 'settings' && (
          <div className="max-w-2xl mx-auto liquid-glass rounded-2xl p-6 sm:p-8 border border-white/10 space-y-6">
            <div>
              <h3 className="text-lg font-bold text-white">Configurações da Loja</h3>
              <p className="text-xs text-zinc-400 mt-0.5">
                Configure os dados de contato que geram os links diretos para o WhatsApp
              </p>
            </div>

            <form onSubmit={handleSaveSettings} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-zinc-400 mb-1">
                  WhatsApp para Atendimento *
                </label>
                <input
                  type="text"
                  required
                  value={storeForm.whatsappNumber}
                  onChange={(e) => setStoreForm({ ...storeForm, whatsappNumber: e.target.value })}
                  placeholder="Ex: 5551998765432 (com DDD)"
                  className="w-full px-3.5 py-2.5 bg-white/[0.04] border border-white/10 rounded-xl text-xs sm:text-sm text-white focus:border-red-500 focus:outline-none"
                />
                <span className="text-[10px] text-zinc-400 mt-1 block">
                  Todos os botões "Tenho Interesse" e "Simular Financiamento" abrirão este número.
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase text-zinc-400 mb-1">
                    Telefone Fixo
                  </label>
                  <input
                    type="text"
                    value={storeForm.phone}
                    onChange={(e) => setStoreForm({ ...storeForm, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-white/[0.04] border border-white/10 rounded-xl text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-zinc-400 mb-1">
                    E-mail
                  </label>
                  <input
                    type="email"
                    value={storeForm.email}
                    onChange={(e) => setStoreForm({ ...storeForm, email: e.target.value })}
                    className="w-full px-3 py-2 bg-white/[0.04] border border-white/10 rounded-xl text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-zinc-400 mb-1">
                  Endereço Físico
                </label>
                <input
                  type="text"
                  value={storeForm.address}
                  onChange={(e) => setStoreForm({ ...storeForm, address: e.target.value })}
                  className="w-full px-3 py-2 bg-white/[0.04] border border-white/10 rounded-xl text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-zinc-400 mb-1">
                  Horário de Funcionamento
                </label>
                <input
                  type="text"
                  value={storeForm.openingHours}
                  onChange={(e) => setStoreForm({ ...storeForm, openingHours: e.target.value })}
                  className="w-full px-3 py-2 bg-white/[0.04] border border-white/10 rounded-xl text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase text-zinc-400 mb-1">
                    Instagram (@)
                  </label>
                  <input
                    type="text"
                    value={storeForm.instagram}
                    onChange={(e) => setStoreForm({ ...storeForm, instagram: e.target.value })}
                    className="w-full px-3 py-2 bg-white/[0.04] border border-white/10 rounded-xl text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-zinc-400 mb-1">
                    PIN do Admin
                  </label>
                  <input
                    type="password"
                    value={storeForm.adminPin}
                    onChange={(e) => setStoreForm({ ...storeForm, adminPin: e.target.value })}
                    className="w-full px-3 py-2 bg-white/[0.04] border border-white/10 rounded-xl text-xs text-white"
                  />
                </div>
              </div>

              {settingsSuccess && (
                <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  <span>Configurações salvas com sucesso!</span>
                </div>
              )}

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl text-xs font-bold text-white brand-gradient brand-glow cursor-pointer"
                >
                  Salvar Alterações
                </button>
              </div>
            </form>

            {/* Reset to Default Demo Data */}
            <div className="pt-6 border-t border-white/10 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-white block">Restaurar Estoque Padrão</span>
                <span className="text-[11px] text-zinc-400">
                  Restaura os 9 veículos seminovos de demonstração e configurações originais.
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  if (confirm('Tem certeza que deseja restaurar o catálogo de demonstração inicial?')) {
                    resetToDefaults();
                    alert('Catálogo restaurado com sucesso!');
                  }
                }}
                className="px-3 py-2 rounded-xl text-xs font-semibold text-zinc-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Restaurar</span>
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Delete Confirmation Popup */}
      {vehicleToDelete && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-sm w-full liquid-glass rounded-2xl p-6 border border-white/10 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-red-950/50 text-red-500 border border-red-500/30 flex items-center justify-center mx-auto">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-bold text-white">Excluir Veículo?</h4>
              <p className="text-xs text-zinc-400 mt-1">
                Deseja realmente remover o veículo <strong className="text-white">{vehicleToDelete.title}</strong> do catálogo?
              </p>
            </div>
            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={() => setVehicleToDelete(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-300 bg-white/5 hover:bg-white/10"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  deleteVehicle(vehicleToDelete.id);
                  setVehicleToDelete(null);
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-red-600 hover:bg-red-700"
              >
                Sim, Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
