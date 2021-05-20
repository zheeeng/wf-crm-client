export default function camelToWords(text: string) {
  return text.replace(/([A-Z])/g, (_, $1) => ' ' + $1.toLowerCase())
}
