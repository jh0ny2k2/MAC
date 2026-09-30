class NetlifyAdminService {
  constructor() {
    this.mockDataEnabled = true;
    this.siteId = import.meta.env.VITE_NETLIFY_SITE_ID || 'mock-site-id';
    this.apiToken = import.meta.env.VITE_NETLIFY_API_TOKEN;
  }

  // Datos mock para desarrollo
  getMockData() {
    return {
      overview: {
        siteName: 'Resmoke Marketplace',
        siteId: 'resmoke-marketplace-123',
        url: 'https://resmoke-marketplace.netlify.app',
        status: 'published',
        lastDeploy: '2024-01-15T14:30:00Z',
        deployTime: '2m 34s',
        totalDeploys: 156,
        bandwidth30d: '45.2 GB',
        bandwidthLimit: '100 GB',
        buildMinutes30d: 234,
        buildMinutesLimit: 300,
        formSubmissions30d: 89,
        functions: {
          total: 7,
          invocations30d: 12456,
          runtime: '2.3 hours'
        }
      },
      deployments: [
        {
          id: 'deploy-123',
          state: 'ready',
          branch: 'main',
          commitSha: 'abc123def',
          commitMessage: 'Fix: Actualizar componente de Stripe',
          createdAt: '2024-01-15T14:30:00Z',
          deployTime: '2m 34s',
          deployUrl: 'https://deploy-123--resmoke.netlify.app'
        },
        {
          id: 'deploy-122',
          state: 'ready',
          branch: 'main',
          commitSha: 'def456ghi',
          commitMessage: 'Feature: Agregar dashboard de administración',
          createdAt: '2024-01-15T12:15:00Z',
          deployTime: '2m 18s',
          deployUrl: 'https://deploy-122--resmoke.netlify.app'
        },
        {
          id: 'deploy-121',
          state: 'ready',
          branch: 'main',
          commitSha: 'ghi789jkl',
          commitMessage: 'Update: Mejorar UI de productos',
          createdAt: '2024-01-15T10:45:00Z',
          deployTime: '2m 42s',
          deployUrl: 'https://deploy-121--resmoke.netlify.app'
        }
      ],
      functions: [
        {
          name: 'stripe-admin-data',
          invocations30d: 3456,
          runtime30d: '45m 23s',
          errors30d: 12,
          avgDuration: '234ms'
        },
        {
          name: 'create-checkout-session',
          invocations30d: 2890,
          runtime30d: '38m 12s',
          errors30d: 5,
          avgDuration: '189ms'
        },
        {
          name: 'stripe-webhook',
          invocations30d: 1234,
          runtime30d: '15m 45s',
          errors30d: 2,
          avgDuration: '156ms'
        },
        {
          name: 'process-subscription',
          invocations30d: 567,
          runtime30d: '8m 34s',
          errors30d: 1,
          avgDuration: '298ms'
        }
      ],
      analytics: {
        pageViews30d: 45678,
        uniqueVisitors30d: 12345,
        topPages: [
          { path: '/', views: 8901, uniqueVisitors: 3456 },
          { path: '/productos', views: 6789, uniqueVisitors: 2345 },
          { path: '/categorias', views: 4567, uniqueVisitors: 1789 },
          { path: '/perfil', views: 3456, uniqueVisitors: 1234 }
        ],
        countries: [
          { country: 'España', visitors: 5678 },
          { country: 'México', visitors: 3456 },
          { country: 'Argentina', visitors: 2345 },
          { country: 'Colombia', visitors: 1234 }
        ]
      },
      performance: {
        lighthouse: {
          performance: 92,
          accessibility: 95,
          bestPractices: 88,
          seo: 94
        },
        coreWebVitals: {
          lcp: '1.2s',
          fid: '45ms',
          cls: '0.08'
        },
        uptime30d: '99.8%',
        avgResponseTime: '245ms'
      }
    };
  }

  async simulateNetworkDelay() {
    await new Promise(resolve => setTimeout(resolve, 600 + Math.random() * 400));
  }

  async fetchNetlifyAPI(endpoint) {
    if (!this.apiToken) {
      throw new Error('Netlify API token no configurado');
    }

    const response = await fetch(`https://api.netlify.com/api/v1${endpoint}`, {
      headers: {
        'Authorization': `Bearer ${this.apiToken}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Error de API de Netlify: ${response.status}`);
    }

    return response.json();
  }

  async getOverview() {
    try {
      if (this.mockDataEnabled || !this.apiToken) {
        await this.simulateNetworkDelay();
        return this.getMockData().overview;
      }

      const [site, deploys] = await Promise.all([
        this.fetchNetlifyAPI(`/sites/${this.siteId}`),
        this.fetchNetlifyAPI(`/sites/${this.siteId}/deploys?per_page=1`)
      ]);

      const lastDeploy = deploys[0];

      return {
        siteName: site.name,
        siteId: site.id,
        url: site.url,
        status: site.published_deploy ? 'published' : 'draft',
        lastDeploy: lastDeploy?.created_at,
        deployTime: this.calculateDeployTime(lastDeploy),
        totalDeploys: site.deploy_count || 0,
        bandwidth30d: 'N/A', // Requiere plan Pro
        functions: {
          total: site.functions?.length || 0,
          invocations30d: 'N/A',
          runtime: 'N/A'
        }
      };
    } catch (error) {
      console.error('Error obteniendo overview de Netlify:', error);
      if (this.mockDataEnabled) {
        await this.simulateNetworkDelay();
        return this.getMockData().overview;
      }
      throw error;
    }
  }

  async getDeployments() {
    try {
      if (this.mockDataEnabled || !this.apiToken) {
        await this.simulateNetworkDelay();
        return this.getMockData().deployments;
      }

      const deploys = await this.fetchNetlifyAPI(`/sites/${this.siteId}/deploys?per_page=10`);

      return deploys.map(deploy => ({
        id: deploy.id,
        state: deploy.state,
        branch: deploy.branch,
        commitSha: deploy.commit_ref?.substring(0, 7),
        commitMessage: deploy.title || 'Sin mensaje',
        createdAt: deploy.created_at,
        deployTime: this.calculateDeployTime(deploy),
        deployUrl: deploy.deploy_ssl_url
      }));
    } catch (error) {
      console.error('Error obteniendo deployments de Netlify:', error);
      if (this.mockDataEnabled) {
        await this.simulateNetworkDelay();
        return this.getMockData().deployments;
      }
      throw error;
    }
  }

  async getFunctions() {
    try {
      if (this.mockDataEnabled || !this.apiToken) {
        await this.simulateNetworkDelay();
        return this.getMockData().functions;
      }

      // Las métricas de funciones requieren plan Pro
      return [];
    } catch (error) {
      console.error('Error obteniendo funciones de Netlify:', error);
      if (this.mockDataEnabled) {
        await this.simulateNetworkDelay();
        return this.getMockData().functions;
      }
      throw error;
    }
  }

  async getAnalytics() {
    try {
      if (this.mockDataEnabled || !this.apiToken) {
        await this.simulateNetworkDelay();
        return this.getMockData().analytics;
      }

      // Analytics requiere plan Pro
      return {
        pageViews30d: 'N/A',
        uniqueVisitors30d: 'N/A',
        topPages: [],
        countries: []
      };
    } catch (error) {
      console.error('Error obteniendo analytics de Netlify:', error);
      if (this.mockDataEnabled) {
        await this.simulateNetworkDelay();
        return this.getMockData().analytics;
      }
      throw error;
    }
  }

  async getPerformance() {
    try {
      if (this.mockDataEnabled) {
        await this.simulateNetworkDelay();
        return this.getMockData().performance;
      }

      // Performance metrics requieren integración con herramientas externas
      return {
        lighthouse: {
          performance: 'N/A',
          accessibility: 'N/A',
          bestPractices: 'N/A',
          seo: 'N/A'
        },
        coreWebVitals: {
          lcp: 'N/A',
          fid: 'N/A',
          cls: 'N/A'
        },
        uptime30d: 'N/A',
        avgResponseTime: 'N/A'
      };
    } catch (error) {
      console.error('Error obteniendo performance de Netlify:', error);
      if (this.mockDataEnabled) {
        await this.simulateNetworkDelay();
        return this.getMockData().performance;
      }
      throw error;
    }
  }

  calculateDeployTime(deploy) {
    if (!deploy?.created_at || !deploy?.published_at) {
      return 'N/A';
    }

    const start = new Date(deploy.created_at);
    const end = new Date(deploy.published_at);
    const diffMs = end - start;
    const diffMinutes = Math.floor(diffMs / 60000);
    const diffSeconds = Math.floor((diffMs % 60000) / 1000);

    return `${diffMinutes}m ${diffSeconds}s`;
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

  getStatusColor(status) {
    switch (status) {
      case 'ready':
      case 'published':
        return 'text-green-600 bg-green-100';
      case 'building':
        return 'text-yellow-600 bg-yellow-100';
      case 'error':
      case 'failed':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  }

  getStatusText(status) {
    switch (status) {
      case 'ready': return 'Listo';
      case 'published': return 'Publicado';
      case 'building': return 'Construyendo';
      case 'error': return 'Error';
      case 'failed': return 'Fallido';
      default: return status;
    }
  }
}

export default new NetlifyAdminService();