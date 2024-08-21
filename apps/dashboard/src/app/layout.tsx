import './globals.css'

import { Suspense } from 'react'
import { Inter } from 'next/font/google'
import Header from '@components/Header/Header'
import { ThemeProvider } from '@components/Theme/theme-provider'

import { Toaster } from '@repo/ui'

import type { Metadata } from 'next'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Team dashboard app',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Header />
          <Suspense
            fallback={
              <div className="flex h-full items-center justify-center">
                Загузка данных...
              </div>
            }
          >
            {children}
          </Suspense>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
