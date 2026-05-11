import { Link } from 'react-router-dom';

export default function LoginAlert({ message = 'Faça login para acessar este recurso' }) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center max-w-md p-8 bg-white dark:bg-gray-900 rounded-xl shadow-lg">
        <div className="text-6xl mb-4">🔒</div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Acesso Restrito
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          {message}
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            to="/login"
            className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
          >
            Fazer Login
          </Link>
          <Link
            to="/register"
            className="px-6 py-2 bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            Criar Conta
          </Link>
        </div>
      </div>
    </div>
  );
}