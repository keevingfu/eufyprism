import React from 'react';
import { Space, DatePicker, Typography } from 'antd';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;
const { Text } = Typography;

interface DateRangeFilterProps {
  onChange?: (dates: [Dayjs | null, Dayjs | null] | null) => void;
  placeholder?: [string, string];
  style?: React.CSSProperties;
}

const DateRangeFilter: React.FC<DateRangeFilterProps> = ({
  onChange,
  placeholder = ['Start date', 'End date'],
  style
}) => {
  const handleChange = (dates: [Dayjs | null, Dayjs | null] | null) => {
    if (onChange) {
      onChange(dates);
    }
  };

  return (
    <Space direction="vertical" style={{ width: '100%', ...style }}>
      <Text type="secondary">Date Range</Text>
      <RangePicker
        style={{ width: '100%' }}
        onChange={handleChange}
        placeholder={placeholder}
        format="YYYY-MM-DD"
        defaultValue={[dayjs().subtract(30, 'day'), dayjs()]}
      />
    </Space>
  );
};

export default DateRangeFilter;