export const splitWithCamelCase = (str: string): string[] => {
  return str.split(/(?=[A-Z])/)
}
export const firstUpper = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1)
}
