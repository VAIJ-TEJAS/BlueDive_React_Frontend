/**
 * Tests for image carousel component
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { ImageCarousel, useCarousel, CarouselImage } from '../components/image-carousel';

// Mock timers for auto-play functionality
jest.useFakeTimers();

describe('ImageCarousel Component', () => {
  const mockImages: CarouselImage[] = [
    {
      id: '1',
      src: 'https://example.com/image1.jpg',
      alt: 'Test Image 1',
      title: 'First Image',
      description: 'Description for first image'
    },
    {
      id: '2',
      src: 'https://example.com/image2.jpg',
      alt: 'Test Image 2',
      title: 'Second Image',
      description: 'Description for second image'
    },
    {
      id: '3',
      src: 'https://example.com/image3.jpg',
      alt: 'Test Image 3'
    }
  ];

  beforeEach(() => {
    jest.clearAllTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('Basic rendering', () => {
    it('should render carousel with images', () => {
      render(<ImageCarousel images={mockImages} />);
      
      const image = screen.getByAltText('Test Image 1');
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute('src', 'https://example.com/image1.jpg');
    });

    it('should render empty state when no images', () => {
      render(<ImageCarousel images={[]} />);
      
      expect(screen.getByText('No images available')).toBeInTheDocument();
    });

    it('should render title and description overlay', () => {
      render(<ImageCarousel images={mockImages} />);
      
      expect(screen.getByText('First Image')).toBeInTheDocument();
      expect(screen.getByText('Description for first image')).toBeInTheDocument();
    });

    it('should not render overlay when no title or description', () => {
      const imagesWithoutOverlay = [
        { id: '1', src: 'test.jpg', alt: 'test' }
      ];
      
      render(<ImageCarousel images={imagesWithoutOverlay} />);
      
      expect(screen.queryByText('First Image')).not.toBeInTheDocument();
    });
  });

  describe('Navigation functionality', () => {
    it('should show navigation buttons by default', () => {
      render(<ImageCarousel images={mockImages} />);
      
      const prevButton = screen.getByLabelText('Previous image');
      const nextButton = screen.getByLabelText('Next image');
      
      expect(prevButton).toBeInTheDocument();
      expect(nextButton).toBeInTheDocument();
    });

    it('should hide navigation when showNavigation is false', () => {
      render(<ImageCarousel images={mockImages} showNavigation={false} />);
      
      expect(screen.queryByLabelText('Previous image')).not.toBeInTheDocument();
      expect(screen.queryByLabelText('Next image')).not.toBeInTheDocument();
    });

    it('should navigate to next image when next button is clicked', async () => {
      render(<ImageCarousel images={mockImages} />);
      
      const nextButton = screen.getByLabelText('Next image');
      await userEvent.click(nextButton);
      
      expect(screen.getByAltText('Test Image 2')).toBeInTheDocument();
      expect(screen.getByText('Second Image')).toBeInTheDocument();
    });

    it('should navigate to previous image when prev button is clicked', async () => {
      render(<ImageCarousel images={mockImages} />);
      
      // Go to second image first
      const nextButton = screen.getByLabelText('Next image');
      await userEvent.click(nextButton);
      
      // Then go back
      const prevButton = screen.getByLabelText('Previous image');
      await userEvent.click(prevButton);
      
      expect(screen.getByAltText('Test Image 1')).toBeInTheDocument();
    });

    it('should disable prev button at start when infinite is false', () => {
      render(<ImageCarousel images={mockImages} infinite={false} />);
      
      const prevButton = screen.getByLabelText('Previous image');
      expect(prevButton).toBeDisabled();
    });

    it('should disable next button at end when infinite is false', async () => {
      render(<ImageCarousel images={mockImages} infinite={false} />);
      
      // Navigate to last image
      const nextButton = screen.getByLabelText('Next image');
      await userEvent.click(nextButton);
      await userEvent.click(nextButton);
      
      expect(screen.getByLabelText('Next image')).toBeDisabled();
    });
  });

  describe('Indicators functionality', () => {
    it('should show indicators by default', () => {
      render(<ImageCarousel images={mockImages} />);
      
      const indicators = screen.getAllByRole('button', { name: /Go to image/ });
      expect(indicators).toHaveLength(3);
    });

    it('should hide indicators when showIndicators is false', () => {
      render(<ImageCarousel images={mockImages} showIndicators={false} />);
      
      expect(screen.queryByRole('button', { name: /Go to image/ })).not.toBeInTheDocument();
    });

    it('should navigate to correct image when indicator is clicked', async () => {
      render(<ImageCarousel images={mockImages} />);
      
      const indicators = screen.getAllByRole('button', { name: /Go to image/ });
      await userEvent.click(indicators[2]); // Click third indicator
      
      expect(screen.getByAltText('Test Image 3')).toBeInTheDocument();
    });

    it('should highlight current indicator', () => {
      render(<ImageCarousel images={mockImages} />);
      
      const indicators = screen.getAllByRole('button', { name: /Go to image/ });
      expect(indicators[0]).toHaveClass('bg-white');
      expect(indicators[1]).toHaveClass('bg-white/50');
    });
  });

  describe('Auto-play functionality', () => {
    it('should auto-play when autoPlay is true', () => {
      render(<ImageCarousel images={mockImages} autoPlay={true} interval={1000} />);
      
      // Should start with first image
      expect(screen.getByAltText('Test Image 1')).toBeInTheDocument();
      
      // Advance time
      act(() => {
        jest.advanceTimersByTime(1000);
      });
      
      // Should show second image
      expect(screen.getByAltText('Test Image 2')).toBeInTheDocument();
    });

    it('should show play/pause button when autoPlay is true', () => {
      render(<ImageCarousel images={mockImages} autoPlay={true} />);
      
      const playPauseButton = screen.getByLabelText('Pause');
      expect(playPauseButton).toBeInTheDocument();
    });

    it('should toggle play/pause when button is clicked', async () => {
      render(<ImageCarousel images={mockImages} autoPlay={true} interval={1000} />);
      
      const playPauseButton = screen.getByLabelText('Pause');
      await userEvent.click(playPauseButton);
      
      // Should now show play icon
      expect(screen.getByLabelText('Play')).toBeInTheDocument();
      
      // Advance time - should not change image
      act(() => {
        jest.advanceTimersByTime(1000);
      });
      
      // Should still be on first image
      expect(screen.getByAltText('Test Image 1')).toBeInTheDocument();
    });

    it('should not auto-play when autoPlay is false', () => {
      render(<ImageCarousel images={mockImages} autoPlay={false} interval={1000} />);
      
      // Advance time
      act(() => {
        jest.advanceTimersByTime(2000);
      });
      
      // Should still be on first image
      expect(screen.getByAltText('Test Image 1')).toBeInTheDocument();
    });
  });

  describe('Thumbnails functionality', () => {
    it('should show thumbnails when showThumbnails is true', () => {
      render(<ImageCarousel images={mockImages} showThumbnails={true} />);
      
      const thumbnails = screen.getAllByRole('button', { name: /Thumbnail/ });
      expect(thumbnails).toHaveLength(3);
    });

    it('should navigate when thumbnail is clicked', async () => {
      render(<ImageCarousel images={mockImages} showThumbnails={true} />);
      
      const thumbnails = screen.getAllByRole('button', { name: /Thumbnail/ });
      await userEvent.click(thumbnails[1]); // Click second thumbnail
      
      expect(screen.getByAltText('Test Image 2')).toBeInTheDocument();
    });

    it('should highlight current thumbnail', () => {
      render(<ImageCarousel images={mockImages} showThumbnails={true} />);
      
      const thumbnails = screen.getAllByRole('button', { name: /Thumbnail/ });
      expect(thumbnails[0]).toHaveClass('border-white');
    });
  });

  describe('Callbacks', () => {
    it('should call onSlideChange when slide changes', async () => {
      const mockOnSlideChange = jest.fn();
      render(<ImageCarousel images={mockImages} onSlideChange={mockOnSlideChange} />);
      
      const nextButton = screen.getByLabelText('Next image');
      await userEvent.click(nextButton);
      
      expect(mockOnSlideChange).toHaveBeenCalledWith(1);
    });

    it('should call onSlideChange when indicator is clicked', async () => {
      const mockOnSlideChange = jest.fn();
      render(<ImageCarousel images={mockImages} onSlideChange={mockOnSlideChange} />);
      
      const indicators = screen.getAllByRole('button', { name: /Go to image/ });
      await userEvent.click(indicators[2]);
      
      expect(mockOnSlideChange).toHaveBeenCalledWith(2);
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels', () => {
      render(<ImageCarousel images={mockImages} />);
      
      expect(screen.getByLabelText('Previous image')).toBeInTheDocument();
      expect(screen.getByLabelText('Next image')).toBeInTheDocument();
      expect(screen.getByLabelText('Go to image 1')).toBeInTheDocument();
      expect(screen.getByLabelText('Go to image 2')).toBeInTheDocument();
      expect(screen.getByLabelText('Go to image 3')).toBeInTheDocument();
    });

    it('should support keyboard navigation', async () => {
      render(<ImageCarousel images={mockImages} />);
      
      const nextButton = screen.getByLabelText('Next image');
      nextButton.focus();
      
      await userEvent.keyboard('{Enter}');
      
      expect(screen.getByAltText('Test Image 2')).toBeInTheDocument();
    });
  });

  describe('Edge cases', () => {
    it('should handle single image', () => {
      const singleImage = [mockImages[0]];
      render(<ImageCarousel images={singleImage} />);
      
      expect(screen.getByAltText('Test Image 1')).toBeInTheDocument();
      expect(screen.queryByLabelText('Next image')).toBeInTheDocument();
    });

    it('should handle missing alt text', () => {
      const imagesWithoutAlt = [
        { id: '1', src: 'test.jpg' }
      ];
      
      render(<ImageCarousel images={imagesWithoutAlt} />);
      
      const image = screen.getByRole('img');
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute('src', 'test.jpg');
    });

    it('should handle missing title/description', () => {
      const imagesMinimal = [
        { id: '1', src: 'test.jpg', alt: 'test' }
      ];
      
      render(<ImageCarousel images={imagesMinimal} />);
      
      expect(screen.queryByText('First Image')).not.toBeInTheDocument();
      expect(screen.queryByText('Description for first image')).not.toBeInTheDocument();
    });
  });
});

describe('useCarousel Hook', () => {
  const mockImages: CarouselImage[] = [
    { id: '1', src: 'test1.jpg', alt: 'test1' },
    { id: '2', src: 'test2.jpg', alt: 'test2' }
  ];

  it('should initialize with first image', () => {
    const TestComponent = () => {
      const { currentImage, currentIndex } = useCarousel(mockImages);
      
      return (
        <div>
          <span data-testid="current-index">{currentIndex}</span>
          <span data-testid="current-image">{currentImage.alt}</span>
        </div>
      );
    };
    
    render(<TestComponent />);
    
    expect(screen.getByTestId('current-index')).toHaveTextContent('0');
    expect(screen.getByTestId('current-image')).toHaveTextContent('test1');
  });

  it('should navigate to next image', async () => {
    const TestComponent = () => {
      const { currentImage, currentIndex, nextSlide } = useCarousel(mockImages);
      
      return (
        <div>
          <span data-testid="current-index">{currentIndex}</span>
          <span data-testid="current-image">{currentImage.alt}</span>
          <button onClick={nextSlide}>Next</button>
        </div>
      );
    };
    
    render(<TestComponent />);
    
    const nextButton = screen.getByText('Next');
    await userEvent.click(nextButton);
    
    expect(screen.getByTestId('current-index')).toHaveTextContent('1');
    expect(screen.getByTestId('current-image')).toHaveTextContent('test2');
  });

  it('should navigate to previous image', async () => {
    const TestComponent = () => {
      const { currentImage, currentIndex, nextSlide, prevSlide } = useCarousel(mockImages);
      
      return (
        <div>
          <span data-testid="current-index">{currentIndex}</span>
          <span data-testid="current-image">{currentImage.alt}</span>
          <button onClick={nextSlide}>Next</button>
          <button onClick={prevSlide}>Prev</button>
        </div>
      );
    };
    
    render(<TestComponent />);
    
    // Go to second image first
    const nextButton = screen.getByText('Next');
    await userEvent.click(nextButton);
    
    // Then go back
    const prevButton = screen.getByText('Prev');
    await userEvent.click(prevButton);
    
    expect(screen.getByTestId('current-index')).toHaveTextContent('0');
    expect(screen.getByTestId('current-image')).toHaveTextContent('test1');
  });

  it('should go to specific slide', async () => {
    const TestComponent = () => {
      const { currentImage, currentIndex, goToSlide } = useCarousel(mockImages);
      
      return (
        <div>
          <span data-testid="current-index">{currentIndex}</span>
          <span data-testid="current-image">{currentImage.alt}</span>
          <button onClick={() => goToSlide(1)}>Go to 1</button>
        </div>
      );
    };
    
    render(<TestComponent />);
    
    const goToButton = screen.getByText('Go to 1');
    await userEvent.click(goToButton);
    
    expect(screen.getByTestId('current-index')).toHaveTextContent('1');
    expect(screen.getByTestId('current-image')).toHaveTextContent('test2');
  });

  it('should toggle play/pause', async () => {
    const TestComponent = () => {
      const { isPlaying, togglePlayPause } = useCarousel(mockImages, { autoPlay: true });
      
      return (
        <div>
          <span data-testid="is-playing">{isPlaying ? 'playing' : 'paused'}</span>
          <button onClick={togglePlayPause}>Toggle</button>
        </div>
      );
    };
    
    render(<TestComponent />);
    
    expect(screen.getByTestId('is-playing')).toHaveTextContent('playing');
    
    const toggleButton = screen.getByText('Toggle');
    await userEvent.click(toggleButton);
    
    expect(screen.getByTestId('is-playing')).toHaveTextContent('paused');
  });

  it('should handle infinite navigation correctly', async () => {
    const TestComponent = () => {
      const { currentImage, currentIndex, nextSlide, prevSlide, canGoNext, canGoPrev } = useCarousel(mockImages, { infinite: false });
      
      return (
        <div>
          <span data-testid="current-index">{currentIndex}</span>
          <span data-testid="current-image">{currentImage.alt}</span>
          <span data-testid="can-go-next">{canGoNext ? 'yes' : 'no'}</span>
          <span data-testid="can-go-prev">{canGoPrev ? 'yes' : 'no'}</span>
          <button onClick={nextSlide}>Next</button>
          <button onClick={prevSlide}>Prev</button>
        </div>
      );
    };
    
    render(<TestComponent />);
    
    // At start
    expect(screen.getByTestId('can-go-prev')).toHaveTextContent('no');
    expect(screen.getByTestId('can-go-next')).toHaveTextContent('yes');
    
    // Go to last image
    const nextButton = screen.getByText('Next');
    await userEvent.click(nextButton);
    
    // At end
    expect(screen.getByTestId('can-go-prev')).toHaveTextContent('yes');
    expect(screen.getByTestId('can-go-next')).toHaveTextContent('no');
  });
});
