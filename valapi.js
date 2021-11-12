module.exports = {
  Regions: require('./src/client/Regions'),
  LocalClient: require('./src/client/LocalClient'),
  StandaloneClient: require('./src/client/StandaloneClient'),


  BuddyManager: require('./src/dataManagers/BuddyManager'),
  WeaponManager: require('./src/dataManagers/WeaponManager'),
  ConfigManager: require('./src/dataManagers/ConfigManager'),

  BuddyPrompt: require('./src/tabs/buddyTab')
};