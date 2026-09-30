import React from 'react';
import { useSubscription } from '../../hooks/useSubscription';

const UserAvatar = ({ 
  user, 
  size = 'md', 
  showPremiumBadge = true,
  className = '',
  onClick = null
}) => {
  const { isPremium } = useSubscription();

  const sizeClasses = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
    '2xl': 'w-20 h-20'
  };

  const badgeSizes = {
    xs: 'w-2 h-2',
    sm: 'w-2.5 h-2.5',
    md: 'w-3 h-3',
    lg: 'w-3.5 h-3.5',
    xl: 'w-4 h-4',
    '2xl': 'w-5 h-5'
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const avatarContent = user?.profile_image ? (
    <img
      src={user.profile_image}
      alt={user.nombre || 'Usuario'}
      className={`${sizeClasses[size]} rounded-full object-cover border-2 ${
        isPremium ? 'border-purple-400' : 'border-gray-200'
      }`}
      onError={(e) => {
        e.target.style.display = 'none';
        e.target.nextSibling.style.display = 'flex';
      }}
    />
  ) : null;

  const fallbackContent = (
    <div
      className={`${sizeClasses[size]} rounded-full flex items-center justify-center text-white font-semibold ${
        isPremium 
          ? 'bg-gradient-to-r from-purple-600 to-blue-600' 
          : 'bg-gray-400'
      } ${user?.profile_image ? 'hidden' : 'flex'}`}
      style={{ fontSize: size === 'xs' ? '8px' : size === 'sm' ? '10px' : '12px' }}
    >
      {getInitials(user?.nombre)}
    </div>
  );

  return (
    <div 
      className={`relative inline-block ${className} ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
    >
      {avatarContent}
      {fallbackContent}
      
      {/* Premium Badge */}
      {showPremiumBadge && isPremium && (
        <div className={`absolute -top-0.5 -right-0.5 ${badgeSizes[size]} bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center border-2 border-white`}>
          <svg 
            className={`${badgeSizes[size]} text-white`} 
            fill="currentColor" 
            viewBox="0 0 20 20"
          >
            <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732L14.146 12.8l-1.179 4.456a1 1 0 01-1.934 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732L9.854 7.2l1.179-4.456A1 1 0 0112 2z" clipRule="evenodd"></path>
          </svg>
        </div>
      )}
    </div>
  );
};

export default UserAvatar;