import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
}

export function formatDate(dateString) {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('vi-VN', options);
}

export function formatDateTime(dateString) {
  if (!dateString) return '-';
  const date = new Date(dateString);
  const dateOptions = { year: 'numeric', month: '2-digit', day: '2-digit' };
  const timeOptions = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
  const datePart = date.toLocaleDateString('vi-VN', dateOptions);
  const timePart = date.toLocaleTimeString('vi-VN', timeOptions);
  return `${datePart} ${timePart}`;
}