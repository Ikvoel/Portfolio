import { FeaturedProject } from './FeaturedProject';

/**
 * FEATURED PROJECTS - ONGOING WORKS
 *
 * This component displays multiple ongoing featured projects stacked vertically.
 * To add more projects, simply add a new object to the featuredProjects array below.
 *
 * Each project requires:
 * - title: Project name
 * - subtitle: Project type (e.g., "Short Film", "Music Video")
 * - description: Brief synopsis (1-2 sentences)
 * - image: Full image URL (use imgbb.com for hosting)
 * - category: Genre/type
 * - year: Production year
 * - status: Current status ("On Going", "Post-Production", "Pre-Production", etc.)
 * - videoUrl: Optional - Video preview URL (Google Drive preview or YouTube embed)
 */

const featuredProjects = [
  {
    title: 'My Hand, Her Signature',
    subtitle: 'Short Film',
    description: 'A young painter risks losing the most important exhibition of her career as another presence within herself continues to destroy her paintings.',
    image: 'https://i.ibb.co.com/xqZk5hdm/Still-2026-05-07-172137-1-53-2.jpg', // Video thumbnail - use a still image from your project
    category: 'Short Film',
    year: '2026',
    status: 'Post-Production',
    statusColor: 'yellow', // Options: 'yellow', 'red', 'green', 'blue', 'purple', 'orange'
    watermarkLogo: 'https://i.ibb.co.com/B5dk6Z9Q/logo-aftertone-white-color.png', // Your production company logo
    videoUrl: 'Not Available',
  },
  {
    title: 'Blue Before Dawn',
    subtitle: 'Short MV Film',
    description: 'On a quiet beach before sunrise, Julie allows herself to feel something she had long lost.',
    image: 'https://i.ibb.co.com/mFM9zg4r/pexels-aleksandr-neplokhov-486399-3971223.jpg', // REPLACE: Upload your actual still to imgbb.com
    category: 'Short MV Film',
    year: '2026',
    status: 'On Development',
    statusColor: 'red', // Different color for this project
    watermarkLogo: 'https://i.ibb.co.com/Wv7s4Nh6/kaiv-Logo.png', // Can use different logo per project
    videoUrl: 'Not Available',
  },
  {
    title: 'The Mute Room',
    subtitle: 'Short Film',
    description: 'In a room that never stays the same, Maya struggles to recognize the person she is becoming.',
    image: 'https://i.ibb.co.com/1t7NzkzP/pexels-santiago-balbuena-260670847-15471907.jpg', // REPLACE: Upload your actual still to imgbb.com
    category: 'Short Film',
    year: '2027',
    status: 'On Development',
    statusColor: 'red', // Different color for this project
    watermarkLogo: 'https://i.ibb.co.com/MD6xpWds/hsno-mark-f.png', // Can use different logo per project
    videoUrl: 'Not Available',
  },
  // Add more featured projects here as needed
];

export function FeaturedProjects() {
  return (
    <>
      {featuredProjects.map((project, index) => (
        <FeaturedProject key={index} project={project} />
      ))}
    </>
  );
}
