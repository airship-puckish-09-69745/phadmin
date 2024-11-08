export function IsMars() {
  const project = process.env.VUE_APP_PROJECT
  console.log('isMars', project)
  return project === 'ph_audit'
}
export function IsProd() {
  const env = process.env.NODE_ENV
  console.log('isProd', env)
  return env === 'production'
}
export function IsProjectZoo() {
  const project = process.env.VUE_APP_PROJECT
  console.log('isProd', project)
  return project === 'zoo'
}
