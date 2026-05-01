export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export function maskPhone(phone) {
  if (!phone) return '—';
  return phone.slice(0, 7) + '•••••' + phone.slice(-2);
}

export function maskEmail(email) {
  if (!email) return '—';
  const [user, domain] = email.split('@');
  return user.slice(0, 2) + '•••@' + domain;
}

export function getStatusColor(status) {
  const colors = {
    active: 'text-green-400 bg-green-400/10 border-green-400/20',
    verified: 'text-green-400 bg-green-400/10 border-green-400/20',
    inactive: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
    pending: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
    expired: 'text-red-400 bg-red-400/10 border-red-400/20',
    rejected: 'text-red-400 bg-red-400/10 border-red-400/20',
    invalid: 'text-red-400 bg-red-400/10 border-red-400/20',
    valid: 'text-green-400 bg-green-400/10 border-green-400/20',
    partner: 'text-gold bg-gold/10 border-gold/20',
    applicant: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
  };
  return colors[status] || 'text-smoke bg-smoke/10 border-smoke/20';
}

export function generateMemberId() {
  const year = new Date().getFullYear();
  const rand = Math.floor(Math.random() * 9000) + 1000;
  return `EC-${year}-${rand}`;
}
