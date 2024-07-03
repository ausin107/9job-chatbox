module.exports = function override(config, env) {
  config.resolve.fallback = {
    fs: false,
    util: false,
  }
  return config
}
