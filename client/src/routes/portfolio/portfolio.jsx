import React from 'react';
import ProjectCard from '../../components/projectCard/ProjectCard';
import memoryAllocatorImage from '../../assets/memory_allocator.png';
import imageCompressorImage from '../../assets/image-compressor.png';
import mitOpenCoursewareImage from '../../assets/mit.png';
import qrCodeImage from '../../assets/qr.png';
import './portfolio.css';

const WEB_PROJECTS = [
  {
    id: 'web-3',
    title: 'QR Code Generator with Link Shortening',
    shortDescription: 'Generates permanent QR codes for free, with optional link shortening to keep codes scannable even for long URLs.',
    description: [
      'Full-stack site that generates QR codes for free that last indefinitely.',
      'Originally built as a resource for clubs and organizations at Cal Poly who kept running into expiring “free” QR code services.',
      'Backend uses an npm package to encode data into QR codes; the service is completely free and does not require sign-up or login.',
      'Added an external link-shortening API backed by Postgres to handle very long URLs that would otherwise create dense QR codes.',
      'When a URL is longer than a certain threshold, the site stores it via the API and generates a QR code for the shorter redirect link instead.',
    ],
    technologies: ['JavaScript', 'Node.js', 'Express', 'EJS', 'Bootstrap', 'Axios'],
    media: {
      type: 'iframe',
      src: 'https://qr-code-generator-woad-rho.vercel.app',
      previewImage: qrCodeImage,
    },
    links: [
      { label: 'Live site', href: 'https://qr-code-generator-woad-rho.vercel.app' },
      { label: 'GitHub', href: 'https://github.com/tristan-spear/qr-code-generator-website' },
    ],
  },
  {
    id: 'web-2',
    title: 'MIT OpenCourseWare Site',
    shortDescription: 'A blog-style site that helps students quickly browse and access MIT OpenCourseWare content across STEM subjects.',
    description: [
      'Full-stack blog-style site that condenses and simplifies MIT’s OpenCourseWare site into a cleaner experience.',
      'Designed as a helpful resource for STEM students, making it easier to find and take MIT classes for free.',
      'Built with JavaScript, Node.js, Express, EJS templates, Bootstrap, jQuery, SCSS, and email support via nodemailer, and deployed on Vercel.',
    ],
    technologies: ['JavaScript', 'Node.js', 'Express', 'EJS', 'Bootstrap', 'jQuery', 'Nodemailer'],
    media: {
      type: 'iframe',
      src: 'https://mit-opencourseware-site.vercel.app/',
      previewImage: mitOpenCoursewareImage,
    },
    links: [
      { label: 'Live site', href: 'https://mit-opencourseware-site.vercel.app/' },
      { label: 'GitHub', href: 'https://github.com/tristan-spear/mit-open-courseware-website' },
    ],
  },
];

const EMBEDDED_PROJECTS = [
  {
    id: 'emb-1',
    title: 'Custom Memory Allocator & Deallocator',
    shortDescription: 'A custom malloc/free implementation that manages a simple heap using a linked list of memory chunks. Includes a small analyze() tool and a C++ version for testing on macOS.',
    description: [
      'Implemented a custom heap memory allocator & deallocator by manually moving the program break using brk() and sbrk().',
      'Tracked memory as a doubly linked list of chunks, with metadata for block size, allocation state, and neighboring pointers.',
      'Used a best-fit strategy to choose the smallest free block that satisfies each request to help reduce fragmentation.',
      'Supported splitting oversized free chunks during allocation and coalescing adjacent free chunks during free().',
      'Managed heap growth and shrinkage by moving the program break forward when needed and returning memory when the final chunk is freed.',
      'Added an analyze() utility to inspect the heap layout and current program break while debugging.',
      'Created a C++ version with a simulated heap and program break so it can be tested on macOS while keeping the low-level behavior.',
    ],
    technologies: ['C', 'C++', 'Systems Programming'],
    media: {
      type: 'image',
      src: memoryAllocatorImage,
    },
    links: [
      { label: 'GitHub', href: 'https://github.com/tristan-spear/memory-allocator-deallocator' },
    ],
  },
  {
    id: 'emb-2',
    title: 'Image Compressor & Decompressor',
    shortDescription: 'Compresses and decompresses 24-bit BMP images using Huffman encoding and bit-level packing. Includes an optional quality (loss) setting to trade image fidelity for smaller files.',
    description: [
      'Wrote a compressor and decompressor for 24-bit BMP images using Huffman encoding.',
      'Built frequency tables and Huffman trees (separately for R/G/B) to generate variable-length codes.',
      'Packed the Huffman codes into bytes using bit operations so the output stays compact.',
      'Saved enough header/metadata in a custom output format so the image can be reconstructed during decompression.',
      'Added a configurable quality/loss factor by quantizing color values to balance compression ratio and visual quality.',
    ],
    technologies: ['C', 'Huffman Coding', 'Bit Manipulation'],
    media: {
      type: 'image',
      src: imageCompressorImage,
    },
    links: [
      { label: 'GitHub', href: 'https://github.com/tristan-spear/image-compressor-decompressor' },
    ],
  },
];

function Portfolio() {
  return (
    <div className="portfolio">
      <header className="portfolio-hero">
        <h1 className="portfolio-hero-title hover-underline">Projects</h1>
        <p className="portfolio-hero-intro">
          Web applications and embedded systems I’ve built or contributed to.
        </p>
      </header>

      <section className="portfolio-section">
        <h2 className="portfolio-section-title">Web Projects</h2>
        <div className="portfolio-grid">
          {WEB_PROJECTS.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </section>

      <section className="portfolio-section">
        <h2 className="portfolio-section-title">Embedded Projects</h2>
        <div className="portfolio-grid">
          {EMBEDDED_PROJECTS.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </section>
    </div>
  );
}

export default Portfolio;
