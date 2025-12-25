# PowerShell script: aks-auto-create.ps1
# Polls for Microsoft.Insights registration and creates AKS cluster when ready

$resourceGroup = "litreelabstudio-rg"
$aksName = "litreelab-aks"
$location = "eastus2"

while ($true) {
    $status = az provider show -n Microsoft.Insights --query registrationState -o tsv
    if ($status -eq 'Registered') {
        Write-Host "Microsoft.Insights is registered. Creating AKS cluster..."
        az aks create --resource-group $resourceGroup --name $aksName --node-count 1 --enable-addons monitoring --generate-ssh-keys --location $location --output json
        break
    } else {
        Write-Host "Waiting for Microsoft.Insights registration... ($status)"
        Start-Sleep -Seconds 20
    }
}
Write-Host "AKS cluster creation script complete."