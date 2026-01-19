import type { User } from '@/types'

export const mockUser: User = {
  id: 'user-001',
  email: 'alex.johnson@example.com',
  name: 'Alex Johnson',
  avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAceeR7eGJ7roKUlAE8Uxt6xH1NbMlTfVIlOjMCjnbcL23rU8CueuSQU47hcx9EXwl37KpJVdYam6KVd2GxbXjhy04K1OKrQ2e0JTh4FtgkD-0jkWcql1C80jSj8jUOTd1SXq1q83xhjDs-SLX0hZ3Eba07ZuEPYaeWvbF6yai25z4j-z3Ywme8MJPWInX6pRsGvS8LkBQ7sWxKZIGmb9yZWC2c2BYBp0hGJc8_0mqpNToR4Aoyx3Ed1_0G6jK4diBzWuvZa8kAq3Eu',
  restrictions: ['Keto', 'Nut-Free', 'Low-Carb'],
  preferences: {
    language: 'en-US',
    notifications: true,
    weekStartsOn: 'monday',
  },
}

export const mockToken = 'mock-jwt-token-12345'
