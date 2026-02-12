import React from "react";
import {
  Dialog, DialogHeader, DialogBody,
  DialogFooter, Typography,
} from "@material-tailwind/react";
import {XMarkIcon} from "@heroicons/react/24/outline";

const CommonModal = ({
                       open,
                       handleOpen,
                       title,
                       children,
                       footer,
                       size = "md",
                       bodyClassName = ""
                     }) => {
  return (
      <Dialog open={open} handler={handleOpen} size={size} className="overflow-hidden">
        <DialogHeader className="justify-between border-b border-gray-200">
          <Typography variant="h5" color="blue-gray">
            {title}
          </Typography>
          <XMarkIcon
              className="h-5 w-5 cursor-pointer text-gray-500 hover:text-gray-900"
              onClick={handleOpen}
          />
        </DialogHeader>

        <DialogBody className={`p-0 ${bodyClassName}`}>
          {children}
        </DialogBody>

        {footer && (
            <DialogFooter className="border-t border-gray-200 bg-gray-50/50">
              {footer}
            </DialogFooter>
        )}
      </Dialog>
  );
};

export default CommonModal;