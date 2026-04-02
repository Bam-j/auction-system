import '@material-tailwind/react';

/**
 * material-tailwind에서 React, TypeScript 버전을 받지 못해 발생하는 타입 불일치를 해결하기 위한 타입 정의 파일
 */

declare module '@material-tailwind/react' {
  interface GenericProps {
    [key: string]: any;
    placeholder?: string;
    onPointerEnterCapture?: React.PointerEventHandler<HTMLElement>;
    onPointerLeaveCapture?: React.PointerEventHandler<HTMLElement>;
    onResize?: React.ReactEventHandler<HTMLElement>;
    onResizeCapture?: React.ReactEventHandler<HTMLElement>;
  }

  interface NavbarProps extends GenericProps {}
  interface TypographyProps extends GenericProps {
    as?: any;
  }
  interface ButtonProps extends GenericProps {
    as?: any;
  }
  interface ButtonGroupProps extends GenericProps {}
  interface CardProps extends GenericProps {}
  interface CardHeaderProps extends GenericProps {}
  interface CardBodyProps extends GenericProps {}
  interface CardFooterProps extends GenericProps {}
  interface ListProps extends GenericProps {}
  interface ListItemProps extends GenericProps {}
  interface ListItemPrefixProps extends GenericProps {}
  interface IconButtonProps extends GenericProps {}
  interface InputProps extends GenericProps {}
  interface TextareaProps extends GenericProps {}
  interface SelectProps extends GenericProps {}
  interface OptionProps extends GenericProps {}
  interface MenuProps extends GenericProps {}
  interface MenuHandlerProps extends GenericProps {}
  interface MenuListProps extends GenericProps {}
  interface MenuItemProps extends GenericProps {}
  interface CheckboxProps extends GenericProps {}
  interface ChipProps extends GenericProps {}
  interface RadioProps extends GenericProps {}
  interface SwitchProps extends GenericProps {}
  interface DialogProps extends GenericProps {}
  interface DialogHeaderProps extends GenericProps {}
  interface DialogBodyProps extends GenericProps {}
  interface DialogFooterProps extends GenericProps {}
  interface TooltipProps extends GenericProps {}
  interface PopoverProps extends GenericProps {}
  interface PopoverHandlerProps extends GenericProps {}
  interface PopoverContentProps extends GenericProps {}
  interface TabsProps extends GenericProps {}
  interface TabsHeaderProps extends GenericProps {}
  interface TabsBodyProps extends GenericProps {}
  interface TabProps extends GenericProps {}
  interface TabPanelProps extends GenericProps {}
}
