'use client'
import { useRouter } from 'next/navigation'
import AuthPanel from '@/components/auth/AuthPanel'

export default function RegisterPage() {
  const router = useRouter()
  return (
    <main style={{ backgroundColor: '#FFFFFF', minHeight: '100dvh' }}>
      <AuthPanel
        isOpen={true}
        onClose={() => router.push('/')}
        defaultView="register"
      />
    </main>
  )
}
