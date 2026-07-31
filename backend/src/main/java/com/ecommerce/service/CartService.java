package com.ecommerce.service;

import com.ecommerce.entity.*;
import com.ecommerce.exception.BadRequestException;
import com.ecommerce.exception.ResourceNotFoundException;
import com.ecommerce.payload.request.CartItemRequest;
import com.ecommerce.repository.CartItemRepository;
import com.ecommerce.repository.CartRepository;
import com.ecommerce.repository.ProductRepository;
import com.ecommerce.repository.ProductVariantRepository;
import com.ecommerce.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final ProductVariantRepository productVariantRepository;
    private final UserRepository userRepository;

    public Cart getOrCreateCart(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return cartRepository.findByUser(user)
                .orElseGet(() -> {
                    Cart newCart = Cart.builder().user(user).totalAmount(BigDecimal.ZERO).build();
                    return cartRepository.save(newCart);
                });
    }

    @Transactional
    public Cart addToCart(Long userId, CartItemRequest request) {
        Cart cart = getOrCreateCart(userId);
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        if (product.getStockQuantity() < request.getQuantity()) {
            throw new BadRequestException("Requested quantity exceeds available stock (" + product.getStockQuantity() + ")");
        }

        BigDecimal price = product.getDiscountPrice() != null ? product.getDiscountPrice() : product.getPrice();

        // Resolve the variant entity if variantId is provided
        ProductVariant variant = null;
        if (request.getVariantId() != null) {
            variant = productVariantRepository.findById(request.getVariantId())
                    .orElseThrow(() -> new ResourceNotFoundException("Product variant not found"));
            // Use variant price if available
            if (variant.getPrice() != null) {
                price = variant.getPrice();
            }
        }

        final Long requestedVariantId = request.getVariantId();
        Optional<CartItem> existingItem = cart.getCartItems().stream()
                .filter(item -> item.getProduct().getId().equals(product.getId())
                        && (requestedVariantId == null
                                ? item.getVariant() == null
                                : item.getVariant() != null && item.getVariant().getId().equals(requestedVariantId)))
                .findFirst();

        if (existingItem.isPresent()) {
            CartItem item = existingItem.get();
            item.setQuantity(item.getQuantity() + request.getQuantity());
            item.setPrice(price);
        } else {
            CartItem newItem = CartItem.builder()
                    .cart(cart)
                    .product(product)
                    .variant(variant)
                    .quantity(request.getQuantity())
                    .price(price)
                    .build();
            cart.getCartItems().add(newItem);
        }

        recalculateCartTotal(cart);
        return cartRepository.save(cart);
    }

    @Transactional
    public Cart updateCartItemQuantity(Long userId, Long cartItemId, Integer quantity) {
        Cart cart = getOrCreateCart(userId);
        CartItem item = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found"));

        if (!item.getCart().getId().equals(cart.getId())) {
            throw new BadRequestException("Item does not belong to user cart");
        }

        if (quantity <= 0) {
            cart.getCartItems().remove(item);
            cartItemRepository.delete(item);
        } else {
            item.setQuantity(quantity);
        }

        recalculateCartTotal(cart);
        return cartRepository.save(cart);
    }

    @Transactional
    public Cart removeFromCart(Long userId, Long cartItemId) {
        Cart cart = getOrCreateCart(userId);
        CartItem item = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found"));

        cart.getCartItems().remove(item);
        cartItemRepository.delete(item);

        recalculateCartTotal(cart);
        return cartRepository.save(cart);
    }

    @Transactional
    public void clearCart(Long userId) {
        Cart cart = getOrCreateCart(userId);
        cart.getCartItems().clear();
        cart.setTotalAmount(BigDecimal.ZERO);
        cartRepository.save(cart);
    }

    private void recalculateCartTotal(Cart cart) {
        BigDecimal total = cart.getCartItems().stream()
                .map(item -> item.getPrice().multiply(BigDecimal.valueOf(item.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        cart.setTotalAmount(total);
    }
}
