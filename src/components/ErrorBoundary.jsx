import { Component } from 'react';
import { isChunkLoadError } from '../lib/lazyWithRetry';

// Captura erros de renderização para não derrubar a tela inteira.
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, isChunkError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, isChunkError: isChunkLoadError(error) };
  }

  componentDidCatch(error, info) {
    console.error('Erro de renderização:', error, info);
  }

  handleReload = () => {
    this.setState({ hasError: false, isChunkError: false });
    window.location.href = '/';
  };

  handleHardReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      // Fallback específico para chunk obsoleto (deploy novo): recarregar
      // a versão atual costuma resolver.
      if (this.state.isChunkError) {
        return (
          <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center p-4">
            <div className="text-center max-w-md">
              <div className="text-6xl mb-4">🔄</div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Nova versão disponível
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                O site foi atualizado. Recarregue a página para carregar a versão mais recente.
              </p>
              <button
                onClick={this.handleHardReload}
                className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
              >
                Recarregar
              </button>
            </div>
          </div>
        );
      }

      return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center p-4">
          <div className="text-center max-w-md">
            <div className="text-6xl mb-4">⚠️</div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Algo deu errado
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Ocorreu um erro inesperado. Tente recarregar a página.
            </p>
            <button
              onClick={this.handleReload}
              className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
            >
              Voltar ao início
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
