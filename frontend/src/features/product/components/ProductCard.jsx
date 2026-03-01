import {
  Card, CardHeader, CardBody, CardFooter,
  Typography, Chip,
} from "@material-tailwind/react";
import defaultImage from "@/assets/images/general/grass_block.jpeg";

const ProductCard = ({product}) => {
  const getStatusInfo = (status) => {
    switch (status) {
      case "SELLING":
        return {color: "green", text: "판매중"};
      case "SOLD_OUT":
        return {color: "blue-gray", text: "품절"};
      case "BIDDING":
        return {color: "blue", text: "경매진행중"};
      case "CLOSED":
        return {color: "blue-gray", text: "경매마감"};
      default:
        return {color: "gray", text: "대기"};
    }
  };

  const statusInfo = getStatusInfo(product.status);
  const isSoldOut = product.status === "SOLD_OUT";

  return (
      <Card className={`w-full shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer ${isSoldOut ? 'opacity-75 grayscale-[0.5]' : ''}`}>
        <CardHeader floated={false} className="h-40 overflow-hidden relative">
          <img
              src={product.image || defaultImage}
              alt={product.title}
              className={`w-full h-full object-cover transform hover:scale-110 transition-transform duration-300 ${isSoldOut ? 'filter blur-[1px]' : ''}`}
          />
          <div className="absolute top-2 right-2">
            <Chip
                size="sm"
                color={isSoldOut ? "red" : statusInfo.color}
                value={isSoldOut ? "품절" : statusInfo.text}
                className="rounded-full px-2"
            />
          </div>
          {isSoldOut && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/20">
               <Typography variant="h5" color="white" className="font-bold drop-shadow-md">
                 품절되었습니다
               </Typography>
            </div>
          )}
        </CardHeader>

        <CardBody className="p-4 text-center">
          <Typography variant="h6" color="blue-gray" className="mb-2 truncate">
            {product.title}
          </Typography>
          <Typography color="gray" className="font-medium text-sm">
            {product.type === "AUCTION" ? "현재가" : "가격"}: {product.price.toLocaleString()}원
          </Typography>
          <Typography color="gray" className="text-xs mt-1">
            수량: {product.quantity}개
          </Typography>
        </CardBody>

        <CardFooter className="pt-0 pb-4 px-4 border-t border-gray-100 flex justify-between items-center mt-auto">
          <Typography className="text-xs text-blue-700">
            판매자: {product.seller}
          </Typography>
        </CardFooter>
      </Card>
  );
};

export default ProductCard;