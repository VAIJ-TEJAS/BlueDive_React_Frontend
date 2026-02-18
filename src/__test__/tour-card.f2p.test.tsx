/**
 * F2P tests for TourCard component bug fixes.
 * These tests would fail on the base branch and pass after the fixes.
 */
import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import TourCard from '../components/tour-card';
import { ITour } from '../types/tours.types';

// Mock the ITour type for testing
const mockTour: ITour = {
  id: 1,
  status: 'Confirmed',
  trip: {
    id: 1,
    start_date: '2025-02-20',
    package: {
      id: 1,
      name: 'Test Package',
      duration: '3 days',
      cover_image: 'test-image.jpg'
    }
  }
};

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('TourCard F2P Tests', () => {
  describe('Null handling', () => {
    it('should handle null trip', () => {
      // Bug: Should handle null trip gracefully
      const tourWithNullTrip = { ...mockTour, trip: null };
      
      renderWithRouter(<TourCard item={tourWithNullTrip} />);
      
      // Should display fallback values
      expect(screen.getByText('Unknown Package')).toBeInTheDocument();
      expect(screen.getByText('N/A')).toBeInTheDocument();
    });

    it('should handle null package', () => {
      // Bug: Should handle null package gracefully
      const tourWithNullPackage = { 
        ...mockTour, 
        trip: { ...mockTour.trip, package: null }
      };
      
      renderWithRouter(<TourCard item={tourWithNullPackage} />);
      
      // Should display fallback values
      expect(screen.getByText('Unknown Package')).toBeInTheDocument();
      expect(screen.getByText('N/A')).toBeInTheDocument();
    });

    it('should handle null package name', () => {
      // Bug: Should handle null package name gracefully
      const tourWithNullPackageName = { 
        ...mockTour, 
        trip: { 
          ...mockTour.trip, 
          package: { ...mockTour.trip.package, name: null }
        }
      };
      
      renderWithRouter(<TourCard item={tourWithNullPackageName} />);
      
      // Should display 'Unknown Package'
      expect(screen.getByText('Unknown Package')).toBeInTheDocument();
    });

    it('should handle null package duration', () => {
      // Bug: Should handle null package duration gracefully
      const tourWithNullDuration = { 
        ...mockTour, 
        trip: { 
          ...mockTour.trip, 
          package: { ...mockTour.trip.package, duration: null }
        }
      };
      
      renderWithRouter(<TourCard item={tourWithNullDuration} />);
      
      // Should display 'N/A'
      expect(screen.getByText('N/A')).toBeInTheDocument();
    });

    it('should handle null package cover_image', () => {
      // Bug: Should handle null package cover_image gracefully
      const tourWithNullImage = { 
        ...mockTour, 
        trip: { 
          ...mockTour.trip, 
          package: { ...mockTour.trip.package, cover_image: null }
        }
      };
      
      renderWithRouter(<TourCard item={tourWithNullImage} />);
      
      // Should use placeholder image
      const img = screen.getByAltText('Package');
      expect(img).toHaveAttribute('src', '/placeholder-image.jpg');
    });

    it('should handle null start_date', () => {
      // Bug: Should handle null start_date gracefully
      const tourWithNullStartDate = { 
        ...mockTour, 
        trip: { ...mockTour.trip, start_date: null }
      };
      
      renderWithRouter(<TourCard item={tourWithNullStartDate} />);
      
      // Should display 'N/A'
      expect(screen.getByText('Starts: N/A')).toBeInTheDocument();
    });

    it('should handle null status', () => {
      // Bug: Should handle null status gracefully
      const tourWithNullStatus = { ...mockTour, status: null };
      
      renderWithRouter(<TourCard item={tourWithNullStatus} />);
      
      // Should display 'Unknown'
      expect(screen.getByText('Unknown')).toBeInTheDocument();
    });

    it('should handle null tour id', () => {
      // Bug: Should handle null tour id gracefully
      const tourWithNullId = { ...mockTour, id: null };
      
      renderWithRouter(<TourCard item={tourWithNullId} />);
      
      // Should use 'unknown' in link
      const link = screen.getByText('Show Details').closest('a');
      expect(link).toHaveAttribute('href', '/user-tour/unknown');
    });
  });
});
