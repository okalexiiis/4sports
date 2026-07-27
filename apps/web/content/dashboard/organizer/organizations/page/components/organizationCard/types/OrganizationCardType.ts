export type OrganizationCardType = {
  isSelected: boolean
  name: string
  role: 'owner' | 'admin' | 'viewer' | 'organizer' | 'coach' | string
}
