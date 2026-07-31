package com.ecommerce.service;

import com.ecommerce.entity.Product;
import com.ecommerce.entity.User;
import com.ecommerce.entity.Wishlist;
import com.ecommerce.exception.ResourceNotFoundException;
import com.ecommerce.repository.ProductRepository;
import com.ecommerce.repository.UserRepository;
import com.ecommerce.repository.WishlistRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;

@Service
@RequiredArgsConstructor
public class WishlistService {

    private final WishlistRepository wishlistRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    @Transactional
    public Wishlist getOrCreateWishlist(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return wishlistRepository.findByUser(user)
                .orElseGet(() -> wishlistRepository.save(Wishlist.builder().user(user).products(new HashSet<>()).build()));
    }

    @Transactional
    public Wishlist addToWishlist(Long userId, Long productId) {
        Wishlist wishlist = getOrCreateWishlist(userId);
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        wishlist.getProducts().add(product);
        return wishlistRepository.save(wishlist);
    }

    @Transactional
    public Wishlist removeFromWishlist(Long userId, Long productId) {
        Wishlist wishlist = getOrCreateWishlist(userId);
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        wishlist.getProducts().remove(product);
        return wishlistRepository.save(wishlist);
    }
}
