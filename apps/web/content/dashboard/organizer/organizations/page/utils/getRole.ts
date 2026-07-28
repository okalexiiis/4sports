export const getRole = (role: 'owner' | 'admin' | 'viewer' | 'organizer' | 'coach' | string) => {
  switch (role) {
    case 'owner':
      return 'Dueño'

    case 'admin':
      return 'Administrador'

    case 'viewer':
      return 'Espectador'

    case 'organizer':
      return 'Organizador'

    case 'coach':
      return 'Coach'

    default:
      return 'Miembro'
  }
}
