import React from 'react';
import { Trash2, X, AlertTriangle } from 'lucide-react';
import Button from './Button';

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, profileName }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-brand-black/40 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-sm rounded-xl shadow-2xl overflow-hidden border border-brand-brown/10 transform transition-all scale-100 animate-in zoom-in-95 duration-200">
                
                {/* Header */}
                <div className="bg-brand-cream/50 p-4 border-b border-brand-brown/5 flex justify-between items-center">
                    <h3 className="font-bold text-brand-espresso text-sm uppercase tracking-wider flex items-center gap-2">
                        <AlertTriangle size={18} className="text-red-500" /> Confirm Deletion
                    </h3>
                    <button onClick={onClose} className="text-brand-taupe hover:text-brand-coffee transition-colors cursor-pointer">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 text-center">
                    <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4 text-red-500">
                        <Trash2 size={28} />
                    </div>
                    
                    <h4 className="font-serif text-xl text-brand-espresso mb-2">Delete Profile?</h4>
                    <p className="text-brand-taupe text-sm mb-6 leading-relaxed">
                        Are you sure you want to remove <strong>{profileName}</strong>? <br/>
                        This action cannot be undone and all associated local data will be lost.
                    </p>

                    <div className="flex gap-3">
                        <button 
                            onClick={onClose}
                            className="flex-1 py-3 border border-brand-brown/20 rounded-md text-brand-coffee font-bold text-xs uppercase tracking-wider hover:bg-brand-cream/50 transition-colors cursor-pointer"
                        >
                            Cancel
                        </button>
                        <Button 
                            onClick={() => { onConfirm(); onClose(); }}
                            className="flex-1 py-3 bg-red-500 hover:bg-red-600 text-white border-red-500 hover:border-red-600 cursor-pointer shadow-md hover:shadow-lg"
                        >
                            Delete
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeleteConfirmationModal;
