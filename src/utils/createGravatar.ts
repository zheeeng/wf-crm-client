import md5 from 'md5'

export default function crateGravatar (str: string) {
  return `https://www.gravatar.com/avatar/${md5(str)}?d=retro`
}
