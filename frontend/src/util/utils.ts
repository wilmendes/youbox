export function getUserScreen(user) {
  return user!.user._owner ? 'Owner' : 'Customer'
}