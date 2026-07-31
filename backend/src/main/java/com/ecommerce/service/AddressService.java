package com.ecommerce.service;

import com.ecommerce.entity.Address;
import com.ecommerce.entity.User;
import com.ecommerce.exception.ResourceNotFoundException;
import com.ecommerce.repository.AddressRepository;
import com.ecommerce.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AddressService {

    private final AddressRepository addressRepository;
    private final UserRepository userRepository;

    public List<Address> getUserAddresses(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return addressRepository.findByUser(user);
    }

    public Address getAddressById(Long id) {
        return addressRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Address not found with id: " + id));
    }

    @Transactional
    public Address createAddress(Long userId, Address address) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        address.setUser(user);
        if (address.isDefaultAddress()) {
            unsetOtherDefaults(user);
        }
        return addressRepository.save(address);
    }

    @Transactional
    public Address updateAddress(Long userId, Long addressId, Address addressDetails) {
        Address address = getAddressById(addressId);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        address.setFullName(addressDetails.getFullName());
        address.setPhone(addressDetails.getPhone());
        address.setStreet(addressDetails.getStreet());
        address.setCity(addressDetails.getCity());
        address.setState(addressDetails.getState());
        address.setZipCode(addressDetails.getZipCode());
        address.setCountry(addressDetails.getCountry());
        
        if (addressDetails.isDefaultAddress()) {
            unsetOtherDefaults(user);
            address.setDefaultAddress(true);
        }

        return addressRepository.save(address);
    }

    @Transactional
    public void deleteAddress(Long addressId) {
        Address address = getAddressById(addressId);
        addressRepository.delete(address);
    }

    private void unsetOtherDefaults(User user) {
        List<Address> addresses = addressRepository.findByUser(user);
        addresses.forEach(a -> {
            a.setDefaultAddress(false);
            addressRepository.save(a);
        });
    }
}
