package com.luan_nguyen.example205.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.luan_nguyen.example205.entity.*;
import com.luan_nguyen.example205.repository.*;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Optional;

@SuppressWarnings("unused")
@Service
public class CartService {

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    @Transactional
    public Cart addToCart(Long userId, int productId, int quantity) {
        // Tìm người dùng
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy user"));

        // Tìm giỏ hàng của người dùng
        Cart cart = cartRepository.findByUser(user);
        if (cart == null) {
            cart = new Cart();
            cart.setUser(user);
            cart.setCartItems(new ArrayList<>());
            cart.setTotalPrice(BigDecimal.ZERO); // Khởi tạo giá trị total price
        }

        // Tìm sản phẩm
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm"));

        // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
        CartItem existingItem = cart.getCartItems().stream()
                .filter(item -> item.getProduct().getId() == productId)
                .findFirst()
                .orElse(null);

        if (existingItem != null) {
            // Nếu sản phẩm đã có, cập nhật số lượng và tổng giá của CartItem
            existingItem.setQuantity(existingItem.getQuantity() + quantity);
            existingItem.setTotalPrice(product.getPrice().multiply(BigDecimal.valueOf(existingItem.getQuantity())));
        } else {
            // Nếu sản phẩm chưa có, tạo mới CartItem
            CartItem cartItem = new CartItem();
            cartItem.setCart(cart);
            cartItem.setProduct(product);
            cartItem.setQuantity(quantity);
            cartItem.setPrice(product.getPrice()); // Giá gốc sản phẩm
            cartItem.setTotalPrice(product.getPrice().multiply(BigDecimal.valueOf(quantity))); // Giá * số lượng

            cart.getCartItems().add(cartItem);
        }

        // Cập nhật tổng giá trị của giỏ hàng (lấy từ totalPrice của CartItem)
        BigDecimal newTotalPrice = cart.getCartItems().stream()
                .map(CartItem::getTotalPrice) // Lấy totalPrice (quantity * price)
                .reduce(BigDecimal.ZERO, BigDecimal::add); // Cộng tổng tất cả sản phẩm

        cart.setTotalPrice(newTotalPrice);

        // Lưu cart và cart items vào database
        cartRepository.save(cart);

        return cart;
    }

    public Cart getCartItemsByUserId(Long userId) {
        // Tìm user trong DB
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy user"));

        // Lấy giỏ hàng của user
        Cart cart = cartRepository.findByUser(user);

        if (cart == null) {
            throw new RuntimeException("Người dùng chưa có giỏ hàng");
        }

        return cart;
    }

    public int getTotalItemsInCart(Long userId) {
        Integer total = cartItemRepository.countTotalItemsInCart(userId);
        return total != null ? total : 0;
    }

    public void updateCartItemQuantity(Long cartItemId, int quantity) {
        CartItem cartItem = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm trong giỏ hàng!"));

        if (quantity <= 0) {
            cartItemRepository.delete(cartItem); // Nếu số lượng = 0 thì xóa sản phẩm khỏi giỏ hàng
        } else {
            // Cập nhật số lượng và totalPrice của CartItem
            cartItem.setQuantity(quantity);
            cartItem.setTotalPrice(cartItem.getPrice().multiply(BigDecimal.valueOf(quantity)));
            cartItemRepository.save(cartItem);
        }

        // Cập nhật tổng tiền giỏ hàng (Cart.totalPrice)
        Cart cart = cartItem.getCart();
        BigDecimal newTotalPrice = cart.getCartItems().stream()
                .map(CartItem::getTotalPrice)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        cart.setTotalPrice(newTotalPrice);
        cartRepository.save(cart);
    }

    public void removeCartItem(Long cartItemId) {
        // Tìm CartItem theo ID
        CartItem cartItem = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm trong giỏ hàng!"));

        // Lấy giỏ hàng chứa CartItem
        Cart cart = cartItem.getCart();

        // Xóa CartItem khỏi danh sách cartItems của Cart trước
        cart.getCartItems().remove(cartItem); // CẬP NHẬT danh sách trước khi xóa

        // Xóa CartItem khỏi database
        cartItemRepository.delete(cartItem);

        // Cập nhật tổng tiền giỏ hàng sau khi xóa sản phẩm
        BigDecimal newTotalPrice = cart.getCartItems().stream()
                .map(CartItem::getTotalPrice)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        cart.setTotalPrice(newTotalPrice);

        // Lưu lại giỏ hàng để cập nhật danh sách cartItems
        cartRepository.save(cart);
    }

}
