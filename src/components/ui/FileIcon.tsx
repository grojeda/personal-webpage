type FileIconProps = {
  className?: string;
};

const FileIcon = ({ className = '' }: FileIconProps) => (
  <svg
    viewBox="0 0 64 64"
    role="img"
    aria-hidden="true"
    className={className}
  >
    <path
      d="M14 6h24l16 12v40H14V6Z"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M38 6v12h16"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default FileIcon;
