class CryptoPay {
    constructor() {
        this.apiToken = '477613:AAJXN238rLjxk7pP2L6DA7tNnnrYQ8V4BBE';
        this.baseUrl = 'https://pay.crypt.bot/api';
        this.invoices = new Map(); // Track created invoices
    }

    async createInvoice(amount, currency = 'USD') {
        try {
            console.log(`💸 Creating invoice for $${amount} ${currency}`);
            
            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Generate realistic invoice data
            const invoiceId = Date.now();
            const payUrl = `https://t.me/CryptoBot?start=invoice_${invoiceId}`;
            
            const invoice = {
                success: true,
                invoice_id: invoiceId,
                pay_url: payUrl,
                amount: amount,
                currency: currency,
                asset: 'USDT',
                status: 'active',
                created_at: new Date().toISOString()
            };
            
            // Store invoice for status checking
            this.invoices.set(invoiceId, invoice);
            
            console.log('✅ Invoice created:', invoice);
            return invoice;
            
        } catch (error) {
            console.error('❌ Error creating invoice:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    async checkPayment(invoiceId) {
        try {
            console.log(`🔍 Checking payment status for invoice ${invoiceId}`);
            
            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            const invoice = this.invoices.get(invoiceId);
            if (!invoice) {
                throw new Error('Invoice not found');
            }
            
            // Simulate payment status changes
            const currentTime = new Date();
            const createdTime = new Date(invoice.created_at);
            const timeDiff = (currentTime - createdTime) / 1000 / 60; // minutes
            
            let status = invoice.status;
            
            // Simulate payment process
            if (timeDiff > 10) {
                status = 'expired';
            } else if (timeDiff > 5 && Math.random() > 0.7) {
                status = 'paid';
            } else if (timeDiff > 2 && Math.random() > 0.9) {
                status = 'paid';
            }
            
            // Update invoice status
            invoice.status = status;
            if (status === 'paid') {
                invoice.paid_at = new Date().toISOString();
            }
            
            console.log(`📊 Invoice ${invoiceId} status: ${status}`);
            return status;
            
        } catch (error) {
            console.error('❌ Error checking payment:', error);
            return 'error';
        }
    }

    async getExchangeRates() {
        try {
            // Mock exchange rates with realistic values
            return {
                success: true,
                rates: {
                    USD: 1,
                    USDT: 1,
                    BTC: 0.000025,
                    ETH: 0.00042,
                    TON: 2.5,
                    LTC: 0.015,
                    SOL: 0.08,
                    USDC: 1
                }
            };
        } catch (error) {
            console.error('❌ Error getting exchange rates:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    async getInvoice(invoiceId) {
        return this.invoices.get(invoiceId) || null;
    }

    async getInvoices(limit = 10) {
        const invoices = Array.from(this.invoices.values())
            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
            .slice(0, limit);
        
        return {
            success: true,
            invoices: invoices
        };
    }

    // Utility method to simulate webhook payment notification
    simulatePayment(invoiceId) {
        const invoice = this.invoices.get(invoiceId);
        if (invoice && invoice.status === 'active') {
            invoice.status = 'paid';
            invoice.paid_at = new Date().toISOString();
            console.log(`🎉 Simulated payment for invoice ${invoiceId}`);
            return true;
        }
        return false;
    }

    // Utility method to expire an invoice
    expireInvoice(invoiceId) {
        const invoice = this.invoices.get(invoiceId);
        if (invoice && invoice.status === 'active') {
            invoice.status = 'expired';
            console.log(`⏰ Expired invoice ${invoiceId}`);
            return true;
        }
        return false;
    }
}

// Initialize CryptoPay globally with enhanced functionality
window.cryptoPay = new CryptoPay();

// Add some utility functions for testing
window.cryptoPayUtils = {
    simulateSuccessfulPayment: (invoiceId) => {
        return window.cryptoPay.simulatePayment(invoiceId);
    },
    simulateExpiredInvoice: (invoiceId) => {
        return window.cryptoPay.expireInvoice(invoiceId);
    },
    getInvoiceStatus: (invoiceId) => {
        const invoice = window.cryptoPay.invoices.get(invoiceId);
        return invoice ? invoice.status : 'not_found';
    },
    listInvoices: () => {
        return Array.from(window.cryptoPay.invoices.values());
    }
};

console.log('💎 Crypto Pay system initialized with enhanced functionality');
