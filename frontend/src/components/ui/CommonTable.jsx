import React from "react";
import {
  Card, CardHeader, Typography,
  CardBody, CardFooter,
} from "@material-tailwind/react";

const CommonTable = ({title, headers, children, pagination}) => {
  return (
      <Card className="h-full w-full shadow-sm border border-gray-200">
        <CardHeader floated={false} shadow={false} className="rounded-none">
          <div className="flex items-center justify-between gap-8 mb-2">
            <div>
              <Typography variant="h5" color="blue-gray">
                {title}
              </Typography>
            </div>
          </div>
        </CardHeader>

        <CardBody className="overflow-scroll px-0 py-0">
          <table className="mt-4 w-full min-w-max table-auto text-left">
            <thead>
            <tr>
              {headers.map((head) => (
                  <th
                      key={head}
                      className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4"
                  >
                    <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal leading-none opacity-70"
                    >
                      {head}
                    </Typography>
                  </th>
              ))}
            </tr>
            </thead>

            <tbody>
            {children}
            </tbody>
          </table>
        </CardBody>

        {pagination && (
            <CardFooter className="flex items-center justify-center border-t border-blue-gray-50 p-4">
              {pagination}
            </CardFooter>
        )}
      </Card>
  );
};

export default CommonTable;