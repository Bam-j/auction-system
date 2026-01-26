import {
  Card, CardHeader, CardBody, CardFooter,
  Typography, Chip,
} from "@material-tailwind/react";

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

  return (
      <Card className="w-full shadow-md hover:shadow-xl transition-shadow cursor-pointer">
        <CardHeader floated={false} className="h-40 overflow-hidden relative">
          <img
              src={product.image || {/* 이미지 없을 때의 기본 이미지 넣기 */}}
              alt={product.title}
              className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-300"
          />
          <div className="absolute top-2 right-2">
            <Chip
                size="sm"
                color={statusInfo.color}
                value={statusInfo.text}
                className="rounded-full px-2"
            />
          </div>
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
          <Typography className="text-xs text-gray-500">
            판매자: {product.seller}
          </Typography>
        </CardFooter>
      </Card>
  );
};

export default ProductCard;