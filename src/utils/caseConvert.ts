export const pascal2snake = (str: string) => str.replace(/([A-Z])/g, '_$1').toLowerCase()
export const snake2pascal = (str: string) => str.replace(/_([a-z])/g, (_, $1: string) => $1.toUpperCase())
