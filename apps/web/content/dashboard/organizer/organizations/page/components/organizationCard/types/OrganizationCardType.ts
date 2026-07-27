export type OrganizationCardType = {
  id: string
  isSelected: boolean
  name: string
  role: 'owner' | 'admin' | 'viewer' | 'organizer' | 'coach' | string
}
