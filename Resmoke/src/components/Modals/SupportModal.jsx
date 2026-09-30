import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';

const SupportModal = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    report_type: '',
    description: '',
    urgency: 'medium',
    contact_method: 'email'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validar que los campos requeridos estén completos
      if (!formData.report_type || !formData.description) {
        alert('Por favor, completa todos los campos requeridos.');
        setIsSubmitting(false);
        return;
      }

      const reportData = {
        report_type: formData.report_type,
        description: formData.description,
        urgency: formData.urgency,
        contact_method: formData.contact_method,
        user_email: user?.email || '',
        user_name: user?.user_metadata?.full_name || user?.email || '',
        status: 'pending'
      };

      const { data, error } = await supabase
        .from('suspicious_activity_reports')
        .insert([reportData]);

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      setSubmitSuccess(true);
      setTimeout(() => {
        setSubmitSuccess(false);
        onClose();
        setFormData({
          report_type: '',
          description: '',
          urgency: 'medium',
          contact_method: 'email'
        });
      }, 2000);

    } catch (error) {
      console.error('Error al enviar el reporte:', error);
      alert(`Error al enviar el reporte: ${error.message}. Por favor, inténtalo de nuevo.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Contactar Soporte</h2>
            <p className="text-gray-600 mt-1">Envíanos tu consulta y te responderemos pronto</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Success Message */}
        {submitSuccess && (
          <div className="p-6 bg-green-50 border-b border-green-200">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span className="text-green-800 font-medium">¡Reporte enviado exitosamente!</span>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Report Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de consulta *
            </label>
            <select
              name="report_type"
              value={formData.report_type}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="">Selecciona el tipo de consulta</option>
              <option value="technical_issue">Problema técnico</option>
              <option value="account_issue">Problema con la cuenta</option>
              <option value="payment_issue">Problema de pago</option>
              <option value="product_issue">Problema con producto</option>
              <option value="seller_issue">Problema con vendedor</option>
              <option value="general_inquiry">Consulta general</option>
              <option value="feature_request">Solicitud de función</option>
              <option value="other">Otro</option>
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descripción del problema *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              rows={4}
              placeholder="Describe detalladamente tu consulta o problema..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Urgency */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Urgencia
            </label>
            <select
              name="urgency"
              value={formData.urgency}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="low">Baja - No es urgente</option>
              <option value="medium">Media - Respuesta en 24-48h</option>
              <option value="high">Alta - Respuesta prioritaria</option>
            </select>
          </div>

          {/* Contact Method */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Método de contacto preferido
            </label>
            <select
              name="contact_method"
              value={formData.contact_method}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="email">Email</option>
              <option value="phone">Teléfono</option>
              <option value="platform">Plataforma</option>
            </select>
          </div>



          {/* User Info Display */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Información de contacto</h4>
            <p className="text-sm text-gray-600">Email: {user?.email}</p>
            <p className="text-sm text-gray-600">
              Nombre: {user?.user_metadata?.full_name || 'No especificado'}
            </p>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 bg-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Enviando...
                </>
              ) : (
                'Enviar Consulta'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SupportModal;