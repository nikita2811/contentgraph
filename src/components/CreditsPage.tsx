import { useState, useEffect, useCallback } from "react";
import "../css/CreditsPage.css";
import { api } from "../api/axiosInstance"

// ─── Types ────────────────────────────────────────────────────────────────────

interface WalletData {
    balance: string;
    total_credited: string;
    total_debited: string;
    currency: string;
}

interface Transaction {
    id: string;
    transaction_type: "credit" | "debit" | "refund";
    amount: string;
    balance_before: string;
    balance_after: string;
    description: string;
    created_at: string;
}

interface TopUpPackage {
    label: string;
    amount: number;
    popular?: boolean;
    bonus?: string;
}

interface RazorpayOrderResponse {
    order_id: string;
    amount: number;
    currency: string;
    receipt: string;
    key: string;
}

interface RazorpaySuccessResponse {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
}

declare global {
    interface Window {
        Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
    }
}

interface RazorpayOptions {
    key: string;
    amount: number;
    currency: string;
    order_id: string;
    name: string;
    description: string;
    handler: (response: RazorpaySuccessResponse) => void;
    prefill?: { name?: string; email?: string; contact?: string };
    theme?: { color?: string };
    modal?: { ondismiss?: () => void };
}

interface RazorpayInstance {
    open(): void;
}

// ─── Constants ────────────────────────────────────────────────────────────────



const TOP_UP_PACKAGES: TopUpPackage[] = [
    { label: "Starter", amount: 100 },
    { label: "Basic", amount: 500, bonus: "5% extra" },
    { label: "Growth", amount: 1000, popular: true, bonus: "10% extra" },
    { label: "Pro", amount: 2500, bonus: "15% extra" },
    { label: "Scale", amount: 5000, bonus: "20% extra" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────


function fmt(amount: string | number, currency = "INR"): string {
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency,
        minimumFractionDigits: 2,
    }).format(Number(amount));
}

function relativeTime(iso: string): string {
    const diff = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
}

function loadRazorpayScript(): Promise<boolean> {
    if (window.Razorpay) return Promise.resolve(true);
    return new Promise((resolve) => {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });
}

// ─── API calls ────────────────────────────────────────────────────────────────


async function fetchWallet(): Promise<WalletData> {
    const res = await api.get("payment/wallet");
    return res.data;
}

async function fetchTransactions(): Promise<Transaction[]> {
    const res = await api.get("payment/transactions");
    return res.data.results ?? [];
}

async function createOrder(amount: number): Promise<RazorpayOrderResponse> {
    const res = await api.post("payment/order/create", { amount });
    return res.data;
}

async function verifyPayment(payload: RazorpaySuccessResponse): Promise<{ wallet_balance: string }> {
    const res = await api.post("payment/order/verify", payload);
    return res.data;
}


// ─── Sub-components ───────────────────────────────────────────────────────────

function WalletCard({ wallet, loading }: { wallet: WalletData | null; loading: boolean }) {
    return (
        <div className="cb-wallet-card">
            {/* LEFT — title + subtitle (mirrors hero section) */}
            <div className="cb-wallet-inner">
                <div className="cb-wallet-label">Credits & Wallet</div>
                {loading || !wallet ? (
                    <div className="cb-wallet-balance-skeleton" />
                ) : (
                    <div className="cb-wallet-balance">
                        Manage your balance and top-up credits
                    </div>
                )}
            </div>

            {/* RIGHT — credit chip + credited/spent stats */}
            <div className="cb-wallet-stats">
                {/* ⚡ balance chip — matches "170 Credits" pill in hero */}
                <div className="cb-wallet-chip">
                    <span className="cb-wallet-chip-icon">⚡</span>
                    <span className="cb-wallet-chip-value">
                        {loading || !wallet
                            ? "—"
                            : `${fmt(wallet.balance, wallet.currency)} balance`}
                    </span>
                </div>

                {/* mini credited / spent row */}
                {wallet && (
                    <div className="cb-wallet-stat">
                        <div className="cb-wallet-stat-item">
                            <span className="cb-wallet-stat-label">Credited</span>
                            <span className="cb-wallet-stat-value">{fmt(wallet.total_credited)}</span>
                        </div>
                        <div className="cb-wallet-divider" />
                        <div className="cb-wallet-stat-item">
                            <span className="cb-wallet-stat-label">Spent</span>
                            <span className="cb-wallet-stat-value">{fmt(wallet.total_debited)}</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

function PackageGrid({
    selected,
    onSelect,
    disabled,
}: {
    selected: number | null;
    onSelect: (amount: number) => void;
    disabled: boolean;
}) {
    return (
        <div className="cb-package-grid">
            {TOP_UP_PACKAGES.map((pkg) => (
                <button
                    key={pkg.amount}
                    onClick={() => onSelect(pkg.amount)}
                    disabled={disabled}
                    className={[
                        "cb-package-card",
                        selected === pkg.amount ? "cb-package-card--selected" : "",
                        pkg.popular ? "cb-package-card--popular" : "",
                    ].join(" ")}
                >
                    {pkg.popular && (
                        <span className="cb-popular-badge">Most popular</span>
                    )}
                    <div className="cb-package-label">{pkg.label}</div>
                    <div className="cb-package-amount">{fmt(pkg.amount)}</div>
                    {pkg.bonus && <div className="cb-package-bonus">{pkg.bonus}</div>}
                </button>
            ))}
        </div>
    );
}

function CustomAmountInput({
    value,
    onChange,
    disabled,
}: {
    value: string;
    onChange: (v: string) => void;
    disabled: boolean;
}) {
    return (
        <div className="cb-custom-row">
            <span className="cb-rupee-symbol">₹</span>
            <input
                type="number"
                min={10}
                max={100000}
                placeholder="Enter custom amount"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                disabled={disabled}
                className="cb-custom-input"
            />
        </div>
    );
}

function TransactionRow({ txn }: { txn: Transaction }) {
    const isCredit = txn.transaction_type === "credit" || txn.transaction_type === "refund";
    const labels: Record<string, string> = {
        credit: "Top-up",
        debit: "API usage",
        refund: "Refund",
    };

    return (
        <div className="cb-txn-row">
            <div className={`cb-txn-badge cb-txn-badge--${txn.transaction_type}`}>
                {labels[txn.transaction_type]}
            </div>
            <div className="cb-txn-description">{txn.description}</div>
            <div className="cb-txn-time">{relativeTime(txn.created_at)}</div>
            <div className={`cb-txn-amount cb-txn-amount--${isCredit ? "credit" : "debit"}`}>
                {isCredit ? "+" : "-"}{fmt(txn.amount)}
            </div>
        </div>
    );
}

// ─── Toast ────────────────────────────────────────────────────────────────────

type ToastType = "success" | "error" | "info";

function Toast({
    message,
    type,
    onClose,
}: {
    message: string;
    type: ToastType;
    onClose: () => void;
}) {
    useEffect(() => {
        const t = setTimeout(onClose, 4000);
        return () => clearTimeout(t);
    }, [onClose]);

    return (
        <div className={`cb-toast cb-toast--${type}`}>
            {message}
            <button onClick={onClose} className="cb-toast-close">×</button>
        </div>
    );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function CreditsAndBilling() {
    const [wallet, setWallet] = useState<WalletData | null>(null);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [walletLoading, setWalletLoading] = useState(true);
    const [txnLoading, setTxnLoading] = useState(true);

    const [selectedPackage, setSelectedPackage] = useState<number | null>(null);
    const [customAmount, setCustomAmount] = useState("");
    const [paying, setPaying] = useState(false);

    const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);
    const [activeTab, setActiveTab] = useState<"topup" | "history">("topup");

    const showToast = useCallback((message: string, type: ToastType) => {
        setToast({ message, type });
    }, []);

    const loadWallet = useCallback(async () => {
        try {
            setWalletLoading(true);
            setWallet(await fetchWallet());

        } catch {
            showToast("Could not load wallet", "error");
        } finally {
            setWalletLoading(false);
        }
    }, [showToast]);

    const loadTransactions = useCallback(async () => {
        try {
            setTxnLoading(true);
            setTransactions(await fetchTransactions());
        } catch {
            showToast("Could not load transactions", "error");
        } finally {
            setTxnLoading(false);
        }
    }, [showToast]);

    useEffect(() => {

        loadWallet();
        loadTransactions();
    }, [loadWallet, loadTransactions]);

    const handlePackageSelect = (amount: number) => {
        setSelectedPackage(amount);
        setCustomAmount("");
    };

    const handleCustomChange = (v: string) => {
        setCustomAmount(v);
        setSelectedPackage(null);
    };

    const effectiveAmount = selectedPackage ?? (customAmount ? Number(customAmount) : null);

    const handleTopUp = async () => {
        if (!effectiveAmount || effectiveAmount < 10) {
            showToast("Minimum top-up amount is ₹10", "error");
            return;
        }
        if (effectiveAmount > 100000) {
            showToast("Maximum top-up amount is ₹1,00,000", "error");
            return;
        }

        try {
            setPaying(true);
            const scriptLoaded = await loadRazorpayScript();
            if (!scriptLoaded) {
                showToast("Could not load Razorpay. Check your connection.", "error");
                return;
            }

            const order = await createOrder(effectiveAmount);

            const options: RazorpayOptions = {
                key: order.key,
                amount: order.amount,
                currency: order.currency,
                order_id: order.order_id,
                name: "ContentGraph",
                description: "Wallet top-up",
                handler: async (response) => {
                    try {
                        const result = await verifyPayment(response);
                        showToast(
                            `Payment successful! New balance: ${fmt(result.wallet_balance)}`,
                            "success"
                        );
                        await Promise.all([loadWallet(), loadTransactions()]);
                        setSelectedPackage(null);
                        setCustomAmount("");
                        setActiveTab("history");
                    } catch {
                        showToast(
                            "Payment received but verification failed. Contact support.",
                            "error"
                        );
                    } finally {
                        setPaying(false);
                    }
                },
                modal: { ondismiss: () => setPaying(false) },
                theme: { color: "#1e2a4a" },
            };

            new window.Razorpay(options).open();
        } catch (err) {
            showToast(err instanceof Error ? err.message : "Order creation failed", "error");
            setPaying(false);
        }
    };

    return (
        <div className="cb-page">
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}

            <div className="cb-container">
                {/* Header */}
                <div className="cb-header">
                    <h1 className="cb-title">Credits & Billing</h1>
                    <p className="cb-subtitle">Manage your wallet balance and view transaction history</p>
                </div>

                {/* Wallet card */}

                <WalletCard wallet={wallet} loading={walletLoading} />

                {/* Tab bar */}
                <div className="cb-tab-bar">
                    {(["topup", "history"] as const).map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`cb-tab${activeTab === tab ? " cb-tab--active" : ""}`}
                        >
                            {tab === "topup" ? "Add credits" : "Transaction history"}
                        </button>
                    ))}
                </div>

                {/* Top-up panel */}
                {activeTab === "topup" && (
                    <div className="cb-panel">
                        <div className="cb-section-title">Choose an amount</div>

                        <PackageGrid
                            selected={selectedPackage}
                            onSelect={handlePackageSelect}
                            disabled={paying}
                        />

                        <div className="cb-divider-row">
                            <div className="cb-divider-line" />
                            <span className="cb-divider-text">or enter custom amount</span>
                            <div className="cb-divider-line" />
                        </div>

                        <CustomAmountInput
                            value={customAmount}
                            onChange={handleCustomChange}
                            disabled={paying}
                        />

                        <button
                            onClick={handleTopUp}
                            disabled={paying || !effectiveAmount}
                            className="cb-pay-btn"
                        >
                            {paying ? (
                                <span className="cb-spinner-row">
                                    <span className="cb-spinner" />
                                    Processing…
                                </span>
                            ) : effectiveAmount ? (
                                `Pay ${fmt(effectiveAmount)}`
                            ) : (
                                "Select an amount to continue"
                            )}
                        </button>

                        <p className="cb-secure-note">
                            🔒 Secured by Razorpay · UPI, cards, net banking accepted
                        </p>
                    </div>
                )}

                {/* Transaction history panel */}
                {activeTab === "history" && (
                    <div className="cb-panel">
                        {txnLoading ? (
                            <div className="cb-skeleton-list">
                                {[...Array(4)].map((_, i) => (
                                    <div key={i} className="cb-txn-skeleton" />
                                ))}
                            </div>
                        ) : transactions.length === 0 ? (
                            <div className="cb-empty-state">
                                <div className="cb-empty-icon">📭</div>
                                <div className="cb-empty-text">No transactions yet</div>
                                <div className="cb-empty-subtext">Top up your wallet to get started</div>
                            </div>
                        ) : (
                            <div className="cb-txn-list">
                                {transactions.map((txn) => (
                                    <TransactionRow key={txn.id} txn={txn} />
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}