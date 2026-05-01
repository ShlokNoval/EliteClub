import { getStatusColor } from '../../utils/helpers';

export default function Badge({ status, className = '' }) {
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border capitalize ${getStatusColor(status)} ${className}`}>
      {status}
    </span>
  );
}
