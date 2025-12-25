// Bicep Template for LiTreeLabStudio (modular, parameterized)

@description('Name of the Static Web App')
param staticWebAppName string = 'LiTreeStudioWeb'

@description('Name of the Function App')
param functionAppName string = 'LiTreeStudioFuncs'

@description('Azure region for deployment')
param location string = 'eastus'

@description('SKU for Static Web App')
@allowed([ 'Free', 'Standard' ])
param staticWebAppSku string = 'Free'

@description('SKU for Function App (App Service Plan)')
@allowed([ 'Y1', 'F1', 'S1' ])
param functionAppSku string = 'Y1' // Y1 = Consumption, F1 = Free, S1 = Standard

@description('Name of the App Service Plan for Function App')
param functionAppPlanName string = 'LiTreeStudioFuncPlan'

resource staticWebApp 'Microsoft.Web/staticSites@2022-03-01' = {
  name: staticWebAppName
  location: location
  sku: {
    name: staticWebAppSku
  }
}

resource functionAppPlan 'Microsoft.Web/serverfarms@2022-09-01' = {
  name: functionAppPlanName
  location: location
  sku: {
    name: functionAppSku
    tier: functionAppSku == 'Y1' ? 'Dynamic' : (functionAppSku == 'F1' ? 'Free' : 'Standard')
  }
  kind: 'functionapp'
}

resource functionApp 'Microsoft.Web/sites@2022-03-01' = {
  name: functionAppName
  location: location
  kind: 'functionapp'
  properties: {
    serverFarmId: functionAppPlan.id
  }
}

@description('Name of the Cosmos DB account')
param cosmosDbAccountName string = 'litreestudio-cosmos'

@description('Location for Cosmos DB')
param cosmosDbLocation string = location

@description('Cosmos DB SKU')
// Only 'Standard' is valid for databaseAccountOfferType
@allowed([ 'Standard' ])
param cosmosDbSku string = 'Standard'

resource cosmosDb 'Microsoft.DocumentDB/databaseAccounts@2023-04-15' = {
  name: cosmosDbAccountName
  location: cosmosDbLocation
  kind: 'GlobalDocumentDB'
  properties: {
    databaseAccountOfferType: 'Standard'
    locations: [
      {
        locationName: cosmosDbLocation
        failoverPriority: 0
        isZoneRedundant: false
      }
    ]
  }
}

@description('Name of the Key Vault')
param keyVaultName string = 'litreestudio-vault'

@description('Location for Key Vault')
param keyVaultLocation string = location

resource keyVault 'Microsoft.KeyVault/vaults@2023-02-01' = {
  name: keyVaultName
  location: keyVaultLocation
  properties: {
    sku: {
      family: 'A'
      name: 'standard'
    }
    tenantId: subscription().tenantId
    accessPolicies: []
    enabledForDeployment: true
    enabledForTemplateDeployment: true
    enabledForDiskEncryption: true
  }
}

@description('Name of the SignalR Service')
param signalRName string = 'litreestudio-signalr'

@description('Location for SignalR')
param signalRLocation string = location

@description('SignalR SKU')
@allowed([ 'Free_F1', 'Standard_S1' ])
param signalRSku string = 'Free_F1'

resource signalR 'Microsoft.SignalRService/SignalR@2022-02-01' = {
  name: signalRName
  location: signalRLocation
  sku: {
    name: signalRSku
    tier: signalRSku == 'Free_F1' ? 'Free' : 'Standard'
  }
  properties: {
    features: [
      {
        flag: 'ServiceMode'
        value: 'Default'
        properties: {}
      }
    ]
  }
}
