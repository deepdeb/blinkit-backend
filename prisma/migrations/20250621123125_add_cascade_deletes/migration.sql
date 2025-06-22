-- DropForeignKey
ALTER TABLE `address` DROP FOREIGN KEY `address_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `cart_product` DROP FOREIGN KEY `cart_product_product_id_fkey`;

-- DropForeignKey
ALTER TABLE `cart_product` DROP FOREIGN KEY `cart_product_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `category` DROP FOREIGN KEY `category_product_id_fkey`;

-- DropForeignKey
ALTER TABLE `category` DROP FOREIGN KEY `category_sub_category_id_fkey`;

-- DropForeignKey
ALTER TABLE `image` DROP FOREIGN KEY `image_product_id_fkey`;

-- DropForeignKey
ALTER TABLE `order` DROP FOREIGN KEY `order_address_id_fkey`;

-- DropForeignKey
ALTER TABLE `order` DROP FOREIGN KEY `order_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `order_item` DROP FOREIGN KEY `order_item_order_id_fkey`;

-- DropForeignKey
ALTER TABLE `order_item` DROP FOREIGN KEY `order_item_product_id_fkey`;

-- DropForeignKey
ALTER TABLE `sub_category` DROP FOREIGN KEY `sub_category_product_id_fkey`;

-- DropIndex
DROP INDEX `address_user_id_fkey` ON `address`;

-- DropIndex
DROP INDEX `cart_product_product_id_fkey` ON `cart_product`;

-- DropIndex
DROP INDEX `cart_product_user_id_fkey` ON `cart_product`;

-- DropIndex
DROP INDEX `category_product_id_fkey` ON `category`;

-- DropIndex
DROP INDEX `category_sub_category_id_fkey` ON `category`;

-- DropIndex
DROP INDEX `image_product_id_fkey` ON `image`;

-- DropIndex
DROP INDEX `order_address_id_fkey` ON `order`;

-- DropIndex
DROP INDEX `order_user_id_fkey` ON `order`;

-- DropIndex
DROP INDEX `order_item_product_id_fkey` ON `order_item`;

-- DropIndex
DROP INDEX `sub_category_product_id_fkey` ON `sub_category`;

-- AddForeignKey
ALTER TABLE `address` ADD CONSTRAINT `address_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `cart_product` ADD CONSTRAINT `cart_product_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `cart_product` ADD CONSTRAINT `cart_product_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `product`(`product_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `order` ADD CONSTRAINT `order_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `order` ADD CONSTRAINT `order_address_id_fkey` FOREIGN KEY (`address_id`) REFERENCES `address`(`address_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `order_item` ADD CONSTRAINT `order_item_order_id_fkey` FOREIGN KEY (`order_id`) REFERENCES `order`(`order_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `order_item` ADD CONSTRAINT `order_item_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `product`(`product_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `image` ADD CONSTRAINT `image_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `product`(`product_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `category` ADD CONSTRAINT `category_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `product`(`product_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `category` ADD CONSTRAINT `category_sub_category_id_fkey` FOREIGN KEY (`sub_category_id`) REFERENCES `sub_category`(`sub_category_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `sub_category` ADD CONSTRAINT `sub_category_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `product`(`product_id`) ON DELETE CASCADE ON UPDATE CASCADE;
