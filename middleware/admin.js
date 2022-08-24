export default function ({ store, redirect }) {
  if (
    !store.state.auth.loggedIn ||
    store.state.auth.user.userTypeId !== 'dff0dd30-b794-11ec-abe0-236257eb5adb'
  ) {
    return redirect('/')
  }
}
