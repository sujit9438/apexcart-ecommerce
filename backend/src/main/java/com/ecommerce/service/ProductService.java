package com.ecommerce.service;

import com.ecommerce.entity.Brand;
import com.ecommerce.entity.Category;
import com.ecommerce.entity.Product;
import com.ecommerce.entity.ProductImage;
import com.ecommerce.exception.ResourceNotFoundException;
import com.ecommerce.payload.request.ProductRequest;
import com.ecommerce.repository.BrandRepository;
import com.ecommerce.repository.CategoryRepository;
import com.ecommerce.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final BrandRepository brandRepository;

    public Page<Product> getAllProducts(int page, int size, String sortBy, String sortDir, Long categoryId, Long brandId, String search) {
        Sort sort = sortDir.equalsIgnoreCase(Sort.Direction.ASC.name()) ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);

        if (search != null && !search.trim().isEmpty()) {
            return productRepository.findAll((root, query, cb) -> {
                String pattern = "%" + search.toLowerCase() + "%";
                return cb.or(
                        cb.like(cb.lower(root.get("name")), pattern),
                        cb.like(cb.lower(root.get("description")), pattern)
                );
            }, pageable);
        }

        if (categoryId != null) {
            return productRepository.findByCategoryIdAndActiveTrue(categoryId, pageable);
        }

        if (brandId != null) {
            return productRepository.findByBrandIdAndActiveTrue(brandId, pageable);
        }

        return productRepository.findAll(pageable);
    }

    public Product getProductById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
    }

    public Product getProductBySlug(String slug) {
        return productRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with slug: " + slug));
    }

    public List<Product> getFeaturedProducts() {
        return productRepository.findByFeaturedTrueAndActiveTrue();
    }

    public List<Product> getNewArrivals() {
        return productRepository.findTop8ByActiveTrueOrderByCreatedAtDesc();
    }

    public List<Product> searchProducts(String keyword) {
        return productRepository.searchProducts(keyword);
    }

    @Transactional
    public Product createProduct(ProductRequest request) {
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));

        Brand brand = null;
        if (request.getBrandId() != null) {
            brand = brandRepository.findById(request.getBrandId())
                    .orElseThrow(() -> new ResourceNotFoundException("Brand not found"));
        }

        String slug = request.getName().toLowerCase().replaceAll("[^a-z0-9]", "-").replaceAll("-+", "-");

        Product product = Product.builder()
                .name(request.getName())
                .slug(slug + "-" + System.currentTimeMillis())
                .sku(request.getSku() != null ? request.getSku() : "SKU-" + System.currentTimeMillis())
                .description(request.getDescription())
                .price(request.getPrice())
                .discountPrice(request.getDiscountPrice())
                .stockQuantity(request.getStockQuantity())
                .category(category)
                .brand(brand)
                .featured(request.isFeatured())
                .active(request.isActive())
                .build();

        if (request.getImageUrls() != null && !request.getImageUrls().isEmpty()) {
            List<ProductImage> images = request.getImageUrls().stream()
                    .map(url -> ProductImage.builder().imageUrl(url).primaryImage(false).build())
                    .collect(Collectors.toList());
            if (!images.isEmpty()) images.get(0).setPrimaryImage(true);
            product.setImages(images);
        }

        return productRepository.save(product);
    }

    @Transactional
    public Product updateProduct(Long id, ProductRequest request) {
        Product product = getProductById(id);

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));

        Brand brand = null;
        if (request.getBrandId() != null) {
            brand = brandRepository.findById(request.getBrandId())
                    .orElseThrow(() -> new ResourceNotFoundException("Brand not found"));
        }

        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setDiscountPrice(request.getDiscountPrice());
        product.setStockQuantity(request.getStockQuantity());
        product.setCategory(category);
        product.setBrand(brand);
        product.setFeatured(request.isFeatured());
        product.setActive(request.isActive());

        if (request.getImageUrls() != null && !request.getImageUrls().isEmpty()) {
            product.getImages().clear();
            List<ProductImage> images = request.getImageUrls().stream()
                    .map(url -> ProductImage.builder().imageUrl(url).primaryImage(false).build())
                    .collect(Collectors.toList());
            if (!images.isEmpty()) images.get(0).setPrimaryImage(true);
            product.getImages().addAll(images);
        }

        return productRepository.save(product);
    }

    @Transactional
    public void deleteProduct(Long id) {
        Product product = getProductById(id);
        productRepository.delete(product);
    }
}
