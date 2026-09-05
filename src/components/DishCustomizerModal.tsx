import React, { useState } from 'react';
import { X, Flame, Plus, Minus, Check, Sparkles, ChefHat } from 'lucide-react';
import { MenuItem, CartCustomization } from '../types';

interface DishCustomizerModalProps {
  dish: MenuItem | null;
  restaurantId: string;
  restaurantName: string;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (dish: MenuItem, quantity: number, customization: CartCustomization, restaurantId: string, restaurantName: string) => void;
}

export const DishCustomizerModal: React.FC<DishCustomizerModalProps> = ({
  dish,
  restaurantId,
  restaurantName,
  isOpen,
  onClose,
  onAddToCart,
}) => {
  if (!isOpen || !dish) return null;

  const [quantity, setQuantity] = useState(1);
  const [spiceLevel, setSpiceLevel] = useState<'mild' | 'medium' | 'abakwa_hot'>(
    dish.spiciness === 'abakwa_hot' ? 'abakwa_hot' : dish.spiciness === 'medium' ? 'medium' : 'mild'
  );
  const [selectedSide, setSelectedSide] = useState<string>(
    dish.availableSides && dish.availableSides.length > 0 ? dish.availableSides[0] : ''
  );
  const [specialInstructions, setSpecialInstructions] = useState('');

  // Calculate side extra price if any
  const sidePriceMatch = selectedSide.match(/\+(\d+)\s*FCFA/i);
  const sideExtraFCFA = sidePriceMatch ? parseInt(sidePriceMatch[1], 10) : 0;
  const unitPrice = dish.priceFCFA + sideExtraFCFA;
  const totalPrice = unitPrice * quantity;

  const handleAdd = () => {
    onAddToCart(
      dish,
      quantity,
      {
        spiceLevel,
        selectedSide: selectedSide || undefined,
        specialInstructions: specialInstructions.trim() || undefined
      },
      restaurantId,
      restaurantName
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        id="dish-modal-container"
        className="relative w-full max-w-lg bg-neutral-900/90 backdrop-blur-2xl rounded-2xl shadow-2xl border border-white/15 overflow-hidden flex flex-col max-h-[90vh] text-white animate-in zoom-in-95 duration-200"
      >
        {/* Header with image */}
        <div className="relative h-48 sm:h-56 w-full bg-neutral-950">
          <img 
            src={dish.image} 
            alt={dish.name}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent"></div>

          <button
            id="btn-close-dish-modal"
            onClick={onClose}
            className="absolute top-3 right-3 w-9 h-9 rounded-full bg-black/60 backdrop-blur-md text-white/80 hover:text-white border border-white/20 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute bottom-3 left-4 right-4 text-white">
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded-full bg-orange-500 text-white text-[11px] font-bold uppercase tracking-wider shadow-sm">
                {dish.category}
              </span>
              <span className="text-xs text-white/70 flex items-center gap-1 font-medium">
                <ChefHat className="w-3.5 h-3.5 text-orange-400" /> {restaurantName}
              </span>
            </div>
            <h3 className="text-xl font-bold tracking-tight text-white leading-tight">
              {dish.name}
            </h3>
            {dish.localName && (
              <p className="text-xs text-orange-300 font-medium">
                {dish.localName}
              </p>
            )}
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="p-5 overflow-y-auto space-y-5">
          {/* Description */}
          <p className="text-sm text-white/70 leading-relaxed">
            {dish.description}
          </p>

          {/* Spice Level Selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-white/80 mb-2 flex items-center gap-1">
              <Flame className="w-4 h-4 text-rose-400" /> Choose Spice Level (Abakwa Heat)
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { level: 'mild' as const, label: 'Mild Spice', desc: 'Gentle warmth' },
                { level: 'medium' as const, label: 'Medium', desc: 'Authentic kick' },
                { level: 'abakwa_hot' as const, label: 'Abakwa Hot 🔥', desc: 'Fiery bush pepper' }
              ].map((item) => (
                <button
                  key={item.level}
                  type="button"
                  onClick={() => setSpiceLevel(item.level)}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    spiceLevel === item.level
                      ? 'border-orange-500 bg-orange-500/20 text-white ring-1 ring-orange-500/40'
                      : 'border-white/10 hover:border-white/20 text-white/80 bg-white/5'
                  }`}
                >
                  <div className="font-semibold text-xs flex items-center justify-between">
                    <span>{item.label}</span>
                    {spiceLevel === item.level && <Check className="w-3.5 h-3.5 text-orange-400" />}
                  </div>
                  <span className="text-[10px] text-white/50">{item.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Available Sides / Add-ons */}
          {dish.availableSides && dish.availableSides.length > 0 && (
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-white/80 mb-2">
                Authentic Bamenda Sides & Add-ons
              </label>
              <div className="space-y-1.5">
                {dish.availableSides.map((side) => (
                  <button
                    key={side}
                    type="button"
                    onClick={() => setSelectedSide(side === selectedSide ? '' : side)}
                    className={`w-full px-3 py-2 rounded-xl border text-left text-xs font-medium flex items-center justify-between transition-all ${
                      selectedSide === side
                        ? 'border-emerald-500 bg-emerald-500/20 text-emerald-300 font-semibold ring-1 ring-emerald-500/30'
                        : 'border-white/10 hover:border-white/20 text-white/80 bg-white/5'
                    }`}
                  >
                    <span>{side}</span>
                    {selectedSide === side ? (
                      <span className="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px]">
                        ✓
                      </span>
                    ) : (
                      <span className="text-white/40 text-[10px]">+ select</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Special Preparation Instructions */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-white/80 mb-1.5">
              Special Kitchen Notes / Instructions
            </label>
            <textarea
              rows={2}
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              placeholder="e.g., Separate yellow soup into clean container, extra fried plantains well browned, etc."
              className="w-full px-3 py-2 text-xs bg-white/5 border border-white/15 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 placeholder:text-white/40"
            />
          </div>
        </div>

        {/* Footer with Quantity & Price Button */}
        <div className="p-4 bg-black/40 backdrop-blur-md border-t border-white/10 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 bg-white/10 px-2.5 py-1.5 rounded-xl border border-white/15 shadow-sm text-white">
            <button
              id="btn-decrease-qty"
              type="button"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-7 h-7 rounded-lg text-white/70 hover:text-white hover:bg-white/10 flex items-center justify-center disabled:opacity-30"
              disabled={quantity <= 1}
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="w-6 text-center font-bold text-sm text-white">
              {quantity}
            </span>
            <button
              id="btn-increase-qty"
              type="button"
              onClick={() => setQuantity(quantity + 1)}
              className="w-7 h-7 rounded-lg text-white/70 hover:text-white hover:bg-white/10 flex items-center justify-center"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            id="btn-confirm-add-cart"
            type="button"
            onClick={handleAdd}
            className="flex-1 py-2.5 px-4 bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white rounded-xl font-bold text-sm shadow-lg shadow-orange-500/25 transition-all flex items-center justify-between"
          >
            <span>Add to Bamenda Feast</span>
            <span className="font-mono bg-black/30 px-2 py-0.5 rounded-md text-xs font-semibold">
              {totalPrice.toLocaleString()} FCFA
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
