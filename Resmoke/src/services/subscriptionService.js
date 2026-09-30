import { supabase } from '../lib/supabase';

export class SubscriptionService {
  // Verificar si un usuario es premium
  static async isUserPremium(userId) {
    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'active')
        .eq('plan_type', 'premium')
        .gte('current_period_end', new Date().toISOString())
        .order('current_period_end', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        throw error;
      }

      return !!data;
    } catch (error) {
      console.error('Error verificando estado premium:', error);
      return false;
    }
  }

  // Obtener suscripción activa del usuario
  static async getUserSubscription(userId) {
    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'active')
        .order('current_period_end', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error obteniendo suscripción:', error);
      return null;
    }
  }

  // Crear nueva suscripción
  static async createSubscription(subscriptionData) {
    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .insert(subscriptionData)
        .select()
        .single();

      if (error) throw error;

      // Crear contador de promociones para el usuario si no existe
      await this.initializePromotionCounter(subscriptionData.user_id);

      return data;
    } catch (error) {
      console.error('Error creando suscripción:', error);
      throw error;
    }
  }

  // Actualizar suscripción
  static async updateSubscription(subscriptionId, updateData) {
    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .update(updateData)
        .eq('id', subscriptionId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error actualizando suscripción:', error);
      throw error;
    }
  }

  // Cancelar suscripción
  static async cancelSubscription(userId) {
    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .update({
          status: 'cancelled',
          cancelled_at: new Date().toISOString(),
          cancel_at_period_end: true
        })
        .eq('user_id', userId)
        .eq('status', 'active')
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error cancelando suscripción:', error);
      throw error;
    }
  }

  // Inicializar contador de promociones
  static async initializePromotionCounter(userId) {
    try {
      const { data, error } = await supabase
        .from('user_promotion_counters')
        .upsert({
          user_id: userId,
          free_promotions_used: 0,
          free_promotions_limit: 10,
          reset_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 días
        })
        .select()
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error inicializando contador de promociones:', error);
      throw error;
    }
  }

  // Obtener promociones disponibles
  static async getAvailableFreePromotions(userId) {
    try {
      // Verificar si es premium
      const isPremium = await this.isUserPremium(userId);
      if (!isPremium) return 0;

      const { data, error } = await supabase
        .from('user_promotion_counters')
        .select('*')
        .eq('user_id', userId)
        .limit(1)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (!data) {
        // Crear contador si no existe
        await this.initializePromotionCounter(userId);
        return 10; // Límite inicial
      }

      // Verificar si necesita reset mensual
      const resetDate = new Date(data.reset_date);
      const now = new Date();

      if (resetDate <= now) {
        // Reset mensual
        const { data: updatedData, error: updateError } = await supabase
          .from('user_promotion_counters')
          .update({
            free_promotions_used: 0,
            reset_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
          })
          .eq('user_id', userId)
          .select()
          .limit(1)
          .maybeSingle();

        if (updateError) throw updateError;
        return updatedData.free_promotions_limit;
      }

      return Math.max(0, data.free_promotions_limit - data.free_promotions_used);
    } catch (error) {
      console.error('Error obteniendo promociones disponibles:', error);
      return 0;
    }
  }

  // Usar promoción gratuita
  static async useFreePromotion(userId, productId) {
    try {
      // Verificar si es premium
      const isPremium = await this.isUserPremium(userId);
      if (!isPremium) {
        throw new Error('Usuario no es premium');
      }

      // Verificar promociones disponibles
      const availablePromotions = await this.getAvailableFreePromotions(userId);
      if (availablePromotions <= 0) {
        throw new Error('No hay promociones gratuitas disponibles');
      }

      // Crear la promoción
      const { data: promotion, error: promotionError } = await supabase
        .from('promotions')
        .insert({
          user_id: userId,
          product_id: productId,
          type: 'premium_free',
          status: 'active',
          expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 días
        })
        .select()
        .limit(1)
        .maybeSingle();

      if (promotionError) throw promotionError;

      // Incrementar contador de promociones usadas
      const { data: counter } = await supabase
        .from('user_promotion_counters')
        .select('free_promotions_used')
        .eq('user_id', userId)
        .limit(1)
        .maybeSingle();

      const { error: counterError } = await supabase
        .from('user_promotion_counters')
        .update({
          free_promotions_used: Number(counter?.free_promotions_used || 0) + 1
        })
        .eq('user_id', userId);

      if (counterError) throw counterError;

      return promotion;
    } catch (error) {
      console.error('Error usando promoción gratuita:', error);
      throw error;
    }
  }

  // Obtener promociones del usuario
  static async getUserPromotions(userId) {
    try {
      const { data, error } = await supabase
        .from('promotions')
        .select(`
          *,
          products (
            id,
            name,
            price,
            main_image
          )
        `)
        .eq('user_id', userId)
        .eq('status', 'active')
        .gte('expires_at', new Date().toISOString())
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error obteniendo promociones del usuario:', error);
      return [];
    }
  }

  // Obtener estadísticas de suscripción
  static async getSubscriptionStats(userId) {
    try {
      const [subscription, promotionCounter, activePromotions] = await Promise.all([
        this.getUserSubscription(userId),
        supabase.from('user_promotion_counters').select('*').eq('user_id', userId).limit(1).maybeSingle(),
        this.getUserPromotions(userId)
      ]);

      const isPremium = await this.isUserPremium(userId);
      const availablePromotions = await this.getAvailableFreePromotions(userId);

      return {
        isPremium,
        subscription,
        availablePromotions,
        usedPromotions: promotionCounter.data?.free_promotions_used || 0,
        totalPromotions: promotionCounter.data?.free_promotions_limit || 10,
        activePromotions: activePromotions.length,
        resetDate: promotionCounter.data?.reset_date
      };
    } catch (error) {
      console.error('Error obteniendo estadísticas de suscripción:', error);
      return {
        isPremium: false,
        subscription: null,
        availablePromotions: 0,
        usedPromotions: 0,
        totalPromotions: 10,
        activePromotions: 0,
        resetDate: null
      };
    }
  }
}
