// Bicep Template for LiTreeLabStudio (modular)
resource staticWebApp 'Microsoft.Web/staticSites@2022-03-01' = {
  name: 'LiTreeLabStudio'
  location: 'eastus'
  sku: { name: 'Free' }
}

resource functionApp 'Microsoft.Web/sites@2022-03-01' = {
  name: 'LiTreeLabStudioFuncs'
  location: 'eastus'
  kind: 'functionapp'
  properties: {
    serverFarmId: 'ConsumptionPlan'
  }
}
// Add Cosmos DB, Key Vault, SignalR, PlayFab as needed
