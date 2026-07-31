package com.ecommerce.service;

import com.ecommerce.entity.*;
import com.ecommerce.exception.BadRequestException;
import com.ecommerce.exception.ResourceNotFoundException;
import com.ecommerce.payload.request.OrderRequest;
import com.ecommerce.payload.request.OrderStatusUpdateRequest;
import com.ecommerce.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final CartService cartService;
    private final AddressService addressService;
    private final CouponRepository couponRepository;
    private final UserRepository userRepository;
    private final PaymentRepository paymentRepository;
    private final ProductRepository productRepository;

    @Transactional
    public Order placeOrder(Long userId, OrderRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Cart cart = cartService.getOrCreateCart(userId);

        if (cart.getCartItems().isEmpty()) {
            throw new BadRequestException("Cannot place order with an empty cart");
        }

        Address address = addressService.getAddressById(request.getAddressId());

        BigDecimal subtotal = cart.getTotalAmount();
        BigDecimal discount = BigDecimal.ZERO;

        if (request.getCouponCode() != null && !request.getCouponCode().trim().isEmpty()) {
            Coupon coupon = couponRepository.findByCode(request.getCouponCode())
                    .orElseThrow(() -> new ResourceNotFoundException("Invalid coupon code"));

            if (coupon.isActive()
                    && (coupon.getValidUntil() == null || coupon.getValidUntil().isAfter(LocalDateTime.now()))
                    && (coupon.getUsageLimit() == null || coupon.getTimesUsed() < coupon.getUsageLimit())
                    && (coupon.getMinSpend() == null || subtotal.compareTo(coupon.getMinSpend()) >= 0)) {
                if (coupon.getDiscountPercentage() != null) {
                    discount = subtotal.multiply(coupon.getDiscountPercentage()).divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
                    if (coupon.getMaxDiscount() != null && discount.compareTo(coupon.getMaxDiscount()) > 0) {
                        discount = coupon.getMaxDiscount();
                    }
                } else if (coupon.getDiscountAmount() != null) {
                    discount = coupon.getDiscountAmount();
                }
                coupon.setTimesUsed(coupon.getTimesUsed() + 1);
                couponRepository.save(coupon);
            }
        }

        BigDecimal taxAmount = subtotal.subtract(discount).multiply(BigDecimal.valueOf(0.08)).setScale(2, RoundingMode.HALF_UP); // 8% Tax
        BigDecimal shippingFee = subtotal.compareTo(BigDecimal.valueOf(100)) >= 0 ? BigDecimal.ZERO : BigDecimal.valueOf(15.00); // Free shipping over $100
        BigDecimal totalAmount = subtotal.subtract(discount).add(taxAmount).add(shippingFee);

        Order order = Order.builder()
                .orderNumber("ORD-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase())
                .user(user)
                .shippingAddress(address)
                .paymentMethod(request.getPaymentMethod())
                .paymentStatus(request.getPaymentMethod() == PaymentMethod.CASH_ON_DELIVERY ? PaymentStatus.PENDING : PaymentStatus.COMPLETED)
                .status(OrderStatus.PROCESSING)
                .subtotal(subtotal)
                .taxAmount(taxAmount)
                .shippingFee(shippingFee)
                .discountAmount(discount)
                .totalAmount(totalAmount)
                .couponCode(request.getCouponCode())
                .trackingNumber("TRK-" + UUID.randomUUID().toString().substring(0, 10).toUpperCase())
                .build();

        List<OrderItem> orderItems = new ArrayList<>();
        for (CartItem cartItem : cart.getCartItems()) {
            Product product = cartItem.getProduct();
            if (product.getStockQuantity() < cartItem.getQuantity()) {
                throw new BadRequestException("Product " + product.getName() + " is out of stock for requested quantity");
            }
            product.setStockQuantity(product.getStockQuantity() - cartItem.getQuantity());
            productRepository.save(product);

            OrderItem orderItem = OrderItem.builder()
                    .order(order)
                    .product(product)
                    .productName(product.getName())
                    .variantName(cartItem.getVariant() != null ? cartItem.getVariant().getName() : null)
                    .quantity(cartItem.getQuantity())
                    .price(cartItem.getPrice())
                    .totalPrice(cartItem.getPrice().multiply(BigDecimal.valueOf(cartItem.getQuantity())))
                    .build();
            orderItems.add(orderItem);
        }
        order.setOrderItems(orderItems);

        Order savedOrder = orderRepository.save(order);

        // Record Payment transaction
        Payment payment = Payment.builder()
                .order(savedOrder)
                .paymentMethod(request.getPaymentMethod())
                .transactionId("TXN-" + UUID.randomUUID().toString().substring(0, 12).toUpperCase())
                .amount(totalAmount)
                .status(savedOrder.getPaymentStatus())
                .build();
        paymentRepository.save(payment);

        cartService.clearCart(userId);
        return savedOrder;
    }

    public List<Order> getUserOrders(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return orderRepository.findByUserOrderByCreatedAtDesc(user);
    }

    public Order getOrderById(Long id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + id));
    }

    public Order getOrderByNumber(String orderNumber) {
        return orderRepository.findByOrderNumber(orderNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with order number: " + orderNumber));
    }

    public Page<Order> getAllOrders(int page, int size, OrderStatus status) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        if (status != null) {
            return orderRepository.findByStatus(status, pageable);
        }
        return orderRepository.findAll(pageable);
    }

    @Transactional
    public Order updateOrderStatus(Long orderId, OrderStatusUpdateRequest request) {
        Order order = getOrderById(orderId);
        order.setStatus(request.getStatus());
        if (request.getTrackingNumber() != null) {
            order.setTrackingNumber(request.getTrackingNumber());
        }
        if (request.getStatus() == OrderStatus.DELIVERED) {
            order.setPaymentStatus(PaymentStatus.COMPLETED);
        }
        return orderRepository.save(order);
    }

    @Transactional
    public Order cancelOrder(Long userId, Long orderId) {
        Order order = getOrderById(orderId);
        if (!order.getUser().getId().equals(userId)) {
            throw new BadRequestException("Order does not belong to user");
        }
        if (order.getStatus() == OrderStatus.DELIVERED || order.getStatus() == OrderStatus.SHIPPED) {
            throw new BadRequestException("Cannot cancel an order that is already " + order.getStatus());
        }
        order.setStatus(OrderStatus.CANCELLED);
        // Restock products
        for (OrderItem item : order.getOrderItems()) {
            if (item.getProduct() != null) {
                Product p = item.getProduct();
                p.setStockQuantity(p.getStockQuantity() + item.getQuantity());
                productRepository.save(p);
            }
        }
        return orderRepository.save(order);
    }
}
