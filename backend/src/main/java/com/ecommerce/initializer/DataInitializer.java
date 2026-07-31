package com.ecommerce.initializer;

import com.ecommerce.entity.*;
import com.ecommerce.repository.*;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Arrays;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final BrandRepository brandRepository;
    private final ProductRepository productRepository;
    private final CouponRepository couponRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) {
        logger.info("Initializing E-Commerce database seed data...");

        // 1. Roles
        Role adminRole = roleRepository.findByName(ERole.ROLE_ADMIN)
                .orElseGet(() -> roleRepository.save(new Role(ERole.ROLE_ADMIN)));
        Role customerRole = roleRepository.findByName(ERole.ROLE_CUSTOMER)
                .orElseGet(() -> roleRepository.save(new Role(ERole.ROLE_CUSTOMER)));

        // 2. Default Users
        if (!userRepository.existsByEmail("admin@ecommerce.com")) {
            User admin = User.builder()
                    .fullName("Enterprise Admin")
                    .email("admin@ecommerce.com")
                    .password(passwordEncoder.encode("Admin@123"))
                    .phone("+1-555-0192")
                    .enabled(true)
                    .emailVerified(true)
                    .build();
            admin.getRoles().add(adminRole);
            admin.getRoles().add(customerRole);
            userRepository.save(admin);
            logger.info("Created Admin Account: admin@ecommerce.com / Admin@123");
        }

        if (!userRepository.existsByEmail("user@ecommerce.com")) {
            User customer = User.builder()
                    .fullName("John Doe")
                    .email("user@ecommerce.com")
                    .password(passwordEncoder.encode("User@123"))
                    .phone("+1-555-0144")
                    .enabled(true)
                    .emailVerified(true)
                    .build();
            customer.getRoles().add(customerRole);
            userRepository.save(customer);
            logger.info("Created Customer Account: user@ecommerce.com / User@123");
        }

        // 3. Categories
        if (categoryRepository.count() == 0) {
            Category electronics = categoryRepository.save(Category.builder()
                    .name("Electronics")
                    .slug("electronics")
                    .description("Smartphones, Laptops, Audio, and Smart Gadgets")
                    .imageUrl("https://images.unsplash.com/photo-1498049794561-7780e7231661?w=600&auto=format&fit=crop&q=80")
                    .featured(true)
                    .build());

            Category fashion = categoryRepository.save(Category.builder()
                    .name("Fashion & Apparel")
                    .slug("fashion-apparel")
                    .description("Trendy Wear, Footwear, and Luxury Accessories")
                    .imageUrl("https://images.unsplash.com/photo-1445205170230-053b83016050?w=600&auto=format&fit=crop&q=80")
                    .featured(true)
                    .build());

            Category home = categoryRepository.save(Category.builder()
                    .name("Home & Living")
                    .slug("home-living")
                    .description("Modern Furniture, Kitchen Appliances, and Decor")
                    .imageUrl("https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600&auto=format&fit=crop&q=80")
                    .featured(true)
                    .build());

            Category sports = categoryRepository.save(Category.builder()
                    .name("Sports & Fitness")
                    .slug("sports-fitness")
                    .description("Workout Gear, Athletics, and Camping Essentials")
                    .imageUrl("https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=80")
                    .featured(false)
                    .build());

            // 4. Brands
            Brand apple = brandRepository.save(Brand.builder().name("Apple").logoUrl("https://logo.clearbit.com/apple.com").description("Think Different").build());
            Brand samsung = brandRepository.save(Brand.builder().name("Samsung").logoUrl("https://logo.clearbit.com/samsung.com").description("Do What You Can't").build());
            Brand nike = brandRepository.save(Brand.builder().name("Nike").logoUrl("https://logo.clearbit.com/nike.com").description("Just Do It").build());
            Brand sony = brandRepository.save(Brand.builder().name("Sony").logoUrl("https://logo.clearbit.com/sony.com").description("Be Moved").build());

            // 5. Sample Products
            Product p1 = Product.builder()
                    .name("MacBook Pro 16\" M3 Max")
                    .slug("macbook-pro-16-m3-max")
                    .sku("MBP-16-M3")
                    .description("Ultra-powerful laptop featuring Liquid Retina XDR display, 36GB Unified Memory, and up to 22 hours battery life.")
                    .price(BigDecimal.valueOf(3499.00))
                    .discountPrice(BigDecimal.valueOf(3299.00))
                    .stockQuantity(15)
                    .category(electronics)
                    .brand(apple)
                    .rating(4.9)
                    .reviewCount(42)
                    .featured(true)
                    .active(true)
                    .images(Arrays.asList(
                            ProductImage.builder().imageUrl("https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80").primaryImage(true).build(),
                            ProductImage.builder().imageUrl("https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800&auto=format&fit=crop&q=80").primaryImage(false).build()
                    ))
                    .build();
            p1.getVariants().add(ProductVariant.builder().product(p1).name("36GB / 1TB SSD").sku("MBP-16-36GB").price(BigDecimal.valueOf(3299.00)).stockQuantity(10).build());
            productRepository.save(p1);

            Product p2 = Product.builder()
                    .name("Sony WH-1000XM5 Wireless Headphones")
                    .slug("sony-wh-1000xm5-headphones")
                    .sku("SONY-XM5-BLK")
                    .description("Industry-leading noise canceling with two processors, 8 microphones, and Auto NC Optimizer.")
                    .price(BigDecimal.valueOf(399.99))
                    .discountPrice(BigDecimal.valueOf(349.99))
                    .stockQuantity(30)
                    .category(electronics)
                    .brand(sony)
                    .rating(4.8)
                    .reviewCount(88)
                    .featured(true)
                    .active(true)
                    .images(Arrays.asList(
                            ProductImage.builder().imageUrl("https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80").primaryImage(true).build()
                    ))
                    .build();
            productRepository.save(p2);

            Product p3 = Product.builder()
                    .name("Nike Air Zoom Pegasus 40")
                    .slug("nike-air-zoom-pegasus-40")
                    .sku("NIKE-PEG-40")
                    .description("Springy ride for any run, the Peg's familiar, just-for-you feel returns to help you accomplish your goals.")
                    .price(BigDecimal.valueOf(130.00))
                    .discountPrice(BigDecimal.valueOf(109.99))
                    .stockQuantity(25)
                    .category(fashion)
                    .brand(nike)
                    .rating(4.7)
                    .reviewCount(19)
                    .featured(true)
                    .active(true)
                    .images(Arrays.asList(
                            ProductImage.builder().imageUrl("https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80").primaryImage(true).build()
                    ))
                    .build();
            productRepository.save(p3);

            Product p4 = Product.builder()
                    .name("Samsung Galaxy S24 Ultra 5G")
                    .slug("samsung-galaxy-s24-ultra")
                    .sku("SAM-S24U-512")
                    .description("Galaxy AI is here. Epic titanium armor, Built-in S Pen, and 200MP Quad Tele camera setup.")
                    .price(BigDecimal.valueOf(1299.99))
                    .discountPrice(BigDecimal.valueOf(1199.99))
                    .stockQuantity(18)
                    .category(electronics)
                    .brand(samsung)
                    .rating(4.9)
                    .reviewCount(64)
                    .featured(true)
                    .active(true)
                    .images(Arrays.asList(
                            ProductImage.builder().imageUrl("https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&auto=format&fit=crop&q=80").primaryImage(true).build()
                    ))
                    .build();
            productRepository.save(p4);
        }

        // 6. Coupons
        if (couponRepository.count() == 0) {
            couponRepository.save(Coupon.builder()
                    .code("WELCOME10")
                    .discountPercentage(BigDecimal.valueOf(10.0))
                    .minSpend(BigDecimal.valueOf(50.0))
                    .maxDiscount(BigDecimal.valueOf(100.0))
                    .validFrom(LocalDateTime.now())
                    .validUntil(LocalDateTime.now().plusMonths(6))
                    .usageLimit(500)
                    .active(true)
                    .build());

            couponRepository.save(Coupon.builder()
                    .code("SUMMER20")
                    .discountPercentage(BigDecimal.valueOf(20.0))
                    .minSpend(BigDecimal.valueOf(100.0))
                    .maxDiscount(BigDecimal.valueOf(200.0))
                    .validFrom(LocalDateTime.now())
                    .validUntil(LocalDateTime.now().plusMonths(3))
                    .usageLimit(200)
                    .active(true)
                    .build());

            couponRepository.save(Coupon.builder()
                    .code("FREESHIP")
                    .discountAmount(BigDecimal.valueOf(15.0))
                    .minSpend(BigDecimal.valueOf(30.0))
                    .validFrom(LocalDateTime.now())
                    .validUntil(LocalDateTime.now().plusMonths(12))
                    .usageLimit(1000)
                    .active(true)
                    .build());
        }

        logger.info("Database initial seed complete!");
    }
}
