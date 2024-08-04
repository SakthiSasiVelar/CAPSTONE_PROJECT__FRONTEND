import './CustomArrow.css'

const CustomArrow = ({ className, style, onClick }) => (
  <div
    className={className}
    style={{ ...style , display:'block'}}
    onClick={onClick}
  />
);

export default CustomArrow;