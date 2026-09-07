import store from "@/store";

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

//判断是开发环境
export function  IsDev(){
  const env = process.env.NODE_ENV
  console.log('isDev', env)
  return env === 'development'
}

//判断是否是UAT环境
export function IsUat() {
  const node_env = process.env.NODE_ENV
  const store_env =  store.getters.env
  console.log('node_env', node_env)
  console.log('store_env', store_env)
  return node_env === 'production' && store_env === 'test'
}
//是否是线上正式
export function IsProdNew() {
  const node_env = process.env.NODE_ENV
  const store_env =  store.getters.env
  console.log('node_env', node_env)
  console.log('store_env', store_env)
  return node_env === 'production' && store_env === 'pro'
}
