import React from 'react';

interface CriteriaProps {
  label: string;
  isValid: boolean;
}

const CriteriaItem: React.FC<CriteriaProps> = ({ label, isValid }) => (
  <div className="flex items-center gap-2 text-xs transition-colors duration-200">
    <div className={`w-1.5 h-1.5 rounded-full ${isValid ? 'bg-green-500' : 'bg-gray-300'}`} />
    <span className={isValid ? 'text-green-600' : 'text-gray-500'}>
      {label}
    </span>
  </div>
);

interface PasswordCriteriaProps {
  password: string;
}

export const validatePassword = (password: string) => {
  return {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    special: /[\d!@#$%^&*()_+={}\[\]|\:;"'<>,.?/-]/.test(password),
  };
};

const PasswordCriteria: React.FC<PasswordCriteriaProps> = ({ password }) => {
  const criteria = validatePassword(password);

  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-2">
      <CriteriaItem label="At least 8 characters" isValid={criteria.length} />
      <CriteriaItem label="One uppercase letter" isValid={criteria.uppercase} />
      <CriteriaItem label="One lowercase letter" isValid={criteria.lowercase} />
      <CriteriaItem label="Number or special character" isValid={criteria.special} />
    </div>
  );
};

export default PasswordCriteria;
