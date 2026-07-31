package com.ecommerce.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "product_images")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductImage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String imageUrl;

    @Builder.Default
    private boolean primaryImage = false;
}
