import * as React from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";

interface SelectProps {
  onChange: (value: string) => void;
}

const SelectSmall: React.FC<SelectProps> = ({ onChange }) => {
  const [status, setStatus] = React.useState("");

  const handleChange = (event: SelectChangeEvent<string>) => {
    const value = event.target.value;
    setStatus(value);
    onChange(value);
  };
  return (
    <FormControl sx={{ m: 1, minWidth: 177 }} size="small">
      <InputLabel id="demo-select-small-label">Status</InputLabel>
      <Select
        labelId="select-status"
        id="status"
        value={status}
        label="Status"
        onChange={handleChange}
      >
        <MenuItem value="all">All</MenuItem>
        <MenuItem value="active">Active</MenuItem>
        <MenuItem value="inactive">Inactive</MenuItem>
      </Select>
    </FormControl>
  );
};

export default SelectSmall;
