-- Makes the home page hero profile image editable through the CMS.
ALTER TABLE home
  ADD COLUMN IF NOT EXISTS profile_image text NOT NULL DEFAULT '/assets/headshot.jpeg';
