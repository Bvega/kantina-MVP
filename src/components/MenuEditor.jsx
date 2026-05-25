import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Plus, Trash2, Edit2, Check, X, RefreshCw, AlertCircle, ToggleLeft, ToggleRight } from 'lucide-react';

const categoryTranslations = {
  en: {
    'Tacos': 'Tacos',
    'Quesadillas': 'Quesadillas',
    'Gorditas': 'Gorditas',
    'Bebidas': 'Drinks',
    'Postres': 'Desserts',
    'Otros': 'Others'
  },
  es: {
    'Tacos': 'Tacos',
    'Quesadillas': 'Quesadillas',
    'Gorditas': 'Gorditas',
    'Bebidas': 'Bebidas',
    'Postres': 'Postres',
    'Otros': 'Otros'
  }
};

/**
 * MenuEditor component handles displaying, adding, editing, and deleting items.
 */
export default function MenuEditor({ menuItems, onSaveMenu }) {
  const { t, language } = useLanguage();
  const [items, setItems] = useState(menuItems);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Form states for adding
  const [newName, setNewName] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newCategory, setNewCategory] = useState('Tacos');
  const [newDesc, setNewDesc] = useState('');

  // Form states for editing
  const [editName, setEditName] = useState('');
  const [editPrice, setEditPrice] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [editDesc, setEditDesc] = useState('');

  const categories = ['Tacos', 'Quesadillas', 'Gorditas', 'Bebidas', 'Postres', 'Otros'];

  const getLocalizedCategory = (cat) => {
    return categoryTranslations[language]?.[cat] || cat;
  };

  const handleToggleAvailable = (itemId) => {
    const updated = items.map((item) => {
      if (item.id === itemId) {
        return { ...item, available: !item.available };
      }
      return item;
    });
    setItems(updated);
    onSaveMenu(updated);
  };

  const handleStartEdit = (item) => {
    setEditingId(item.id);
    setEditName(item.name);
    setEditPrice(item.price.toString());
    setEditCategory(item.category);
    setEditDesc(item.description || '');
  };

  const handleCancelEdit = () => {
    setEditingId(null);
  };

  const handleSaveEdit = (itemId) => {
    if (!editName.trim() || !editPrice.trim()) return;

    const updated = items.map((item) => {
      if (item.id === itemId) {
        return {
          ...item,
          name: editName.trim(),
          price: parseFloat(editPrice) || 0,
          category: editCategory,
          description: editDesc.trim()
        };
      }
      return item;
    });
    setItems(updated);
    onSaveMenu(updated);
    setEditingId(null);
  };

  const handleDeleteItem = (itemId) => {
    if (window.confirm(t('menu_confirm_delete'))) {
      const updated = items.filter((item) => item.id !== itemId);
      setItems(updated);
      onSaveMenu(updated);
    }
  };

  const handleAddItem = (e) => {
    e.preventDefault();
    if (!newName.trim() || !newPrice.trim()) return;

    const newItem = {
      id: `item-${Date.now()}`,
      name: newName.trim(),
      price: parseFloat(newPrice) || 0,
      category: newCategory,
      description: newDesc.trim(),
      available: true
    };

    const updated = [...items, newItem];
    setItems(updated);
    onSaveMenu(updated);

    // Reset Form
    setNewName('');
    setNewPrice('');
    setNewCategory('Tacos');
    setNewDesc('');
    setIsAdding(false);
  };

  return (
    <div className="space-y-6">
      {/* Header section with add action */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-gray-800">{t('menu_title')}</h2>
          <p className="text-sm text-gray-500">{t('menu_subtitle')}</p>
        </div>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className={`flex items-center px-4 py-2 rounded-lg font-bold text-sm transition-colors duration-150 ${
            isAdding 
              ? 'bg-gray-100 hover:bg-gray-200 text-gray-700' 
              : 'bg-orange-600 hover:bg-orange-700 text-white shadow-sm'
          }`}
        >
          {isAdding ? <X className="w-4 h-4 mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
          {isAdding ? t('menu_btn_close') : t('menu_btn_add')}
        </button>
      </div>

      {/* Add New Item Panel */}
      {isAdding && (
        <form onSubmit={handleAddItem} className="bg-orange-50/50 border border-orange-100 rounded-xl p-5 shadow-sm space-y-4">
          <h3 className="font-bold text-gray-800 text-base">{t('menu_form_new_title')}</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-gray-600 mb-1">{t('menu_form_name')}</label>
              <input
                type="text"
                required
                placeholder={t('menu_form_name_placeholder')}
                className="w-full px-3.5 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-orange-500 bg-white"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">{t('menu_form_price')}</label>
              <input
                type="number"
                required
                min="0"
                step="0.01"
                placeholder="0.00"
                className="w-full px-3.5 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-orange-500 bg-white"
                value={newPrice}
                onChange={(e) => setNewPrice(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">{t('menu_form_category')}</label>
              <select
                className="w-full px-3.5 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-orange-500 bg-white"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{getLocalizedCategory(cat)}</option>
                ))}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-gray-600 mb-1">{t('menu_form_description')}</label>
              <input
                type="text"
                placeholder={t('menu_form_desc_placeholder')}
                className="w-full px-3.5 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-orange-500 bg-white"
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm px-5 py-2 rounded-lg transition-colors"
            >
              {t('menu_form_save')}
            </button>
          </div>
        </form>
      )}

      {/* Menu list */}
      <div className="border border-gray-100 bg-white rounded-2xl shadow-sm divide-y divide-gray-100 overflow-hidden">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center text-gray-400">
            <AlertCircle className="w-10 h-10 mb-2 text-gray-300" />
            <p className="font-semibold">{t('menu_form_empty')}</p>
            <p className="text-xs mt-1">{t('menu_form_empty_desc')}</p>
          </div>
        ) : (
          items.map((item) => (
            <div key={item.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              {editingId === item.id ? (
                /* Editing Mode UI */
                <div className="flex-1 space-y-3">
                  <h3 className="font-bold text-gray-800 text-sm">{t('menu_form_edit_title')}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <input
                      type="text"
                      className="px-3 py-1.5 border border-orange-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-orange-500 bg-white"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                    />
                    <input
                      type="number"
                      className="px-3 py-1.5 border border-orange-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-orange-500 bg-white"
                      value={editPrice}
                      onChange={(e) => setEditPrice(e.target.value)}
                    />
                    <select
                      className="px-3 py-1.5 border border-orange-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-orange-500 bg-white"
                      value={editCategory}
                      onChange={(e) => setEditCategory(e.target.value)}
                    >
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>{getLocalizedCategory(cat)}</option>
                      ))}
                    </select>
                  </div>
                  <input
                    type="text"
                    className="w-full px-3 py-1.5 border border-orange-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-orange-500 bg-white"
                    placeholder={t('menu_form_description')}
                    value={editDesc}
                    onChange={(e) => setEditDesc(e.target.value)}
                  />
                  <div className="flex justify-end gap-2 text-xs font-bold mt-1">
                    <button
                      onClick={handleCancelEdit}
                      className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg flex items-center"
                    >
                      <X className="w-3.5 h-3.5 mr-1" /> {t('menu_form_cancel')}
                    </button>
                    <button
                      onClick={() => handleSaveEdit(item.id)}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg flex items-center"
                    >
                      <Check className="w-3.5 h-3.5 mr-1" /> {t('menu_form_save')}
                    </button>
                  </div>
                </div>
              ) : (
                /* Standard Display Mode UI */
                <>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2.5">
                      <h4 className="font-bold text-gray-800 text-base">{item.name}</h4>
                      <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xxs font-semibold uppercase">
                        {getLocalizedCategory(item.category)}
                      </span>
                      {!item.available && (
                        <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded text-xxs font-bold">
                          {t('menu_sold_out')}
                        </span>
                      )}
                    </div>
                    {item.description && (
                      <p className="text-sm text-gray-500 font-medium">{item.description}</p>
                    )}
                  </div>

                  <div className="flex items-center gap-4 shrink-0 justify-between sm:justify-end">
                    <span className="text-lg font-black text-gray-900">${item.price.toFixed(2)}</span>
                    
                    <div className="flex items-center gap-2">
                      {/* Availability Toggle */}
                      <button
                        onClick={() => handleToggleAvailable(item.id)}
                        title={item.available ? t('menu_sold_out') : t('menu_available')}
                        className={`p-1.5 rounded-lg transition-colors ${
                          item.available ? 'text-emerald-600 hover:bg-emerald-50' : 'text-gray-400 hover:bg-gray-100'
                        }`}
                      >
                        {item.available ? (
                          <ToggleRight className="w-6 h-6" />
                        ) : (
                          <ToggleLeft className="w-6 h-6" />
                        )}
                      </button>

                      {/* Edit Button */}
                      <button
                        onClick={() => handleStartEdit(item)}
                        className="p-1.5 border border-gray-100 hover:bg-gray-50 text-gray-500 rounded-lg transition-colors"
                        title="Editar platillo"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>

                      {/* Delete Button */}
                      <button
                        onClick={() => handleDeleteItem(item.id)}
                        className="p-1.5 border border-red-100 hover:bg-red-50 text-red-500 rounded-lg transition-colors"
                        title="Eliminar platillo"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
