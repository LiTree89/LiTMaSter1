# LiTreeLabStudio™ Architecture

```mermaid
graph TD
  A[React Frontend (Vite, Tailwind)] -->|REST/SignalR| B(Azure Functions API)
  B -->|Payments| C[Google Pay, Coinbase]
  B -->|NFT Minting| D[Web3, Solidity, Ethers]
  B -->|Gamification| E[PlayFab, Custom Engine]
  B -->|Real-Time| F[Azure SignalR]
  B -->|Data| G[Cosmos DB]
  B -->|Secrets| H[Key Vault]
  B -->|Monitoring| I[App Insights]
  B -->|AI Bots| J[OpenAI, Copilot]
  A -->|Static| K[Azure Static Web Apps]
```

- **Cost-optimized**: All services use free/consumption tiers where possible.
- **Scalable**: Modular, event-driven, and cloud-native.
- **Secure**: Key Vault, RBAC, and CI/CD secret injection.
