import React, { useState } from 'react';
import { X, Package, Fish, User, MapPin, Phone, Check, AlertCircle, Clock, CreditCard } from 'lucide-react';
import { SeafoodItem } from './CatalogPage';

interface OrderModalProps {
  item: SeafoodItem;
  onClose: () => void;
}

interface CustomerDetails {
  name: string;
  phone: string;
  location: string;
}

const OrderModal: React.FC<OrderModalProps> = ({ item, onClose }) => {
  const [step, setStep] = useState<'details' | 'delivery' | 'confirmation' | 'submitting' | 'payment' | 'complete'>('details');
  const [customerDetails, setCustomerDetails] = useState<CustomerDetails>({
    name: '',
    phone: '',
    location: ''
  });
  const [deliveryOption, setDeliveryOption] = useState<'cleaned' | 'asis' | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const finalPrice = deliveryOption === 'cleaned' ? item.price + item.cleaningFee : item.price;

  const handleDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customerDetails.name && customerDetails.phone && customerDetails.location) {
      setStep('delivery');
    }
  };

  const handleDeliveryOptionSelect = (option: 'cleaned' | 'asis') => {
    setDeliveryOption(option);
    setStep('confirmation');
  };

  const handleConfirmOrder = () => {
    setStep('submitting');
    submitOrder();
  };

  const submitOrder = async () => {
    setIsProcessing(true);
    setError(null);

    try {
      const orderPayload = {
        customerName: customerDetails.name,
        customerPhone: customerDetails.phone,
        customerLocation: customerDetails.location,
        itemId: item.id,
        itemName: item.name,
        itemPrice: item.price,
        deliveryType: deliveryOption,
        quantity: item.quantity,
        cleaningFee: item.cleaningFee,
      };

      const response = await fetch('/api/orders/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderPayload),
      });

      const result = await response.json();

      if (response.ok) {
        setOrderId(result.id);
        
        if (deliveryOption === 'cleaned') {
          setStep('payment');
          // Initiate payment
          await initiatePayment(result.id);
        } else {
          setStep('complete');
        }
      } else {
        setError(result.error || 'Failed to create order');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const initiatePayment = async (orderId: string) => {
    try {
      const response = await fetch('/api/mpesa/stkpush', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ orderId }),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error || 'Payment initiation failed');
      }
    } catch (error) {
      setError('Payment initiation failed. Please try again.');
    }
  };

  const handlePaymentComplete = () => {
    setIsProcessing(true);
    
    // Simulate payment verification
    setTimeout(() => {
      setIsProcessing(false);
      setStep('complete');
    }, 3000);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl transform animate-in fade-in zoom-in">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Order {item.name}</h2>
            <p className="text-sm text-gray-500">{item.categoryDisplay}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-6 w-6 text-gray-500" />
          </button>
        </div>

        <div className="p-6">
          {/* Customer Details Step */}
          {step === 'details' && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Your Details</h3>
                <p className="text-gray-600">We need your information to process the order</p>
              </div>

              <form onSubmit={handleDetailsSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    value={customerDetails.name}
                    onChange={(e) => setCustomerDetails(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    value={customerDetails.phone}
                    onChange={(e) => setCustomerDetails(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    placeholder="0700000000"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Delivery Location</label>
                  <input
                    type="text"
                    value={customerDetails.location}
                    onChange={(e) => setCustomerDetails(prev => ({ ...prev, location: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    placeholder="Enter your delivery address"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-3 px-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Continue
                </button>
              </form>
            </div>
          )}

          {/* Delivery Options Step */}
          {step === 'delivery' && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Package className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Delivery Options</h3>
                <p className="text-gray-600">How would you like your {item.name} prepared?</p>
              </div>

              <div className="space-y-4">
                <button
                  onClick={() => handleDeliveryOptionSelect('cleaned')}
                  className="w-full p-4 border-2 border-gray-200 rounded-2xl hover:border-cyan-500 hover:bg-cyan-50 transition-all duration-300 text-left"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-gray-800">Cleaned & Packaged</h4>
                      <p className="text-gray-600 text-sm">Ready to cook, professionally cleaned</p>
                      <p className="text-cyan-600 font-semibold">+KSh {item.cleaningFee} processing fee</p>
                    </div>
                    <Package className="h-6 w-6 text-cyan-600" />
                  </div>
                </button>

                <button
                  onClick={() => handleDeliveryOptionSelect('asis')}
                  className="w-full p-4 border-2 border-gray-200 rounded-2xl hover:border-cyan-500 hover:bg-cyan-50 transition-all duration-300 text-left"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-gray-800">As Is</h4>
                      <p className="text-gray-600 text-sm">Fresh catch, you prepare at home</p>
                      <p className="text-green-600 font-semibold">No additional fees</p>
                    </div>
                    <Fish className="h-6 w-6 text-green-600" />
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* Order Confirmation Step */}
          {step === 'confirmation' && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertCircle className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Confirm Your Order</h3>
                <p className="text-gray-600">Please review your order details</p>
              </div>

              <div className="bg-gray-50 rounded-2xl p-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Item:</span>
                  <span className="font-semibold">{item.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Category:</span>
                  <span className="font-semibold text-sm">{item.categoryDisplay}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Quantity:</span>
                  <span className="font-semibold">{item.quantity}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Base Price:</span>
                  <span className="font-semibold">KSh {item.price.toLocaleString()}</span>
                </div>
                {deliveryOption === 'cleaned' && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Processing Fee:</span>
                    <span className="font-semibold">KSh {item.cleaningFee}</span>
                  </div>
                )}
                <div className="border-t pt-2 flex justify-between">
                  <span className="text-gray-800 font-semibold">Total:</span>
                  <span className="font-bold text-xl text-cyan-600">KSh {finalPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery Option:</span>
                  <span className="font-semibold">
                    {deliveryOption === 'cleaned' ? 'Cleaned & Packaged' : 'As Is'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment:</span>
                  <span className="font-semibold">
                    {deliveryOption === 'cleaned' ? 'Pay Now' : 'Pay on Delivery'}
                  </span>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
                <h4 className="font-semibold text-blue-800 mb-2">Customer Details</h4>
                <div className="space-y-1 text-blue-700">
                  <p><strong>Name:</strong> {customerDetails.name}</p>
                  <p><strong>Phone:</strong> {customerDetails.phone}</p>
                  <p><strong>Location:</strong> {customerDetails.location}</p>
                </div>
              </div>

              {isProcessing ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-16 w-16 border-4 border-cyan-200 border-t-cyan-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Checking availability with our team...</p>
                </div>
              ) : (
                <button
                  onClick={handleConfirmOrder}
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-3 px-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Confirm Order
                </button>
              )}
            </div>
          )}

          {/* Submitting Step */}
          {step === 'submitting' && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Package className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Processing Your Order</h3>
                <p className="text-gray-600">We're submitting your order and notifying our team...</p>
              </div>

              {error ? (
                <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-center">
                  <p className="text-red-600 font-semibold mb-4">{error}</p>
                  <button
                    onClick={() => {
                      setError(null);
                      setStep('confirmation');
                    }}
                    className="bg-red-500 text-white px-6 py-2 rounded-xl hover:bg-red-600 transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-16 w-16 border-4 border-cyan-200 border-t-cyan-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Creating your order...</p>
                </div>
              )}
            </div>
          )}

          {/* Payment Step */}
          {step === 'payment' && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CreditCard className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Complete Payment</h3>
                <p className="text-gray-600">Check your phone for the M-Pesa payment request</p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 text-center">
                <h4 className="font-semibold text-blue-800 mb-2">Total Amount</h4>
                <p className="text-3xl font-bold text-blue-600">KSh {finalPrice.toLocaleString()}</p>
              </div>

              {error ? (
                <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
                  <h4 className="font-semibold text-red-800 mb-2">Payment Error</h4>
                  <p className="text-red-700 mb-4">{error}</p>
                  <button
                    onClick={() => orderId && initiatePayment(orderId)}
                    className="w-full bg-red-500 text-white py-2 px-4 rounded-xl hover:bg-red-600 transition-colors"
                  >
                    Retry Payment
                  </button>
                </div>
              ) : (
                <div className="bg-green-50 border border-green-200 rounded-2xl p-4">
                  <h4 className="font-semibold text-green-800 mb-2">Payment Sent!</h4>
                  <div className="text-green-700 space-y-2">
                    <p>📱 Check your phone for the M-Pesa payment request</p>
                    <p>💳 Enter your M-Pesa PIN to complete payment</p>
                    <p className="text-sm mt-2">Payment will be verified automatically</p>
                  </div>
                </div>
              )}

              {isProcessing ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Waiting for payment confirmation...</p>
                </div>
              ) : (
                <button
                  onClick={handlePaymentComplete}
                  className="w-full bg-gradient-to-r from-blue-500 to-cyan-600 text-white py-3 px-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  I've Completed Payment
                </button>
              )}
            </div>
          )}

          {/* Complete Step */}
          {step === 'complete' && (
            <div className="space-y-6 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto">
                <Check className="h-10 w-10 text-white" />
              </div>
              
              <div>
                <h3 className="text-2xl font-semibold text-gray-800 mb-2">Order Confirmed!</h3>
                <p className="text-gray-600 mb-4">
                  Thank you for your order. We'll prepare your {item.name} and deliver it to you.
                </p>
                
                <div className="bg-green-50 border border-green-200 rounded-2xl p-4 mb-4">
                  <div className="flex items-center justify-center space-x-2 text-green-700 mb-2">
                    <Clock className="h-5 w-5" />
                    <span className="font-semibold">Estimated Delivery</span>
                  </div>
                  <p className="text-green-600 font-semibold">30-45 minutes</p>
                </div>

                <p className="text-sm text-gray-500">
                  You'll receive updates on your order status. Thank you for choosing SeasideSeafood!
                </p>
              </div>

              <button
                onClick={onClose}
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-3 px-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Done
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderModal;