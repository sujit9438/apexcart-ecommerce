package com.ecommerce.repository;

import com.ecommerce.entity.Product;
import com.ecommerce.entity.Review;
import com.ecommerce.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByProductOrderByCreatedAtDesc(Product product);
    Boolean existsByProductAndUser(Product product, User user);
}
