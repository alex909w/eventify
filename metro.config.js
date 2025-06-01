const { getDefaultConfig } = require("expo/metro-config")

const config = getDefaultConfig(__dirname)

// Add support for additional asset extensions
config.resolver.assetExts.push("png", "jpg", "jpeg", "gif", "ico", "svg")

// Ensure proper module resolution
config.resolver.platforms = ["native", "android", "web"]

module.exports = config
