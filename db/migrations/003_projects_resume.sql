-- Editable content for the projects and resume pages.
--
-- Four more collections, same shape as `timeline`: an id, a `position` that
-- ascends from the top, and one column per field. Fields that render as a list
-- (bullets, tech tags, skills, links) are stored as newline-separated text so
-- they can be edited in a plain textarea, one item per line.
--
-- Values written with E'...' use \n to separate those list entries.

CREATE TABLE IF NOT EXISTS projects (
  id                serial PRIMARY KEY,
  position          integer NOT NULL DEFAULT 0,
  category          text NOT NULL DEFAULT 'web',
  title             text NOT NULL,
  short_description text NOT NULL DEFAULT '',
  details           text NOT NULL DEFAULT '',
  technologies      text NOT NULL DEFAULT '',
  media_type        text NOT NULL DEFAULT 'image',
  media_src         text NOT NULL,
  media_preview     text NOT NULL DEFAULT '',
  links             text NOT NULL DEFAULT '',
  updated_at        timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS projects_position_idx ON projects (position, id);

INSERT INTO projects (position, category, title, short_description, details, technologies, media_type, media_src, media_preview, links)
SELECT *
FROM (
  VALUES
    (0, 'web', 'QR Code Generator with Link Shortening',
     'Generates permanent QR codes for free, with optional link shortening to keep codes scannable even for long URLs.',
     E'Full-stack site that generates QR codes for free that last indefinitely.\nOriginally built as a resource for clubs and organizations at Cal Poly who kept running into expiring “free” QR code services.\nBackend uses an npm package to encode data into QR codes; the service is completely free and does not require sign-up or login.\nAdded an external link-shortening API backed by Postgres to handle very long URLs that would otherwise create dense QR codes.\nWhen a URL is longer than a certain threshold, the site stores it via the API and generates a QR code for the shorter redirect link instead.',
     E'JavaScript\nNode.js\nExpress\nEJS\nBootstrap\nAxios',
     'iframe', 'https://qr-code-generator-woad-rho.vercel.app', '/assets/qr.png',
     E'Live site | https://qr-code-generator-woad-rho.vercel.app\nGitHub | https://github.com/tristan-spear/qr-code-generator-website'),

    (1, 'web', 'MIT OpenCourseWare Site',
     'A blog-style site that helps students quickly browse and access MIT OpenCourseWare content across STEM subjects.',
     E'Full-stack blog-style site that condenses and simplifies MIT’s OpenCourseWare site into a cleaner experience.\nDesigned as a helpful resource for STEM students, making it easier to find and take MIT classes for free.\nBuilt with JavaScript, Node.js, Express, EJS templates, Bootstrap, jQuery, SCSS, and email support via nodemailer, and deployed on Vercel.',
     E'JavaScript\nNode.js\nExpress\nEJS\nBootstrap\njQuery\nNodemailer',
     'iframe', 'https://mit-opencourseware-site.vercel.app/', '/assets/mit.png',
     E'Live site | https://mit-opencourseware-site.vercel.app/\nGitHub | https://github.com/tristan-spear/mit-open-courseware-website'),

    (2, 'embedded', 'Custom Memory Allocator & Deallocator',
     'A custom malloc/free implementation that manages a simple heap using a linked list of memory chunks. Includes a small analyze() tool and a C++ version for testing on macOS.',
     E'Implemented a custom heap memory allocator & deallocator by manually moving the program break using brk() and sbrk().\nTracked memory as a doubly linked list of chunks, with metadata for block size, allocation state, and neighboring pointers.\nUsed a best-fit strategy to choose the smallest free block that satisfies each request to help reduce fragmentation.\nSupported splitting oversized free chunks during allocation and coalescing adjacent free chunks during free().\nManaged heap growth and shrinkage by moving the program break forward when needed and returning memory when the final chunk is freed.\nAdded an analyze() utility to inspect the heap layout and current program break while debugging.\nCreated a C++ version with a simulated heap and program break so it can be tested on macOS while keeping the low-level behavior.',
     E'C\nC++\nSystems Programming',
     'image', '/assets/memory_allocator.png', '',
     'GitHub | https://github.com/tristan-spear/memory-allocator-deallocator'),

    (3, 'embedded', 'Image Compressor & Decompressor',
     'Compresses and decompresses 24-bit BMP images using Huffman encoding and bit-level packing. Includes an optional quality (loss) setting to trade image fidelity for smaller files.',
     E'Wrote a compressor and decompressor for 24-bit BMP images using Huffman encoding.\nBuilt frequency tables and Huffman trees (separately for R/G/B) to generate variable-length codes.\nPacked the Huffman codes into bytes using bit operations so the output stays compact.\nSaved enough header/metadata in a custom output format so the image can be reconstructed during decompression.\nAdded a configurable quality/loss factor by quantizing color values to balance compression ratio and visual quality.',
     E'C\nHuffman Coding\nBit Manipulation',
     'image', '/assets/image-compressor.png', '',
     'GitHub | https://github.com/tristan-spear/image-compressor-decompressor')
) AS seed (position, category, title, short_description, details, technologies, media_type, media_src, media_preview, links)
WHERE NOT EXISTS (SELECT 1 FROM projects);


CREATE TABLE IF NOT EXISTS education (
  id         serial PRIMARY KEY,
  position   integer NOT NULL DEFAULT 0,
  degree     text NOT NULL,
  school     text NOT NULL DEFAULT '',
  years      text NOT NULL DEFAULT '',
  thumbnail  text NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS education_position_idx ON education (position, id);

-- `*(Expected)*` renders as italics, matching the <i> tag the page used before.
INSERT INTO education (position, degree, school, years, thumbnail)
SELECT *
FROM (
  VALUES
    (0, 'B.S. Software Engineering', 'Cal Poly - San Luis Obispo', '2025 - 2027 *(Expected)*', '/assets/learn.png'),
    (1, 'A.S. Math,  A.S. Computer Science', 'Cuesta College, San Luis Obispo', '2022 - 2025', '/assets/cuesta.jpeg')
) AS seed (position, degree, school, years, thumbnail)
WHERE NOT EXISTS (SELECT 1 FROM education);


CREATE TABLE IF NOT EXISTS experience (
  id         serial PRIMARY KEY,
  position   integer NOT NULL DEFAULT 0,
  title      text NOT NULL,
  company    text NOT NULL DEFAULT '',
  location   text NOT NULL DEFAULT '',
  date_range text NOT NULL DEFAULT '',
  thumbnail  text NOT NULL,
  bullets    text NOT NULL DEFAULT '',
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS experience_position_idx ON experience (position, id);

INSERT INTO experience (position, title, company, location, date_range, thumbnail, bullets)
SELECT *
FROM (
  VALUES
    (0, 'Web Developer', 'Cal Poly AIP (Academic Innovations & Programs)', 'San Luis Obispo, CA', 'Jan. 2026 - Present', '/assets/learn.png',
     E'Work under Cal Poly AIP to deliver various web projects under multiple departments across Cal Poly\nCollaborate with Amazon, AWS, and DxHub staff to deliver an internal dashboard showing Canvas course accessibility across Cal Poly at the college and department level, using real datasets to help meet CSU system-wide accessibility standards with UDOIT, Athena, and AWS QuickSight\nUse Drupal 7 and other web content management services to deliver official university webpages for departments and events'),

    (1, 'Full Stack Developer', 'Hack4Impact Cal Poly', 'San Luis Obispo, CA', 'Sep. 2025 - Present', '/assets/hack4impact.png',
     E'Implement full-stack features for nonprofit clients (Ecologistics, Habitat For Humanity) using React, Express, MongoDB, and Next.js, contributing to production code used by real organizations\nBuild and integrate REST APIs to support frontend workflows and features, collaborating with designers to translate Figma designs into responsive UI components\nCoordinate development tasks within a 10-person engineering team, working closely with tech leads to scope features, review pull requests, and meet sprint deadlines\nPractice Agile development through sprint planning, stand-ups, and retrospectives, delivering assigned features within sprint timelines'),

    (2, 'Programming & Robotics Instructor', 'iD Tech Camps - Stanford University', 'Stanford, CA', 'May 2024 - Aug. 2024', '/assets/stanford.png',
     E'Led and instructed week-long engineering courses in VEX robotics and programming, teaching Python and C++ to middle and high school students\nIndependently managed classrooms of 10-14 students, adapting instruction to different skill levels while maintaining structured timelines\nDeveloped lesson plans and technical exercises to reinforce core programming concepts and problem-solving skills'),

    (3, 'AI Researcher', 'Cal Poly, San Luis Obispo', 'San Luis Obispo, CA', 'Jan. 2024 - Jun. 2024', '/assets/learn.png',
     E'Built an AI-powered chatbot to answer student questions about Cal Poly staff, academics, and senior projects, working in a 5-person research team\nDesigned and implemented a user interest survey to collect structured feedback and improve LLM responses through prompt tuning and data refinement\nManaged project milestones and deliverables independently, meeting weekly deadlines, while balancing coursework'),

    (4, 'Computer Science Tutor', 'M.E.S.A Program - Cuesta College', 'San Luis Obispo, CA', 'Jan. 2024 - May 2025', '/assets/cuesta.jpeg',
     E'Provided one-on-one and small group tutoring for core CS classes, including Intro to Programming, Data Structures, Object-Oriented Programming, Computer Organization, and Discrete Math, supporting students across multiple semesters\nAssisted students with Java, Python, C/C++, and Assembly Language, helping debug code and clarify how code executes across different abstraction levels\nServed as lead tutor for the MESA program, completing 400+ tutoring hours, and supporting 30+ students, through sustained, semester-long academic improvement')
) AS seed (position, title, company, location, date_range, thumbnail, bullets)
WHERE NOT EXISTS (SELECT 1 FROM experience);


CREATE TABLE IF NOT EXISTS skills (
  id         serial PRIMARY KEY,
  position   integer NOT NULL DEFAULT 0,
  category   text NOT NULL,
  items      text NOT NULL DEFAULT '',
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS skills_position_idx ON skills (position, id);

INSERT INTO skills (position, category, items)
SELECT *
FROM (
  VALUES
    (0, 'Languages', E'Java\nC\nC++\nJavaScript\nHTML\nCSS\nPython\nSQL'),
    (1, 'Frameworks & Libraries', E'React\nNode.js\nExpress\nVite\nBootstrap'),
    (2, 'Tools & Technologies', E'Git\nGitHub\nVS Code\nIntelliJ\nZsh\nPostgreSQL\nMongoDB\nREST APIs')
) AS seed (position, category, items)
WHERE NOT EXISTS (SELECT 1 FROM skills);
