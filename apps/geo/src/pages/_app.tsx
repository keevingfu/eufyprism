import type { AppProps } from 'next/app';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FileText, Calendar, Search, BarChart3, Home } from 'lucide-react';
import '@/styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  const isActive = (path: string) => router.pathname === path;

  return (
    <>
      <Head>
        <title>Eufy GEO - Content Optimization Engine</title>
        <meta name="description" content="Content optimization engine for Eufy products" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <h1 className="text-xl font-semibold text-eufy-blue">
                  Eufy GEO
                </h1>
                <span className="ml-2 text-sm text-gray-500">
                  Content Optimization Engine
                </span>
              </div>
              <nav className="flex space-x-8">
                <Link
                  href="/"
                  className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md ${
                    isActive('/')
                      ? 'text-eufy-blue bg-blue-50'
                      : 'text-gray-700 hover:text-eufy-blue'
                  }`}
                >
                  <Home className="w-4 h-4" />
                  Dashboard
                </Link>
                <Link
                  href="/editor"
                  className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md ${
                    isActive('/editor')
                      ? 'text-eufy-blue bg-blue-50'
                      : 'text-gray-700 hover:text-eufy-blue'
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  Editor
                </Link>
                <Link
                  href="/calendar"
                  className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md ${
                    isActive('/calendar')
                      ? 'text-eufy-blue bg-blue-50'
                      : 'text-gray-700 hover:text-eufy-blue'
                  }`}
                >
                  <Calendar className="w-4 h-4" />
                  Calendar
                </Link>
                <Link
                  href="/keywords"
                  className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md ${
                    isActive('/keywords')
                      ? 'text-eufy-blue bg-blue-50'
                      : 'text-gray-700 hover:text-eufy-blue'
                  }`}
                >
                  <Search className="w-4 h-4" />
                  Keywords
                </Link>
                <Link
                  href="/optimizer"
                  className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md ${
                    isActive('/optimizer')
                      ? 'text-eufy-blue bg-blue-50'
                      : 'text-gray-700 hover:text-eufy-blue'
                  }`}
                >
                  <BarChart3 className="w-4 h-4" />
                  Optimizer
                </Link>
              </nav>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Component {...pageProps} />
        </main>
      </div>
    </>
  );
}