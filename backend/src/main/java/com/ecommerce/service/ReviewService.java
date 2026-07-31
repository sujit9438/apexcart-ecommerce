package com.ecommerce.service;

import com.ecommerce.entity.Product;
import com.ecommerce.entity.Review;
import com.ecommerce.entity.User;
import com.ecommerce.exception.BadRequestException;
import com.ecommerce.exception.ResourceNotFoundException;
import com.ecommerce.payload.request.ReviewRequest;
import com.ecommerce.repository.ProductRepository;
import com.ecommerce.repository.ReviewRepository;
import com.ecommerce.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public List<Review> getProductReviews(Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));
        return reviewRepository.findByProductOrderByCreatedAtDesc(product);
    }

    @Transactional
    public Review addReview(Long userId, ReviewRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        if (reviewRepository.existsByProductAndUser(product, user)) {
            throw new BadRequestException("You have already reviewed this product");
        }

        Review review = Review.builder()
                .product(product)
                .user(user)
                .rating(request.getRating())
                .comment(request.getComment())
                .build();

        Review savedReview = reviewRepository.save(review);

        // Update product overall rating average
        List<Review> reviews = reviewRepository.findByProductOrderByCreatedAtDesc(product);
        double avg = reviews.stream().mapToInt(Review::getRating).average().orElse(0.0);
        product.setRating((double) Math.round(avg * 10) / 10);
        product.setReviewCount(reviews.size());
        productRepository.save(product);

        return savedReview;
    }
}
