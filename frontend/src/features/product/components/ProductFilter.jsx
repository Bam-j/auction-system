import {useState} from "react";
import {Input, Button, Collapse, Card, Typography} from "@material-tailwind/react";
import {MagnifyingGlassIcon, AdjustmentsHorizontalIcon} from "@heroicons/react/24/outline";

const ProductFilter = () => {
  const [openFilter, setOpenFilter] = useState(false); // 필터 토글 상태

  const toggleOpen = () => setOpenFilter((cur) => !cur);

  return (
      <div className="w-full max-w-screen-xl mx-auto mb-6">
        <div className="flex gap-2 items-center">
          <div className="relative flex w-full">
            <Input
                type="search"
                label="상품 검색 (아이템 이름, 설명 등)"
                className="pr-20"
                containerProps={{
                  className: "min-w-0",
                }}
                icon={<MagnifyingGlassIcon className="h-5 w-5"/>}
            />
          </div>

          <Button
              size="md"
              variant={openFilter ? "gradient" : "outlined"}
              className="flex items-center gap-2 shrink-0"
              onClick={toggleOpen}
          >
            <AdjustmentsHorizontalIcon className="h-5 w-5"/>
            필터
          </Button>
        </div>

        <Collapse open={openFilter}>
          <Card className="my-4 mx-auto w-full p-4 bg-gray-50 border border-gray-200 shadow-none">
            <Typography variant="h6" color="blue-gray" className="mb-2">
              상세 필터 옵션
            </Typography>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {/* TODO: 필터 결정하고 추가하기 */}
            </div>
          </Card>
        </Collapse>
      </div>
  );
};

export default ProductFilter;