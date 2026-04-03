export function serializeUser(user) {
  return {
    id: String(user?._id || ''),
    mobileNumber: user?.mobileNumber || '',
    profilePic: user?.profilePic || '',
    wallpaper: user?.wallpaper || ''
  };
}

export function serializeMessage(message) {
  return {
    id: String(message?._id || ''),
    sender: message?.sender || '',
    receiver: message?.receiver || '',
    message: message?.message || '',
    timestamp: message?.timestamp || new Date().toISOString()
  };
}
