package com.ecommerce.service;

import com.ecommerce.entity.Coupon;
import com.ecommerce.exception.BadRequestException;
import com.ecommerce.exception.ResourceNotFoundException;
import com.ecommerce.payload.request.CouponRequest;
import com.ecommerce.repository.CouponRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CouponService {

    private final CouponRepository couponRepository;

    public List<Coupon> getAllCoupons() {
        return couponRepository.findAll();
    }

    public Coupon getCouponByCode(String code) {
        return couponRepository.findByCode(code)
                .orElseThrow(() -> new ResourceNotFoundException("Coupon not found with code: " + code));
    }

    @Transactional
    public Coupon createCoupon(CouponRequest request) {
        if (couponRepository.existsByCode(request.getCode())) {
            throw new BadRequestException("Coupon code already exists");
        }
        Coupon coupon = Coupon.builder()
                .code(request.getCode().toUpperCase())
                .discountPercentage(request.getDiscountPercentage())
                .discountAmount(request.getDiscountAmount())
                .minSpend(request.getMinSpend())
                .maxDiscount(request.getMaxDiscount())
                .validFrom(request.getValidFrom())
                .validUntil(request.getValidUntil())
                .usageLimit(request.getUsageLimit() != null ? request.getUsageLimit() : 100)
                .active(request.isActive())
                .build();
        return couponRepository.save(coupon);
    }

    @Transactional
    public Coupon updateCoupon(Long id, CouponRequest request) {
        Coupon coupon = couponRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Coupon not found"));
        coupon.setCode(request.getCode().toUpperCase());
        coupon.setDiscountPercentage(request.getDiscountPercentage());
        coupon.setDiscountAmount(request.getDiscountAmount());
        coupon.setMinSpend(request.getMinSpend());
        coupon.setMaxDiscount(request.getMaxDiscount());
        coupon.setValidFrom(request.getValidFrom());
        coupon.setValidUntil(request.getValidUntil());
        coupon.setActive(request.isActive());
        return couponRepository.save(coupon);
    }

    @Transactional
    public void deleteCoupon(Long id) {
        Coupon coupon = couponRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Coupon not found"));
        couponRepository.delete(coupon);
    }
}
