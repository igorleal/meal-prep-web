// Placeholder images for when backend doesn't return imageUrl

export const PLACEHOLDER_IMAGES = {
  // For meal prep plans
  mealPlan: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAZHTXQYSROxPNads5nmNgdYT1_5Oraf99EfBWi-_-pHJm9magXfm7L4VHi0mKIzp5RxX_F7AnrVgenxqTO74hI8XwbQ7EhOen2vtsklYert1VWwjhjnwCMZjMTOvAs9tbLR28WXRff7ITKmW5fXBENORWVCGOIuC2ERzwa4RZA_LpwHQ__qaNSZ3bO8Ls-ugGQPYcDSo-vOWALJCMoL5eVjHMawgwdWbd7iLUA05XLvM9S7_wxD8eZu1eXvlQmOzmWNg1txhIU7Jaj',

  // For family calendar meals
  familyMeal: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAYtsf7BPFFxGXjvcP4hMaSTJaPy6K8ywADSv3Aiifai3tLIqL_sBDZnaQJ2xMaR8SE7oAPjKLwYlCLnkG4NUSP6Jm3QIyZKaprVAHmesJlNb2rZehcJQpGENBKf-daYNStJ5KTwKm7lYxXR-kjHovxS0FiYo5ZKjSYyyIvZp3EhU2X-SomF1gpZuFmpXjkOS24mI5MGsF9H11orRb8i3OkqGExVepQYUEXClAc6LkhPNApbTz5V0Mr2CYPjPLk0sWsxA9sjnpV8kBe',

  // For special meals / food with friends
  specialMeal: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAlhiPXgGANe8r_WItGTsgKJ4lga5VC7fc6jhwq8eLg1WrxmKGwV254tY3C5Di_dewGYfDCM_n04J99aKCZUyPqKeBrVqwKedBNySS6HSLIwjJmjAFNpHvkCEC9tZx1nVrOnzlEOsG3b988Fq-pfxv1-pwpFqIZzOH8VjDcWBaZAGx_5krncw_ejrQEUOVFEYq655xVoK9KmDi8iKN3Qut66uEpc8BFtVrOmHBwm3XKGSWJabUHp076i6KXvhO-O8M4BmOhC2HOup__',
}

// Helper to get image URL with fallback
export function getRecipeImageUrl(imageUrl: string | undefined, type: 'mealPlan' | 'familyMeal' | 'specialMeal' = 'mealPlan'): string {
  return imageUrl || PLACEHOLDER_IMAGES[type]
}
