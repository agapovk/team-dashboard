import { Metadata } from 'next'

// export const revalidate = 0

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Example dashboard app using the components.',
}

export default async function Home() {
  return <div>homepage</div>
}
