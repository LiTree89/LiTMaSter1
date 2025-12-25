#!/bin/bash
# Azure CLI Quick Setup for LiTreeLabStudio
az group create --name LiTreeLabStudioRG --location eastus
az staticwebapp create --name LiTreeLabStudio --resource-group LiTreeLabStudioRG --location eastus --sku Free --source ./frontend --branch main
az functionapp create --name LiTreeLabStudioFuncs --resource-group LiTreeLabStudioRG --consumption-plan-location eastus --runtime node --functions-version 4
az cosmosdb create --name LiTreeLabStudioDB --resource-group LiTreeLabStudioRG --kind MongoDB
az keyvault create --name LiTreeLabStudioVault --resource-group LiTreeLabStudioRG --location eastus
az signalr create --name LiTreeLabStudioSignalR --resource-group LiTreeLabStudioRG --sku Free --location eastus
