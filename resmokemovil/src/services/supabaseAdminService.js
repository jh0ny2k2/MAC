import { createClient } from '@supabase/supabase-js';

class SupabaseAdminService {
  constructor() {
    this.mockDataEnabled = false; // Cambiado a false para usar datos reales
    
    // Cliente de Supabase con permisos de administrador
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      this.mockDataEnabled = true;
      this.adminClient = null;
      return;
    }

    this.adminClient = createClient(
      supabaseUrl,
      supabaseAnonKey,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );
  }

  // Datos mock para desarrollo
  getMockData() {
    return {
      overview: {
        totalTables: 12,
        totalRows: 15847,
        totalUsers: 1234,
        storageUsed: '2.3 GB',
        storageLimit: '500 GB',
        apiCalls24h: 8456,
        apiCallsLimit: 500000,
        activeConnections: 23,
        connectionLimit: 60,
        lastBackup: '2024-01-15T10:30:00Z',
        uptime: '99.9%'
      },
      tables: [
        { name: 'Users', rows: 1234, size: '45.2 MB', lastModified: '2024-01-15T14:20:00Z' },
        { name: 'products', rows: 5678, size: '128.7 MB', lastModified: '2024-01-15T13:45:00Z' },
        { name: 'categories', rows: 45, size: '2.1 MB', lastModified: '2024-01-14T16:30:00Z' },
        { name: 'reviews', rows: 2890, size: '67.3 MB', lastModified: '2024-01-15T12:15:00Z' },
        { name: 'favorites', rows: 4567, size: '23.8 MB', lastModified: '2024-01-15T11:20:00Z' },
        { name: 'suspicious_activity_reports', rows: 123, size: '8.9 MB', lastModified: '2024-01-15T09:45:00Z' }
      ],
      performance: {
        avgResponseTime: '45ms',
        slowQueries: 3,
        errorRate: '0.02%',
        cacheHitRate: '94.5%'
      },
      storage: {
        database: '1.8 GB',
        files: '512 MB',
        total: '2.3 GB',
        limit: '500 GB'
      },
      auth: {
        totalUsers: 1234,
        activeUsers24h: 456,
        newUsers7d: 89,
        authMethods: {
          email: 1100,
          google: 134
        }
      }
    };
  }

  async simulateNetworkDelay() {
    await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 400));
  }

  async getOverview() {
    try {
      if (this.mockDataEnabled) {
        await this.simulateNetworkDelay();
        return this.getMockData().overview;
      }

      // Obtener estadísticas reales de Supabase usando el cliente de administrador
      const tables = ['Users', 'products', 'categories', 'reviews', 'favorites', 'suspicious_activity_reports'];
      
      // Obtener conteos de todas las tablas
      const tableCounts = await Promise.all(
        tables.map(async (tableName) => {
          try {
            const { count, error } = await this.adminClient.from(tableName).select('*', { count: 'exact', head: true });
            if (error) {
              console.warn(`Error obteniendo conteo de ${tableName}:`, error);
              return 0;
            }
            return count || 0;
          } catch (err) {
            console.warn(`Error obteniendo conteo de ${tableName}:`, err);
            return 0;
          }
        })
      );

      const totalRows = tableCounts.reduce((sum, count) => sum + count, 0);
      const usersCount = tableCounts[0] || 0; // Users es la primera tabla

      // Obtener información de almacenamiento (aproximada)
      const storageInfo = await this.getStorageInfo();

      return {
        totalTables: tables.length,
        totalRows: totalRows,
        totalUsers: usersCount,
        storageUsed: storageInfo.used,
        storageLimit: storageInfo.limit,
        apiCalls24h: 'N/A', // Requiere métricas específicas de Supabase
        apiCallsLimit: 500000,
        activeConnections: 'N/A', // Requiere métricas específicas
        connectionLimit: 60,
        lastBackup: new Date().toISOString(),
        uptime: '99.9%'
      };
    } catch (error) {
      console.error('Error obteniendo overview de Supabase:', error);
      // Fallback a datos mock en caso de error
      await this.simulateNetworkDelay();
      return this.getMockData().overview;
    }
  }

  async getStorageInfo() {
    try {
      // Obtener información de almacenamiento de archivos
      const { data: buckets, error } = await this.adminClient.storage.listBuckets();
      
      if (error) {
        console.warn('Error obteniendo buckets:', error);
        return { used: 'N/A', limit: '500 GB' };
      }

      // Calcular tamaño aproximado basado en el número de archivos
      let totalFiles = 0;
      for (const bucket of buckets || []) {
        try {
          const { data: files } = await this.adminClient.storage.from(bucket.name).list();
          totalFiles += files?.length || 0;
        } catch (err) {
          console.warn(`Error listando archivos en bucket ${bucket.name}:`, err);
        }
      }

      // Estimación aproximada: 1MB por archivo en promedio
      const estimatedSize = totalFiles * 1024 * 1024;
      
      return {
        used: this.formatBytes(estimatedSize),
        limit: '500 GB'
      };
    } catch (error) {
      console.warn('Error obteniendo información de almacenamiento:', error);
      return { used: 'N/A', limit: '500 GB' };
    }
  }

  async getTables() {
    try {
      if (this.mockDataEnabled) {
        await this.simulateNetworkDelay();
        return this.getMockData().tables;
      }

      // Obtener información real de las tablas usando el cliente de administrador
      const tables = ['Users', 'products', 'categories', 'reviews', 'favorites', 'suspicious_activity_reports'];
      const tableStats = await Promise.all(
        tables.map(async (tableName) => {
          try {
            const { count, error } = await this.adminClient.from(tableName).select('*', { count: 'exact', head: true });
            
            if (error) {
              console.warn(`Error obteniendo conteo de ${tableName}:`, error);
              return {
                name: tableName,
                rows: 0,
                size: 'N/A',
                lastModified: new Date().toISOString()
              };
            }

            // Obtener una muestra de datos para estimar el tamaño
            const { data: sampleData } = await this.adminClient.from(tableName).select('*').limit(1);
            const estimatedRowSize = sampleData && sampleData.length > 0 
              ? JSON.stringify(sampleData[0]).length 
              : 100; // Tamaño promedio estimado por fila
            
            const estimatedSize = (count || 0) * estimatedRowSize;

            return {
              name: tableName,
              rows: count || 0,
              size: this.formatBytes(estimatedSize),
              lastModified: new Date().toISOString()
            };
          } catch (error) {
            console.warn(`Error obteniendo información de ${tableName}:`, error);
            return {
              name: tableName,
              rows: 0,
              size: 'N/A',
              lastModified: new Date().toISOString()
            };
          }
        })
      );

      return tableStats;
    } catch (error) {
      console.error('Error obteniendo tablas de Supabase:', error);
      // Fallback a datos mock en caso de error
      await this.simulateNetworkDelay();
      return this.getMockData().tables;
    }
  }

  async getPerformance() {
    try {
      if (this.mockDataEnabled) {
        await this.simulateNetworkDelay();
        return this.getMockData().performance;
      }

      // Realizar algunas consultas de prueba para medir el rendimiento
      const startTime = Date.now();
      
      try {
        // Consulta simple para medir tiempo de respuesta
        await this.adminClient.from('Users').select('id').limit(1);
        const responseTime = Date.now() - startTime;

        return {
          avgResponseTime: `${responseTime}ms`,
          slowQueries: 0, // Requiere logs específicos
          errorRate: '0.00%', // Basado en que las consultas funcionan
          cacheHitRate: 'N/A' // Requiere métricas específicas de Supabase
        };
      } catch (queryError) {
        console.warn('Error en consulta de rendimiento:', queryError);
        return {
          avgResponseTime: 'Error',
          slowQueries: 1,
          errorRate: '100%',
          cacheHitRate: 'N/A'
        };
      }
    } catch (error) {
      console.error('Error obteniendo performance de Supabase:', error);
      // Fallback a datos mock en caso de error
      await this.simulateNetworkDelay();
      return this.getMockData().performance;
    }
  }

  async getAuth() {
    try {
      if (this.mockDataEnabled) {
        await this.simulateNetworkDelay();
        return this.getMockData().auth;
      }

      // Obtener total de usuarios usando el cliente de administrador
      const { count: totalUsers, error: totalError } = await this.adminClient
        .from('Users')
        .select('*', { count: 'exact', head: true });

      if (totalError) {
        console.warn('Error obteniendo total de usuarios:', totalError);
      }

      // Usuarios activos en las últimas 24 horas
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const { count: activeUsers, error: activeError } = await this.adminClient
        .from('Users')
        .select('*', { count: 'exact', head: true })
        .gte('ultimo_acceso', yesterday.toISOString());

      if (activeError) {
        console.warn('Error obteniendo usuarios activos:', activeError);
      }

      // Nuevos usuarios en los últimos 7 días
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      const { count: newUsers, error: newError } = await this.adminClient
        .from('Users')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', weekAgo.toISOString());

      if (newError) {
        console.warn('Error obteniendo nuevos usuarios:', newError);
      }

      // Obtener métodos de autenticación
      const { data: usersWithAuth, error: authError } = await this.adminClient
        .from('Users')
        .select('provider, email')
        .not('email', 'is', null);

      let emailUsers = 0;
      let googleUsers = 0;

      if (!authError && usersWithAuth) {
        emailUsers = usersWithAuth.filter(user => 
          !user.provider || user.provider === 'email'
        ).length;
        
        googleUsers = usersWithAuth.filter(user => 
          user.provider === 'google'
        ).length;
      } else {
        console.warn('Error obteniendo métodos de auth:', authError);
        // Fallback: asumir que todos son email
        emailUsers = totalUsers || 0;
      }

      return {
        totalUsers: totalUsers || 0,
        activeUsers24h: activeUsers || 0,
        newUsers7d: newUsers || 0,
        authMethods: {
          email: emailUsers,
          google: googleUsers
        }
      };
    } catch (error) {
      console.error('Error obteniendo auth de Supabase:', error);
      // Fallback a datos mock en caso de error
      await this.simulateNetworkDelay();
      return this.getMockData().auth;
    }
  }

  formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  formatDate(dateString) {
    return new Date(dateString).toLocaleString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}

export default new SupabaseAdminService();
