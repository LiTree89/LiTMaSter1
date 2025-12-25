
import GooglePayButton from "./GooglePayButton";

export default function WalletWidget() {
  // Replace with API call for real balance/transactions
  return (
    <div className="rounded-xl shadow-lg p-4 bg-black/80 widget-header">
      <h2 className="text-xl font-bold mb-2 font-mono">Wallet</h2>
      <div className="text-green-400 font-mono text-lg mb-2">LITBIT Balance: <span className="font-bold">420</span></div>
      <div className="text-xs text-gray-300 mb-4">Recent: +50 (Mission), -10 (Media unlock)</div>
      <GooglePayButton amount={10} description="Add funds to wallet" />
    </div>
  );
}
