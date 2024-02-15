import { Controller } from "react-hook-form";
import { Form, Input, InputProps } from "antd";

interface typeInputComponent extends InputProps {
  name: string,
  control: any,
  errors?: any,
  label?: string,
  placeholder?: string,
  className?: string,
  icon?: React.ReactNode,
  type?: string,
}

const InputComponent = ({
  name,
  control,
  errors,
  label = "",
  placeholder = "",
  className = "",
  icon,
  type = "text",
  ...props
}: typeInputComponent) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <Form.Item label={label} className={className}>
          <Input
            {...field}
            placeholder={placeholder}
            prefix={icon}
            type={type}
            {...props}
          />
          {errors?.[name] && (
            <div className="ant-form-item-explain-error">
              {errors?.[name]?.message}
            </div>
          )}
        </Form.Item>
      )}
    />
  );
};

export default InputComponent;
