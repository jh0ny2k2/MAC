/**
 * Re-export del contrato de adaptadores desde la raíz del importador.
 * Permite importar desde `services/importer` o desde `services/providerAdapters`
 * de forma intercambiable.
 */
export {
  ImportError,
  normalizedUrl,
  isValidHttpUrl,
  type ProviderAdapter,
} from '../providerAdapters/ProviderAdapter'