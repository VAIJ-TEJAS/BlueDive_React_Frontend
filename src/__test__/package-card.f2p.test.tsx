/**
 * F2P tests for PackageCard component bug fixes.
 * These tests would fail on the base branch and pass after the fixes.
 */
import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import PackageCard from '../components/package-card';
import { IPackage } from '../types/package.types';

// Mock the IPackage type for testing
const mockPackage: IPackage = {
  id: 1,
  name: 'Test Package',
  description: 'Test Description',
  display_price: 1000,
  display_discount_percentage: 10,
  duration: '3 days',
  cover_image: 'test-image.jpg'
};

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('PackageCard F2P Tests', () => {
  describe('Null handling', () => {
    it('should handle null display_price', () => {
      // Bug: Should handle null display_price gracefully
      const packageWithNullPrice = { ...mockPackage, display_price: null };
      
      renderWithRouter(<PackageCard item={packageWithNullPrice} />);
      
      // Should display 0 instead of crashing
      expect(screen.getByText(/₹ 0\*/)).toBeInTheDocument();
    });

    it('should handle undefined display_price', () => {
      // Bug: Should handle undefined display_price gracefully
      const packageWithUndefinedPrice = { ...mockPackage, display_price: undefined };
      
      renderWithRouter(<PackageCard item={packageWithUndefinedPrice} />);
      
      // Should display 0 instead of crashing
      expect(screen.getByText(/₹ 0\*/)).toBeInTheDocument();
    });

    it('should handle null cover_image', () => {
      // Bug: Should handle null cover_image gracefully
      const packageWithNullImage = { ...mockPackage, cover_image: null };
      
      renderWithRouter(<PackageCard item={packageWithNullImage} />);
      
      // Should use placeholder image
      const img = screen.getByAltText('Package');
      expect(img).toHaveAttribute('src', '/placeholder-image.jpg');
    });

    it('should handle undefined cover_image', () => {
      // Bug: Should handle undefined cover_image gracefully
      const packageWithUndefinedImage = { ...mockPackage, cover_image: undefined };
      
      renderWithRouter(<PackageCard item={packageWithUndefinedImage} />);
      
      // Should use placeholder image
      const img = screen.getByAltText('Package');
      expect(img).toHaveAttribute('src', '/placeholder-image.jpg');
    });

    it('should handle null name', () => {
      // Bug: Should handle null name gracefully
      const packageWithNullName = { ...mockPackage, name: null };
      
      renderWithRouter(<PackageCard item={packageWithNullName} />);
      
      // Should display 'Unknown Package'
      expect(screen.getByText('Unknown Package')).toBeInTheDocument();
    });

    it('should handle null duration', () => {
      // Bug: Should handle null duration gracefully
      const packageWithNullDuration = { ...mockPackage, duration: null };
      
      renderWithRouter(<PackageCard item={packageWithNullDuration} />);
      
      // Should display 'N/A'
      expect(screen.getByText('N/A')).toBeInTheDocument();
    });

    it('should handle null description', () => {
      // Bug: Should handle null description gracefully
      const packageWithNullDescription = { ...mockPackage, description: null };
      
      renderWithRouter(<PackageCard item={packageWithNullDescription} />);
      
      // Should display fallback text
      expect(screen.getByText('No description available')).toBeInTheDocument();
    });
  });
});
