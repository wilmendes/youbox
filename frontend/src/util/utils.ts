export function getUserScreen(user) {
  return user!.user._owner ? 'Owner' : 'Customer'
}

export interface Music {
  name: string,
  url: string,
  votes: number
}

export function getIdFromVideo(url) {
  console.log('getting id from: ', url)
  var videoId = url.split('v=')[1];
  var ampersandPosition = videoId.indexOf('&');
  if (ampersandPosition != -1) {
      videoId = videoId.substring(0, ampersandPosition);
  }
  return videoId;
}