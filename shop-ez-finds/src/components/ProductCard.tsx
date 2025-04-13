import React from "react";
import { useNavigate } from "react-router-dom";
import { Star, ShoppingCart, Heart } from "lucide-react";
import { Product } from "@/types/product";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/context/CartContext";

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  const formattedPrice = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(product.price);
  
  const discountedPrice = product.discount
    ? new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0
      }).format(product.price * (1 - product.discount / 100))
    : null;

  return (
    <div className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow bg-white flex flex-col">
      <div className="relative pt-[100%]">
        <img
          src={product.image}
          alt={product.name}
          className="absolute inset-0 w-full h-full object-cover"
        />
        {product.discount && (
          <Badge variant="shopez" className="absolute top-2 right-2">
            {product.discount}% OFF
          </Badge>
        )}
      </div>

      <div className="p-4 flex flex-col flex-grow">
        <div className="mb-2">
          <h3
            className="text-lg font-medium text-gray-900 hover:text-shopez-600 cursor-pointer mb-1"
            onClick={() => navigate(`/product/${product.id}`)}
          >
            {product.name}
          </h3>
          <p className="text-sm text-gray-500 line-clamp-2">{product.description}</p>
        </div>

        <div className="flex items-center mt-auto mb-3">
          <div className="flex items-center">
            <Star className="h-4 w-4 fill-current text-yellow-500 mr-1" />
            <span className="text-sm font-medium">{product.rating.toFixed(1)}</span>
          </div>
          <span className="text-sm text-gray-500 ml-1">({product.reviews})</span>
          
          <div className="ml-auto">
            {product.stock > 0 ? (
              <span className="text-xs text-green-600">In Stock</span>
            ) : (
              <span className="text-xs text-red-600">Out of Stock</span>
            )}
          </div>
        </div>

        <div className="mt-2 flex items-center justify-between">
          <div>
            {discountedPrice ? (
              <div className="flex items-center">
                <span className="font-medium text-shopez-accent">{discountedPrice}</span>
                <span className="text-sm text-gray-500 line-through ml-2">{formattedPrice}</span>
              </div>
            ) : (
              <span className="font-medium">{formattedPrice}</span>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            <Button 
              variant="outline" 
              size="icon"
              className="rounded-full h-8 w-8"
            >
              <Heart className="h-4 w-4" />
            </Button>
            <Button 
              variant="default" 
              size="icon"
              className="rounded-full h-8 w-8 bg-shopez-accent hover:bg-shopez-500"
              onClick={() => addToCart(product)}
              disabled={product.stock <= 0}
            >
              <ShoppingCart className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
