export default function Input({ label, type = 'text', value, onChange, placeholder, name, required = false, icon: Icon, className = '' }) {
  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-champagne-dark tracking-wide">
          {label}
          {required && <span className="text-burgundy-light ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <Icon size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gold-muted" />
        )}
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className={`w-full elite-input rounded-xl px-4 py-3 text-sm ${Icon ? 'pl-11' : ''}`}
        />
      </div>
    </div>
  );
}
