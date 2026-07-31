package com.ecommerce.repository;

import com.ecommerce.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long>, JpaSpecificationExecutor<Product> {
    Optional<Product> findBySlug(String slug);
    List<Product> findByFeaturedTrueAndActiveTrue();
    List<Product> findTop8ByActiveTrueOrderByCreatedAtDesc();
    
    @Query("SELECT p FROM Product p WHERE p.active = true AND " +
           "(LOWER(p.name) LIKE CONCAT('%', LOWER(:keyword), '%') OR " +
           "LOWER(p.description) LIKE CONCAT('%', LOWER(:keyword), '%') OR " +
           "LOWER(p.category.name) LIKE CONCAT('%', LOWER(:keyword), '%') OR " +
           "LOWER(p.brand.name) LIKE CONCAT('%', LOWER(:keyword), '%'))")
    List<Product> searchProducts(@Param("keyword") String keyword);

    @Query("SELECT p FROM Product p WHERE p.active = true AND p.stockQuantity < :threshold")
    List<Product> findLowStockProducts(@Param("threshold") Integer threshold);

    Page<Product> findByCategoryIdAndActiveTrue(Long categoryId, Pageable pageable);
    Page<Product> findByBrandIdAndActiveTrue(Long brandId, Pageable pageable);
}
