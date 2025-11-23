import { FaGithub } from 'react-icons/fa';

const SimpleFooter = () => {
    return (
        <footer className="bg-gray-100 dark:bg-zinc-900 border-t border-gray-200 dark:border-zinc-700 py-4 mt-8">
            <div className="max-w-7xl mx-auto text-center text-sm text-gray-600 dark:text-gray-400">
                <p className="flex items-center justify-center space-x-2">
                    <span>Desenvolvido por:</span>
                    <a
                        href="https://github.com/LizRabacal"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-1 font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-500 transition-colors"
                    >
                        <FaGithub className="w-4 h-4" />
                        <span>LizRabacal (GitHub)</span>
                    </a>
                </p>
                <p className="mt-1 text-xs text-gray-500">
                    © {new Date().getFullYear()} Projeto Educacional.
                </p>
            </div>
        </footer>
    );
};

export default SimpleFooter;