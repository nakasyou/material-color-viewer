import { defineVaporComponent as df } from 'vue-jsx-vapor'

export const defineVaporComponent = <T extends (...args: never[]) => unknown>(
  component: T,
) => {
  return df(component) as unknown as T
}
